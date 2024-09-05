const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs-extra');
const { loadImage, createCanvas, registerFont } = require("canvas");
const axios = require('axios');
const path = require('path');
const moment = require("moment-timezone");

const apiConfigPath = path.join(__dirname, '../commands/json/api_config.json');
const fontlink = 'https://drive.google.com/u/0/uc?id=1ZwFqYB-x6S9MjPfYm3t3SP1joohGl4iw&export=download';

module.exports.config = {
  name: "join",
  eventType: ['log:subscribe'],
  version: "1.0.0",
  credits: "Mirai-Team", 
  description: "Thông báo gia nhập nhóm với thông báo ngắn gọn.",
  commandCategory: "system",
  usePrefix: false
};

module.exports.circle = async (image) => {
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
};

module.exports.run = async function({ api, event, Users }) {
  let apiConfig;
  let geminiApiKeys = [];
  let currentApiKeyIndex = 0;

  try {
    const data = await fs.readFile(apiConfigPath, 'utf8');
    apiConfig = JSON.parse(data);
    geminiApiKeys = apiConfig.gemini_api_keys;
  } catch (error) {
    console.error("Lỗi khi đọc tệp cấu hình:", error);
    return api.sendMessage("Có lỗi xảy ra khi đọc tệp cấu hình.", event.threadID);
  }

  const switchApiKey = () => {
    currentApiKeyIndex = (currentApiKeyIndex + 1) % geminiApiKeys.length;
  };

  const generateMessage = async (prompt) => {
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

  const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY");
  const threadID = event.threadID;
  let threadInfo = await api.getThreadInfo(event.threadID);
  let threadName = threadInfo.threadName;

  if (!event.logMessageData.addedParticipants || !Array.isArray(event.logMessageData.addedParticipants)) {
    return;
  }

  if (event.logMessageData.addedParticipants && Array.isArray(event.logMessageData.addedParticipants) && event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`𝗕𝗢𝗧 ${(!global.config.BOTNAME) ? "Buddy" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    return api.sendMessage("", event.threadID, () => api.sendMessage({ body: `${global.config.BOTNAME} kết nối thành công!\nPrefix: ${global.config.PREFIX}\nGõ ${global.config.PREFIX}help để xem các lệnh.`, attachment: fs.createReadStream(__dirname + "/cache/join/join.gif") }, threadID));
  } else {
    try {
      if (!fs.existsSync(__dirname + `/cache/font/Semi.ttf`)) {
        let getfont = (await axios.get(fontlink, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `/cache/font/Semi.ttf`, Buffer.from(getfont, "utf-8"));
      }

      const addedParticipants = event.logMessageData.addedParticipants;
      const names = addedParticipants.map(p => p.fullName).join(', ');
      const prompt = `Chào mừng ${names} gia nhập nhóm "${threadName}" vào lúc ${time}. Hãy gửi lời chào và chúc mừng họ!`;

      const responseText = await generateMessage(prompt);

      api.sendMessage(responseText, threadID);
    } catch (e) {
      console.error("Lỗi khi gửi thông báo:", e);
      return api.sendMessage("Có lỗi xảy ra khi gửi thông báo chào mừng.", event.threadID);
    }
  }
};
