const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs-extra');
const path = require('path');

const apiConfigPath = path.join(__dirname, '../commands/json/api_config.json');

module.exports.config = {
    name: "quote",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Hoàng Ngọc Từ",
    description: "Đọc những câu nói nổi tiếng thế giới.",
    commandCategory: "fun",
    usePrefix: true,
    cooldowns: 5
};

let geminiApiKeys = [];     
let currentApiKeyIndex = 0;

const switchApiKey = () => {
    currentApiKeyIndex = (currentApiKeyIndex + 1) % geminiApiKeys.length;
};

const generateQuote = async () => {
    const prompt = "Hãy cung cấp một câu nói nổi tiếng của một nhân vật nổi tiếng trên thế giới.";
    while (true) {
        try {
            const genAI = new GoogleGenerativeAI(geminiApiKeys[currentApiKeyIndex]);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const result = await model.generateContent([{ text: prompt }]);
            return await result.response.text();
        } catch (error) {
            console.error(`Lỗi khi sử dụng API key ${geminiApiKeys[currentApiKeyIndex]}:`, error);
            switchApiKey();
            if (currentApiKeyIndex === 0) {
                throw new Error("Tất cả các API key đều gặp lỗi.");
            }
        }
    }
};

module.exports.run = async function({ api, event }) {
    try {
        const data = await fs.readFile(apiConfigPath, 'utf8');
        const apiConfig = JSON.parse(data);
        geminiApiKeys = apiConfig.gemini_api_keys;
    } catch (error) {
        console.error("Lỗi khi đọc tệp cấu hình:", error);
        return api.sendMessage("Có lỗi xảy ra khi đọc tệp cấu hình.", event.threadID);
    }

    try {
        const quote = await generateQuote();
        api.sendMessage(`Câu nói nổi tiếng:\n\n"${quote}"`, event.threadID);
    } catch (error) {
        console.error("Lỗi khi tạo câu nói nổi tiếng:", error);
        api.sendMessage("Có lỗi xảy ra khi tạo câu nói nổi tiếng. Vui lòng thử lại sau.", event.threadID);
    }
};
