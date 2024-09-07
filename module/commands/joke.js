const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs').promises;
const path = require('path');

const apiConfigPath = path.join(__dirname, '../commands/json/api_config.json');

const jokeCategories = [
  "câu chuyện cười dân gian",
  "câu chuyện cười ngắn",
  "câu chuyện cười học đường",
  "câu chuyện cười gia đình",
  "câu chuyện cười công sở",
  "câu chuyện cười tình yêu",
  "câu chuyện cười hài hước",
  "câu chuyện cười về động vật",
  "câu chuyện cười vui vẻ",
  "câu chuyện cười thể thao"
];

module.exports.config = {
  name: "joke",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Hoàng Ngọc Từ",
  description: "Cung cấp một câu chuyện cười",
  commandCategory: "fun",
  usePrefix: true,
  cooldowns: 5
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { messageID, userID, geminiApiKeys } = handleReply;
  const choice = parseInt(event.body.trim());

  if (isNaN(choice) || choice < 1 || choice > 10) {
    return api.sendMessage("Số bạn chọn không hợp lệ. Vui lòng chọn từ 1 đến 10.", event.threadID, event.messageID);
  }

  const category = jokeCategories[choice - 1];
  let lastError = null;

  for (let i = 0; i < geminiApiKeys.length; i++) {
    const apiKey = geminiApiKeys[i];

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Hãy tạo ra một câu chuyện cười theo thể loại "${category}", ngắn gọn, thuần Việt,sử dụng các Emoji để thêm sinh động, hài hước và có ý nghĩa. 
        Câu chuyện nên dễ hiểu, phản ánh tinh thần vui vẻ và thông minh của người Việt.
      `;

      const result = await model.generateContent([{ text: prompt }]);
      const responseText = await result.response.text();

      return api.sendMessage(responseText, event.threadID);
    } catch (error) {
      console.error(`Lỗi khi sử dụng API key ${apiKey}:`, error);
      lastError = error;
    }
  }

  console.error("Tất cả các API key đều không hoạt động.");
  api.sendMessage("Có lỗi xảy ra khi tạo câu chuyện cười. Vui lòng thử lại sau.", event.threadID);
};

module.exports.run = async function({ api, event }) {
  let apiConfig;

  try {
    const data = await fs.readFile(apiConfigPath, 'utf8');
    apiConfig = JSON.parse(data);
  } catch (error) {
    console.error("Lỗi khi đọc tệp cấu hình:", error);
    return api.sendMessage("Có lỗi xảy ra khi đọc tệp cấu hình.", event.threadID);
  }

  const geminiApiKeys = apiConfig.gemini_api_keys;

  const message = `[ CHỌN THỂ LOẠI CÂU CHUYỆN CƯỜI ]\n━━━━━━━━━━━━━\nChọn thể loại câu chuyện cười bạn muốn (1 đến 10):\n${jokeCategories.map((cat, index) => `${index + 1}. ${cat}`).join('\n')}`;

  api.sendMessage(message, event.threadID, (error, info) => {
    if (error) {
      console.error("Lỗi khi gửi tin nhắn chọn thể loại:", error);
      return api.sendMessage("Có lỗi xảy ra khi gửi tin nhắn chọn thể loại.", event.threadID);
    }

    global.client.handleReply.push({
      type: "joke",
      name: "joke",
      messageID: info.messageID,
      userID: event.senderID,
      geminiApiKeys: geminiApiKeys
    });
  });
};
