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
];

const USAGE_FILE_PATH = path.resolve(__dirname, 'json', 'premium.json');
const COOLDOWN_TIME = 10000;
const FREE_DAILY_LIMIT = 5;
const PREMIUM_COOLDOWN_TIME = 10000;

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

const saveUsageData = async (data) => {
  try {
    await fs.writeJson(USAGE_FILE_PATH, data, { spaces: 2 });
  } catch (error) {
    console.error("Lỗi khi ghi tệp dữ liệu sử dụng:", error);
  }
};

const getCurrentDateKey = () => {
  const date = new Date();
  date.setHours(date.getHours() + 7); 
  return date.toISOString().split('T')[0];
};

const generateContentWithAPI = async (apiKey, prompt, imageParts, isPremium) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        maxOutputTokens: isPremium ? 1000 : 350,
        temperature: isPremium ? 1.5 : 0.8,
      }
    });

    const result = await model.generateContent([{ text: prompt }, ...imageParts]);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Lỗi API:", error);
    throw error;
  }
};

module.exports = {
  config: {
    name: "picai",
    version: "1.0.0",
    hasPermission: 0,
    credits: "HNT",
    description: "Phân tích hình ảnh bằng AI",
    usePrefix: true,
    commandCategory: "general",
    usages: "[Reply to an image to analyze]",
    cooldowns: 0,
    dependencies: {
      "@google/generative-ai": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID, senderID, messageReply } = event;
    const usageData = await readUsageData();

    if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
      const hasImage = messageReply.attachments.some(att => att.type === 'photo');
      const isPremium = usageData[senderID]?.isPremium;

      if (!isPremium && args.length > 0) {
        return api.sendMessage("Người dùng miễn phí không thể gửi văn bản kèm theo hình ảnh. Vui lòng chỉ reply hình ảnh để phân tích.", threadID, messageID);
      }
    }

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("Vui lòng reply một hình ảnh để phân tích.", threadID, messageID);
    }

    const dateKey = getCurrentDateKey();
    const userUsage = usageData[senderID] || { lastUsedDate: null, count: 0, isPremium: false };

    if (userUsage.lastUsedDate !== dateKey) {
      userUsage.lastUsedDate = dateKey;
      userUsage.count = 0;
    }

    if (!userUsage.isPremium && userUsage.count >= FREE_DAILY_LIMIT) {
      return api.sendMessage("Bạn đã vượt quá giới hạn sử dụng miễn phí hàng ngày. Vui lòng nâng cấp lên Premium bằng cách gõ '.Premium' để tiếp tục sử dụng hoặc đợi tới ngày mai.", threadID, messageID);
    }

    userUsage.count += 1;
    usageData[senderID] = userUsage;
    await saveUsageData(usageData);

    const now = Date.now();
    if (cooldowns[senderID] && now - cooldowns[senderID] < (userUsage.isPremium ? PREMIUM_COOLDOWN_TIME : COOLDOWN_TIME)) {
      const timeLeft = Math.ceil(((userUsage.isPremium ? PREMIUM_COOLDOWN_TIME : COOLDOWN_TIME) - (now - cooldowns[senderID])) / 1000);
      return api.sendMessage(`Bạn phải chờ thêm ${timeLeft} giây trước khi gửi lệnh tiếp theo.`, threadID, messageID);
    }

    cooldowns[senderID] = now;

    try {
      api.sendMessage("Vui lòng chờ một chút, đang xử lý hình ảnh...", threadID, messageID);

      const attachments = messageReply.attachments.filter(att => att.type === 'photo');
      let imageParts = [];

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

      let prompt = "Phân tích hình ảnh này và cung cấp các thông tin cơ bản bằng tiếng Việt.";
      if (args.length > 0 && userUsage.isPremium) {
        prompt = `${args.join(" ")}\n\nHãy phân tích hình ảnh này và cung cấp thông tin chi tiết bằng tiếng Việt.`;
      } else if (userUsage.isPremium) {
        prompt = "Phân tích hình ảnh này và cung cấp thông tin chi tiết, phân tích chuyên sâu và rõ ràng bằng tiếng Việt.";
      }

      let responseText = '';
      for (const apiKey of API_KEYS) {
        try {
          responseText = await generateContentWithAPI(apiKey, prompt, imageParts, userUsage.isPremium);
          break;
        } catch (error) {
          console.error(`API Key ${apiKey} lỗi. Thử API Key khác...`);
        }
      }

      if (!responseText) {
        throw new Error("Tất cả các API đều gặp lỗi.");
      }

      return api.sendMessage(responseText, threadID, messageID);

    } catch (error) {
      console.error("Lỗi khi phân tích hình ảnh:", error);
      return api.sendMessage("Đã xảy ra lỗi khi phân tích hình ảnh. Vui lòng thử lại sau.", threadID, messageID);
    }
  }
};
