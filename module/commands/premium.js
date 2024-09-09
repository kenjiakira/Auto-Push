const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');
const stream = require('stream');

const cacheDir = path.join(__dirname, '../commands/cache');
const premiumFilePath = path.join(__dirname, '../commands/json/premium.json');

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

const streamPipeline = promisify(stream.pipeline);

module.exports = {
    config: {
        name: "Premium",
        version: "1.0.0",
        hasPermission: 0,
        credits: "HNT",
        description: "Cách nâng cấp lên gói Premium.",
        usePrefix: true,
        commandCategory: "general",
        usages: "[thông tin nâng cấp Premium]",
        cooldowns: 0,
        dependencies: {}
    },

    run: async function({ api, event, args }) {
        const { threadID, messageID, senderID } = event;

        let premiumData;
        try {
            premiumData = await fs.readJSON(premiumFilePath);
        } catch (error) {
            console.error("Lỗi khi đọc file premium.json:", error);
            return api.sendMessage("Đã xảy ra lỗi khi kiểm tra thông tin Premium. Vui lòng thử lại sau.", threadID, messageID);
        }

        const user = premiumData[senderID];
        const isPremium = user ? user.isPremium : false;

        if (isPremium) {
            return api.sendMessage("Bạn đã có gói Premium. 😊", threadID, messageID);
        }

        const imageURL = "https://i.imgur.com/eIHIbRK.jpeg"; 
        const imageFileName = path.basename(imageURL);
        const imagePath = path.join(cacheDir, imageFileName);

        try {
            const response = await axios({
                url: imageURL,
                responseType: 'stream'
            });

            await streamPipeline(response.data, fs.createWriteStream(imagePath));

            return api.sendMessage({ body: "📣 -Thông Báo Nâng Cấp Premium-", attachment: fs.createReadStream(imagePath) }, threadID, messageID);
        } catch (error) {
            console.error("Lỗi khi xử lý ảnh:", error);
            return api.sendMessage("Đã xảy ra lỗi khi gửi ảnh. Vui lòng thử lại sau.", threadID, messageID);
        }
    }
};
