const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const imagePath = path.join(__dirname, 'json', 'boy.json');

const IMGUR_CLIENT_ID = '34dc774b8c0ddae';

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

async function uploadToImgur(image) {
    try {
        const form = new FormData();
        form.append('image', image);

        const response = await axios.post('https://api.imgur.com/3/image', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
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
        const data = readOrCreateData(imagePath);

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
