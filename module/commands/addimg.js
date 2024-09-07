const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const imgurClientId = '34dc774b8c0ddae'; // Thay thế bằng Client-ID của bạn
const imagePath = path.join(__dirname, 'json', 'leakonly.json');

function readOrCreateData() {
    if (!fs.existsSync(imagePath)) {
        fs.writeFileSync(imagePath, JSON.stringify([]), 'utf8');
    }
    const rawData = fs.readFileSync(imagePath);
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

async function uploadToImgur(imageBuffer) {
    try {
        const form = new FormData();
        form.append('image', imageBuffer);

        const response = await axios.post('https://api.imgur.com/3/image', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Client-ID ${imgurClientId}`
            }
        });

        if (response.data && response.data.data && response.data.data.link) {
            return response.data.data.link;
        } else {
            throw new Error('Không nhận được liên kết từ Imgur');
        }
    } catch (error) {
        console.error('Lỗi khi tải ảnh lên Imgur:', error);
        throw new Error('Không thể tải ảnh lên Imgur');
    }
}

module.exports.config = {
    name: "addimg",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Hoàng Ngọc Từ",
    description: "Thêm URL ảnh vào danh sách",
    commandCategory: "Admin",
    usePrefix: true,
    usages: "Gửi ảnh để thêm vào danh sách",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const { senderID, threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
        return api.sendMessage("Vui lòng reply với ít nhất một ảnh để thêm vào danh sách.", threadID, messageID);
    }

    const imageAttachments = messageReply.attachments
        .filter(attachment => attachment.type === 'photo')
        .map(attachment => attachment.url);

    if (imageAttachments.length === 0) {
        return api.sendMessage("Không có ảnh hợp lệ được đính kèm.", threadID, messageID);
    }

    try {
        const data = readOrCreateData();
        for (const imageUrl of imageAttachments) {
            // Tải ảnh từ URL
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imgurLink = await uploadToImgur(imageResponse.data);
            data.push(imgurLink);
        }
        fs.writeFileSync(imagePath, JSON.stringify(data, null, 2), 'utf8');
        return api.sendMessage(`Đã thêm ${imageAttachments.length} URL ảnh vào danh sách.`, threadID, messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage("Có lỗi xảy ra khi thêm URL ảnh.", threadID, messageID);
    }
};
