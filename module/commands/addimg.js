const fs = require('fs');
const path = require('path');

const boyImagePath = path.join(__dirname, 'json', 'boy.json');
const imgurImagePath = path.join(__dirname, 'json', 'leakonly.json');

module.exports.config = {
    name: "addimg",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Hoàng Ngọc Từ",
    description: "Lệnh admin để thêm URL ảnh vào danh sách.",
    commandCategory: "Admin",
    usePrefix: true,
    usages: "Gửi ảnh để thêm vào danh sách. Cú pháp:\n- .addimg boy\n- .addimg leakonly imgur",
    cooldowns: 5
};

function readOrCreateData(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
    }
    const rawData = fs.readFileSync(filePath);
    let data;
    try {
        data = JSON.parse(rawData);
        if (!Array.isArray(data)) {
            data = [];
        }
    } catch (error) {
        data = [];
    }
    return data;
}

module.exports.run = async ({ api, event }) => {
    const { senderID, threadID, messageID, messageReply, args } = event;

    // Ensure args is defined
    if (!args || args.length < 1) {
        return api.sendMessage("Cú pháp không hợp lệ. Sử dụng: .addimg boy hoặc .addimg leakonly imgur", threadID, messageID);
    }

    const action = args[0];
    const source = args[1];

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
        if (action === 'boy') {
            const data = readOrCreateData(boyImagePath);
            imageUrls.forEach(url => data.push(url));
            fs.writeFileSync(boyImagePath, JSON.stringify(data, null, 2), 'utf8');
            return api.sendMessage(`Đã thêm ${imageUrls.length} URL ảnh vào danh sách boy.`, threadID, messageID);
        } else if (action === 'leakonly' && source === 'imgur') {
            const imgurData = readOrCreateData(imgurImagePath);
            imageUrls.forEach(url => imgurData.push(url));
            fs.writeFileSync(imgurImagePath, JSON.stringify(imgurData, null, 2), 'utf8');
            return api.sendMessage(`Đã thêm ${imageUrls.length} URL ảnh vào danh sách imgur.`, threadID, messageID);
        } else {
            return api.sendMessage("Cú pháp không hợp lệ. Sử dụng: .addimg boy hoặc .addimg leakonly imgur", threadID, messageID);
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage("Có lỗi xảy ra khi thêm URL ảnh.", threadID, messageID);
    }
};
