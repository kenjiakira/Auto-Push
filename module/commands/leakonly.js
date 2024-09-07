const fs = require('fs');
const path = require('path');
const axios = require('axios');

const cost = 10000;
const imagePath = path.join(__dirname, 'json', 'leakonly.json');
const groupsPath = path.join(__dirname, 'noti','groups.json');

function readOrCreateData(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
    }
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
}

function isNSFWGroup(threadID) {
    const groupsData = readOrCreateData(groupsPath);
    const group = groupsData.find(g => g.threadID === threadID);
    return group && group.SNFW === true;
}

module.exports.config = {
    name: "leakonly",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Hoàng Ngọc Từ",
    description: "Chỉ bán quạt",
    commandCategory: "Tài Chính",
    usePrefix: true,
    usages: [
            "Lệnh này chỉ thực hiện hành động khi được sử dụng trong nhóm NSFW.",
            "Khi sử dụng lệnh, bạn cần có ít nhất 10.000 xu trong tài khoản của mình.",
            "Lệnh này sẽ gửi cho bạn một số ảnh ngẫu nhiên từ danh sách ảnh đã lưu.",
            "Lưu ý: Lệnh chỉ hoạt động trong các nhóm được xác định là NSFW."
        ],
    cooldowns: 0
};

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

module.exports.run = async ({ api, event, Currencies }) => {
    const { senderID, threadID, messageID } = event;

    if (!isNSFWGroup(threadID)) {
        return api.sendMessage("Lệnh này chỉ có thể sử dụng trong các nhóm có nội dung NSFW.", threadID, messageID);
    }

    const userData = await Currencies.getData(senderID);
    const userMoney = userData.money || 0;

    if (userMoney < cost) {
        return api.sendMessage("Bạn không đủ tiền để nhận ảnh. Bạn cần ít nhất 10K xu.", threadID, messageID);
    }

    await Currencies.decreaseMoney(senderID, cost);

    const imgurImageUrls = readOrCreateData(imagePath);

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
            body: "Ảnh của bạn đây \n-10.000 xu",
            attachment: imagePaths.map(filePath => fs.createReadStream(filePath))
        }, threadID, () => {
            imagePaths.forEach(filePath => fs.unlinkSync(filePath));
        }, messageID);
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        return api.sendMessage("Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại sau.", threadID, messageID);
    }
};
