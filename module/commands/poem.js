const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs-extra');
const path = require('path');

const apiConfigPath = path.join(__dirname, '../commands/json/api_config.json');

module.exports.config = {
    name: "poem",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Hoàng Ngọc Từ",
    description: "Đọc một bài thơ theo nhiều thể loại.",
    commandCategory: "fun",
    usePrefix: true,
    cooldowns: 5
};
let geminiApiKeys = [];
let currentApiKeyIndex = 0;

const switchApiKey = () => {
    currentApiKeyIndex = (currentApiKeyIndex + 1) % geminiApiKeys.length;
};

const generatePoem = async (prompt) => {
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

    const poemTypes = [
        "Thơ lục bát",
        "Thơ song thất lục bát",
        "Thơ thất ngôn tứ tuyệt",
        "Thơ thất ngôn bát cú",
        "Thơ tự do",
        "Thơ hiện đại",
        "Thơ Đường luật",
        "Thơ Thất ngôn",
        "Thơ ca dao",
        "Thơ ngũ ngôn"
    ];

    let promptMessage = "Chọn thể loại thơ mà bạn muốn nghe:\n";
    for (let i = 0; i < poemTypes.length; i++) {
        promptMessage += `${i + 1}. ${poemTypes[i]}\n`;
    }

    api.sendMessage(promptMessage, event.threadID, (err, info) => {
        if (err) return console.error(err);

        global.client.handleReply.push({
            type: "choose_poem_type",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            poemTypes: poemTypes
        });
    });
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body } = event;
    const { poemTypes } = handleReply;

    if (senderID !== handleReply.author) return;

    const selectedType = parseInt(body.trim());

    if (isNaN(selectedType) || selectedType < 1 || selectedType > poemTypes.length) {
        return api.sendMessage("Lựa chọn không hợp lệ, vui lòng chọn lại.", threadID, messageID);
    }

    const selectedPoemType = poemTypes[selectedType - 1];

    const prompt = `Hãy tạo ra một bài thơ theo thể loại "${selectedPoemType}". Nội dung thơ nên phù hợp với văn hóa và phong cách của Việt Nam.`;

    try {
        const poem = await generatePoem(prompt);
        api.sendMessage(`Đây là bài thơ theo thể loại "${selectedPoemType}":\n\n${poem}`, threadID);
    } catch (error) {
        console.error("Lỗi khi tạo thơ:", error);
        api.sendMessage("Có lỗi xảy ra khi tạo thơ. Vui lòng thử lại sau.", threadID);
    }
};