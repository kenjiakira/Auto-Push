const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs-extra");
const path = require("path");

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
];

const conversationHistory = {};
const jsonFilePath = path.resolve(__dirname, 'json', 'gemini.json');
const USAGE_FILE_PATH = path.resolve(__dirname, 'json', 'premium.json');

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

const readUsageData = async () => {
  try {
    if (await fs.pathExists(USAGE_FILE_PATH)) {
      return await fs.readJson(USAGE_FILE_PATH);
    } else {
      return {};
    }
  } catch (error) {
    console.error("Lỗi khi đọc tệp dữ liệu sử dụng:", error);
    return {};
  }
};

readDataFromFile();

const generateContentWithAPI = async (apiKey, fullPrompt, isPremium) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: isPremium ? "gemini-1.5-pro" : "gemini-1.5-flash", 
      generationConfig: {
        maxOutputTokens: isPremium ? 1000 : 200,
        temperature: isPremium ? 1.5 : 0.8
      }
    });

    const result = await model.generateContent([{ text: fullPrompt }]);
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
    version: "1.0.1", 
    hasPermission: 0,
    credits: "HNT",
    description: "Tạo văn bản bằng AI",
    usePrefix: true,
    commandCategory: "general",
    usages: "[prompt] - Nhập một prompt để tạo nội dung văn bản.",
    cooldowns: 0,
    dependencies: {
      "@google/generative-ai": "",
      "fs-extra": ""
    }
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID, senderID, messageReply } = event;

    const customParamsRegex = /--max_tokens=(\d+)\s+--temperature=([\d.]+)/i;
    const match = args.join(" ").match(customParamsRegex);
    if (match) {
      maxOutputTokens = parseInt(match[1]);
      temperature = parseFloat(match[2]);
      args = args.slice(0, match.index).concat(args.slice(match.index + match[0].length)); 
    }

    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage("Vui lòng nhập một prompt.", threadID, messageID);
    }

    if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
      const hasImage = messageReply.attachments.some(att => att.type === 'photo');
      if (hasImage) {
        return api.sendMessage("Để phân tích hình ảnh, vui lòng sử dụng lệnh `.picai` và reply hình ảnh bạn muốn phân tích.", threadID, messageID);
      }
    }
    const usageData = await readUsageData();
    const isPremium = usageData[senderID]?.isPremium || false; 

    try {
      if (!Array.isArray(conversationHistory[senderID])) {
        conversationHistory[senderID] = [];
      }

      conversationHistory[senderID].push(`User: ${prompt}`);

      const context = conversationHistory[senderID].join("\n");
      const fullPrompt = `${context}\nTrả lời bằng tiếng Việt:`;

      let responseText = '';
      for (const apiKey of API_KEYS) {
        try {
          responseText = await generateContentWithAPI(apiKey, fullPrompt, isPremium); 
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
      return api.sendMessage("Lỗi khi tạo nội dung. Vui lòng thử lại sau.", threadID, messageID);
    }
  }
};