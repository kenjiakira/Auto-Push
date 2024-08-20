const fs = require('fs');
const path = require('path');
const axios = require('axios');

const cost = 10000; 
const imagePath = path.join(__dirname, 'json', 'boy.json');

function readOrCreateData(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
    }
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
}

async function downloadImage(url, outputPath) {
    const response = await axios({
        url: url,
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

module.exports.config = {
    name: "boy",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Hoàng Ngọc Từ",
    description: "Gửi ảnh boy",
    commandCategory: "Tài Chính",
    usePrefix: false,
    usages: [
        "Lệnh này gửi cho bạn một số ảnh boy từ danh sách ảnh đã lưu."
    ],
    cooldowns: 10
};

module.exports.run = async ({ api, event }) => {
    const { senderID, threadID, messageID } = event;


    const imgurImageUrls = readOrCreateData(imagePath);
    const totalImages = imgurImageUrls.length; 

    if (totalImages === 0) {
        return api.sendMessage("Danh sách ảnh không có ảnh nào. Vui lòng thêm ảnh vào danh sách trước.", threadID, messageID);
    }

    const selectedUrls = [];
    while (selectedUrls.length < 1 && imgurImageUrls.length > 0) {
        const randomIndex = Math.floor(Math.random() * imgurImageUrls.length);
        const url = imgurImageUrls.splice(randomIndex, 1)[0];
        selectedUrls.push(url);
    }

    const imagePaths = [];
    try {
        for (const url of selectedUrls) {
            const outputPath = path.join(__dirname, 'cache', `temp_image_${Date.now()}.png`);
            await downloadImage(url, outputPath);
            imagePaths.push(outputPath);
        }

        api.sendMessage({
            body: `Ảnh boy của bạn đây. Tổng số ảnh trong album: ${totalImages}`,
            attachment: imagePaths.map(filePath => fs.createReadStream(filePath))
        }, threadID, () => {
            imagePaths.forEach(filePath => fs.unlinkSync(filePath));
        }, messageID);
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        return api.sendMessage("Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại sau.", threadID, messageID);
    }
};
