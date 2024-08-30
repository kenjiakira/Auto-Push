const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs-extra");
const path = require("path");
const axios = require('axios');

const API_KEYS = [
  "AIzaSyDMp6YNWYUw_wQBdv4DjkAOvZXJv7ITRy0",  
  "AIzaSyDysChx19Lu3hAFpE2knZwkoCWGTN2gfy0",
  "AIzaSyCTvL29weT4BIn7WtFtTvsaQ5Jt6Dm4mBE",
  "AIzaSyDoCGS2-hagw5zWVMfL5iqAVRFNivtbam4",
  "AIzaSyASuW0stXR61_xJ3s0XP3Qw0RoudGCjQRQ",
  "AIzaSyC78Dqs1rdEfj4JcmlSFEBhJZLOJzWmt_Y",
  "AIzaSyDpqfVtdyGLfipEdRNFfUQbCH-prn1sHEs",
  "AIzaSyArI6Ww02Ill7b6Bx5itiKlHD62siAFLIc",
  "AIzaSyBgYVR81UeL7kYouxcwzUL75YOBafgNphU" 
] 
const conversationHistory = {};
const jsonFilePath = path.resolve(__dirname, 'json', 'gemini.json');

const readDataFromFile = async () => {
  try {
    if (await fs.pathExists(jsonFilePath)) {
      const data = await fs.readJson(jsonFilePath);
      Object.assign(conversationHistory, data);
    }
  } catch (error) {
    console.error("Lỗi khi đọc tệp JSON:", error);
  }
};

const saveDataToFile = async () => {
  try {
    await fs.writeJson(jsonFilePath, conversationHistory, { spaces: 2 });
  } catch (error) {
    console.error("Lỗi khi ghi tệp JSON:", error);
  }
};

readDataFromFile();

const cooldowns = {};

const COOLDOWN_TIME = 10000;

const generateContentWithAPI = async (apiKey, fullPrompt, imageParts) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent([{ text: fullPrompt }, ...imageParts]);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Lỗi khi sử dụng API:", error);
    throw error; 
  }
};

module.exports = {
  config: {
    name: "gemini",
    version: "1.0.0",
    hasPermission: 0,
    credits: "HNT",
    description: "Tạo văn bản và phân tích hình ảnh bằng Gemini",
    usePrefix: true,
    commandCategory: "general",
    usages: "[prompt] - Nhập một prompt để tạo nội dung văn bản và phân tích ảnh (nếu có).",
    cooldowns: 0,
    dependencies: {
      "@google/generative-ai": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID, senderID, messageReply } = event;

    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage("Vui lòng nhập một prompt.", threadID, messageID);
    }

    const now = Date.now();
    if (cooldowns[senderID] && now - cooldowns[senderID] < COOLDOWN_TIME) {
      const timeLeft = Math.ceil((COOLDOWN_TIME - (now - cooldowns[senderID])) / 1000);
      return api.sendMessage(`Bạn phải chờ thêm ${timeLeft} giây trước khi gửi lệnh tiếp theo.`, threadID, messageID);
    }

    cooldowns[senderID] = now;

    try {
      if (!Array.isArray(conversationHistory[senderID])) {
        conversationHistory[senderID] = [];
      }

      conversationHistory[senderID].push(`User: ${prompt}`);

      const context = conversationHistory[senderID].join("\n");
      const fullPrompt = `${context}\nTrả lời bằng tiếng Việt:`;

      let imageParts = [];

      if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
        const attachments = messageReply.attachments.filter(att => att.type === 'photo');

        for (const attachment of attachments) {
          const fileUrl = attachment.url;
          const tempFilePath = path.join(__dirname, 'cache', `temp_image_${Date.now()}.jpg`);

          const response = await axios({
            url: fileUrl,
            responseType: 'stream'
          });

          const writer = fs.createWriteStream(tempFilePath);
          response.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          const fileData = fs.readFileSync(tempFilePath);
          const base64Image = Buffer.from(fileData).toString('base64');

          imageParts.push({
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg'
            }
          });

          fs.unlinkSync(tempFilePath);
        }
      }

      let responseText = '';
      for (const apiKey of API_KEYS) {
        try {
          responseText = await generateContentWithAPI(apiKey, fullPrompt, imageParts);
          break;  
        } catch (error) {
          console.error(`API Key ${apiKey} gặp lỗi. Thử API Key khác...`);
        }
      }

      if (!responseText) {
        throw new Error("Tất cả các API đều gặp lỗi.");
      }

      conversationHistory[senderID].push(`Bot: ${responseText}`);

      await saveDataToFile();

      return api.sendMessage(responseText, threadID, messageID);

    } catch (error) {
      console.error("Lỗi khi tạo nội dung:", error);
      return api.sendMessage("GPU quá tải, Vui lòng thử lại sau.", threadID, messageID);
    }
  }
};
