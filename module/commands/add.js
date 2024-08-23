const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, 'json', 'boy.json');

module.exports.config = {
    name: "add",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Hoàng Ngọc Từ",
    description: "lệnh admin",
    commandCategory: "Admin",
    usePrefix: true,
    usages: "Gửi ảnh để thêm vào danh sách",
    cooldowns: 0
};

function readOrCreateData(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
    }
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
}

module.exports.run = async ({ api, event }) => {
    const { senderID, threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
        return api.sendMessage("Vui lòng reply với ít nhất một ảnh để thêm vào danh sách.", threadID, messageID);
    }

    const imageUrls = messageReply.attachments
        .filter(attachment => attachment.type === 'photo')
        .map(attachment => attachment.url);

    if (imageUrls.length === 0) {
        return api.sendMessage("Không có ảnh hợp lệ được đính kèm.", threadID, messageID);
    }

    try {
        const data = readOrCreateData(imagePath);
        imageUrls.forEach(url => data.push(url));
        fs.writeFileSync(imagePath, JSON.stringify(data, null, 2), 'utf8');
        return api.sendMessage(`Đã thêm ${imageUrls.length} URL ảnh vào danh sách.`, threadID, messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage("Có lỗi xảy ra khi thêm URL ảnh.", threadID, messageID);
    }
};
