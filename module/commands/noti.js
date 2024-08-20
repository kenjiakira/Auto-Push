const fs = require('fs');
const path = require('path');
const axios = require('axios');
const groupsPath = path.join(__dirname, '../../module/commands/noti/groups.json');
const bannedGroupsPath = path.join(__dirname, '../../module/commands/noti/bannedGroups.json');
const notiPath = path.join(__dirname, 'cache', 'noti');

function readOrCreateFile(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData), 'utf8');
    }
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
}

function saveToFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
}

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

async function updateGroupName(threadID, api) {
    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const groupName = threadInfo.name;
        let groups = readOrCreateFile(groupsPath);

        groups = groups.map(group => {
            if (group.threadID === threadID) {
                return { ...group, name: groupName };
            }
            return group;
        }).filter(group => group.name !== null);

        saveToFile(groupsPath, groups);
    } catch (error) {
        console.error(`Lỗi khi cập nhật tên nhóm: ${error}`);
    }
}

async function getUserName(api, userID) {
    try {
        const userInfo = await api.getUserInfo(userID);
        return userInfo[userID].name;
    } catch (error) {
        console.error(error);
        return "người dùng";
    }
}

module.exports.config = {
    name: "noti",
    version: "2.0.1", 
    hasPermission: 2,
    credits: "HNT",
    description: "Lệnh admin để gửi thông báo đến các nhóm, gắn thẻ tất cả người dùng nếu sử dụng 'all'.",
    commandCategory: "admin",
    usePrefix: true,
    usages: "noti [nội dung] hoặc noti all [nội dung]",
    cooldowns: 0
};

module.exports.run = async function({ event, api, args }) {
    const { threadID, messageID, senderID, messageReply } = event;

    if (!global.config.ADMINBOT.includes(senderID)) {
        return api.sendMessage("Bạn không có quyền sử dụng lệnh này.", threadID, messageID);
    }

    const groups = readOrCreateFile(groupsPath);
    const bannedGroups = readOrCreateFile(bannedGroupsPath);

    if (!args.length) {
        return api.sendMessage("Vui lòng nhập nội dung tin nhắn hoặc trả lời một ảnh hoặc video để gửi.", threadID, messageID);
    }

    const commandType = args[0].toLowerCase();
    const messageContent = args.slice(1).join(" ");
    const adminName = await getUserName(api, senderID);
    const notificationMessage = `📢 Thông báo từ Admin ${adminName}:\n${messageContent || ""}`;

    const filteredGroups = groups.filter(group => !bannedGroups.includes(group.threadID));

    if (messageReply) {
        const attachments = messageReply.attachments || [];

        if (attachments.length > 0) {
            const { type, url } = attachments[0];
            const tempFilePath = path.join(notiPath, `temp_file.${type === 'video' ? 'mp4' : 'jpg'}`);
            ensureDirectoryExistence(tempFilePath);

            try {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                fs.writeFileSync(tempFilePath, response.data);

                let sentCount = 0;
                for (const group of filteredGroups) {
                    try {
                        const groupInfo = await api.getThreadInfo(group.threadID);
                        const memberIDs = groupInfo.participantIDs;
                        let mentions = [];
                        let body = notificationMessage;

                        if (commandType === 'all') {
                            for (const idUser of memberIDs) {
                                body = "‎" + body; 
                                mentions.push({ id: idUser, tag: body, fromIndex: -1 });
                            }
                        }

                        await api.sendMessage({ body, attachment: fs.createReadStream(tempFilePath), mentions }, group.threadID);
                        sentCount++;
                    } catch (error) {
                        console.error(`Lỗi khi gửi ${type} đến nhóm ${group.threadID}:`, error);
                    }
                }

                fs.unlinkSync(tempFilePath);
                return api.sendMessage(`Đã gửi ${type} đến ${sentCount} nhóm.`, threadID, messageID);
            } catch (error) {
                return api.sendMessage(`Đã xảy ra lỗi khi tải ${type}.`, threadID, messageID);
            }
        } else {
            return api.sendMessage("Không tìm thấy đính kèm hợp lệ trong tin nhắn trả lời.", threadID, messageID);
        }
    } else {
        if (filteredGroups.length === 0) {
            return api.sendMessage("Hiện tại bot không tham gia nhóm nào hoặc tất cả các nhóm đều bị cấm.", threadID, messageID);
        }

        let sentCount = 0;
        for (const group of filteredGroups) {
            try {
                const groupInfo = await api.getThreadInfo(group.threadID);
                const memberIDs = groupInfo.participantIDs;
                let mentions = [];
                let body = notificationMessage;

                if (commandType === 'all') {
                    for (const idUser of memberIDs) {
                        body = "‎" + body; 
                        mentions.push({ id: idUser, tag: body, fromIndex: -1 });
                    }
                }

                await api.sendMessage({ body, mentions }, group.threadID);
                sentCount++;
            } catch (error) {
                console.error(`Lỗi khi gửi tin nhắn đến nhóm ${group.threadID}:`, error);
            }
        }

        return api.sendMessage(`Đã gửi tin nhắn đến ${sentCount} nhóm.`, threadID, messageID);
    }
};


module.exports.handleEvent = async function({ event, api }) {
    const { threadID } = event;
    let groups = readOrCreateFile(groupsPath);

    if (!groups.find(group => group.threadID === threadID)) {
        groups.push({ threadID, name: null }); // Thêm nhóm với tên null
        saveToFile(groupsPath, groups);
    }

    // Cập nhật tên nhóm và xóa nếu cần
    await updateGroupName(threadID, api);

    return;
};
