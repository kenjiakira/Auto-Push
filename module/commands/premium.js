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

            const premiumInfo = `
📣 Nâng cấp lên Premium ngay hôm nay!

⋗🌟 Gói Premium (149,000 VNĐ/tháng)⋖

⋗Đặc quyền cho lệnh CapAI:⋖
    1. Không giới hạn số lần sử dụng
    2. Phân tích hình ảnh chi tiết và chuyên sâu
    3. Cho phép gửi văn bản kèm theo hình ảnh
    4. Độ dài đầu ra tối đa: 1000 tokens
    5. Sử dụng mô hình Gemini Pro: Nhanh chóng và chính xác hơn

⋗Đặc quyền cho lệnh Gemini:⋖
    1. Sử dụng mô hình Gemini Pro: Mạnh mẽ, xử lý phức tạp, sáng tạo
    2. Độ dài đầu ra tối đa: 1000 tokens
    3. Độ sáng tạo: Cao

⋗Đặc quyền khác:⋖
    1. Nhận gấp 3 lần xu miễn phí mỗi ngày
    2. Sử dụng miễn phí tất cả các lệnh khác (trừ lệnh Admin)

⋗🆓 Gói Free⋖

- Giới hạn 5 lần sử dụng/ngày
- Phân tích hình ảnh cơ bản
- Không thể gửi văn bản kèm theo hình ảnh
- Độ dài đầu ra tối đa: 350 tokens
- Sử dụng mô hình Gemini-1.5-Flash
- Độ sáng tạo: Bình thường
- Một số lệnh cơ bản miễn phí
Cách nâng cấp: Chuyển khoản 149,000 VNĐ vào tài khoản ngân hàng theo hướng dẫn để nhận gói Premium và sử dụng các quyền lợi đặc biệt! 😊`;

            return api.sendMessage({ body: premiumInfo, attachment: fs.createReadStream(imagePath) }, threadID, messageID);
        } catch (error) {
            console.error("Lỗi khi xử lý ảnh:", error);
            return api.sendMessage("Đã xảy ra lỗi khi gửi ảnh. Vui lòng thử lại sau.", threadID, messageID);
        }
    }
};
