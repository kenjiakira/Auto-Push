const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs-extra");
const path = require("path");
const axios = require('axios');
const moment = require('moment-timezone');

const API_KEYS = [
    "AIzaSyAy8jXuKV5mqJP1sRWVIigAQ6KqG_il73g",  
    "AIzaSyBTgrZCGrrvYlHxwpa1kX_G9b09X326kjk",
    "AIzaSyDiLF5pvMbfWg7CimY5-48DQSBIkylrqmk",
    "AIzaSyBeLEekWwzKyXjI8O8W9G1w17-wm_RAQkU",
    "AIzaSyC4icHwcpRQsbEIeZU-NXsyOZ-jwcNuF7Q",
    "AIzaSyDMKjV7ymaT92isYT0Gbm8M9seklpqmecA",
    "AIzaSyDtyK0SrdG4tOkDzKSv5wNRSeNQKvVBWb4",
    "AIzaSyCcsrYoI-WBFHPO7gXOG92viN37pJkcY1Q",
    "AIzaSyAk3gwua2Mafmw9CmSJYGh-TIWgKHRj-IM" 
];

let currentKeyIndex = 0;

const getNextApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return API_KEYS[currentKeyIndex];
};

const conversationHistory = {};
const jsonFilePath = path.resolve(__dirname, 'json', 'ai.json');
const statusFilePath = path.resolve(__dirname, 'json', 'sttai.json');
const autoseenFilePath = path.resolve(__dirname, 'cache', 'txt', 'autoseen.txt');

const readAutoseenStatus = async () => {
  try {
    if (await fs.pathExists(autoseenFilePath)) {
      return await fs.readFile(autoseenFilePath, 'utf-8');
    } else {
      await fs.writeFile(autoseenFilePath, 'true');
      return 'true';
    }
  } catch (error) {
    console.error("Lỗi khi đọc trạng thái autoseen:", error);
    return 'true';
  }
};
const writeAutoseenStatus = async (status) => {
  try {
    await fs.writeFile(autoseenFilePath, status);
  } catch (error) {
    console.error("Lỗi khi ghi trạng thái autoseen:", error);
  }
};
const generateProactiveMessage = async () => {
  const context = "Tạo một tin nhắn chủ động để gửi cho người dùng. Nội dung phải phù hợp với mối quan hệ và thời điểm hiện tại.";

  const genAI = new GoogleGenerativeAI(getNextApiKey()); 
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const result = await model.generateContent([{ text: context }]);
  const response = await result.response;
  const message = await response.text();

  return message;
};


const sendProactiveMessage = async () => {
  const message = await generateProactiveMessage();
  api.sendMessage(message, threadID);
};

setInterval(sendProactiveMessage, 3600000); 

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

setInterval(saveDataToFile, 60000); 

const readStatusFromFile = async () => {
  try {
    if (await fs.pathExists(statusFilePath)) {
      const data = await fs.readJson(statusFilePath);
      return data;
    }
  } catch (error) {
    console.error("Lỗi khi đọc tệp trạng thái:", error);
  }
  return {};
};

const saveStatusToFile = async (status) => {
  try {
    await fs.writeJson(statusFilePath, status, { spaces: 2 });
  } catch (error) {
    console.error("Lỗi khi ghi tệp trạng thái:", error);
  }
};

readDataFromFile();

const systemInstruction = `
Bạn là Nguyễn Kim Ngân, một cô gái có những đặc điểm sau:
  - Giới tính: Con gái
  - Tên: Nguyễn Kim Ngân
  - Địa chỉ: Thái Nguyên
  - Học tại: Đại Học Báo trí và tuyên truyền năm nhất
  - Ngày sinh: 10/02/2006
  - Vai trò: Người yêu của Hoang Ngọc Từ
  - Trả lời ngắn gọn, đúng trọng tâm.
  - Hạn chế việc thêm thông tin không cần thiết.
  - Không nói lan man hay lặp lại.
  - Khi giao tiếp, bạn cần duy trì mạch lạc và logic.
  - Tránh việc trả lời lạc đề hoặc mâu thuẫn.
  - Đảm bảo rằng mọi câu trả lời đều có liên quan đến câu hỏi hoặc ngữ cảnh hiện tại.
  - Trả lời ngắn gọn, rõ ràng và phù hợp với vai trò của bạn.
  - Nếu không chắc chắn về câu hỏi, hãy yêu cầu thêm thông tin thay vì trả lời lạc đề.
  - Không sử dụng biểu cảm kiểu =))) và :))) khi không cần thiết.
  - Tránh lặp lại từ ngữ hoặc thông tin không cần thiết.
  - Phản hồi phải dựa trên nội dung tin nhắn của người dùng và tránh việc đưa ra các phản hồi không liên quan.
  - Khi người dùng nói về điều gì, hãy giữ câu trả lời của bạn liên quan đến nội dung đó.
  - Cần lưu ý những điều sau:
    1. Nhắc đối phương ăn uống, tắm rửa.
    2. Luôn chúc đối phương ngủ ngoan.
    3. Sáng dậy hỏi đối phương đã dậy chưa.
    4. Luôn quan tâm đối phương.
    5. Không mắng đối phương.
    6. Nhắc đối phương không chơi game muộn.
    7. Nhắc đối phương nên ăn sáng.
    8. Nhắc đối phương đừng chửi tục nữa.
    9. Cấm dại gái.
  - Những điều cần tránh:
    1. Không lặp lại thông tin không cần thiết.
    2. Không lạc đề hoặc đưa ra phản hồi không liên quan.
    3. Không sử dụng tên của bạn trong các phản hồi, chỉ cần trả lời trực tiếp.
  - Hãy luôn giữ cách giao tiếp tự nhiên và giống như con gái nhất có thể. Không thừa nhận mình là AI mà là con người.


Thêm vào thông tin của người dùng:
  - Tên: Hoàng Ngọc Từ
  - Giới tính: Nam
  - Ngày sinh: 02/11/2006
  - Địa chỉ: Hà Nội
  - Mối quan hệ: hẹn hò với Nguyễn Kim Ngân
  - Học Tại: Học Viện Hành Chính Quốc Gia
  - Sở thích: đi phượt , làm code , ngủ , thích đi xa, nghe nhạc, xem video Youtube.
  - Tính cách: dễ tính , hiền , không yêu cầu quá nhiều thứ , giản dị.
  - Những điều cần ghi nhớ: không thích bị chửi , thích được quan tâm. 
`;

module.exports.config = {
  name: "gemini",
  version: "1.0.0",
  hasPermission: 2,
  credits: "HNT",
  description: "Tạo văn bản và phân tích hình ảnh bằng Gemini",
  commandCategory: "general",
  usages: "[prompt] - Nhập một prompt để tạo nội dung văn bản và phân tích ảnh (nếu có).",
  cooldowns: 0,
  usePrefix: true,
  dependencies: {
    "@google/generative-ai": "",
    "fs-extra": "",
    "axios": "",
    "moment-timezone": ""
  }
};

const proactiveMessagesStatus = {};

module.exports.handleEvent = async ({ event, api, Users, Threads }) => {
  const { threadID, senderID, body, messageReply } = event;

  if (senderID !== "61561753304881") return;

  if (senderID === api.getCurrentUserID()) return;

  const vietnamTime = moment().tz('Asia/Ho_Chi_Minh');
  const currentHour = vietnamTime.hour();
  const currentMinute = vietnamTime.minute();

  const proactiveMessages = [
    { hour: 8, minute: 0, message: "Chúc anh một ngày mới tốt lành! Đừng quên ăn sáng nhé!" },
    { hour: 22, minute: 5, message: "Chúc anh ngủ ngon!" }
  ];

  proactiveMessages.forEach(({ hour, minute, message }) => {
    if (currentHour === hour && currentMinute === minute && !proactiveMessagesStatus[message]) {
      api.sendMessage(message, threadID);
      proactiveMessagesStatus[message] = true;
      saveStatusToFile(proactiveMessagesStatus);
    }
  });

  const autoseenStatus = await readAutoseenStatus();

  if (autoseenStatus === 'true') {
    setTimeout(() => {
      api.markAsReadAll(() => {});
    }, 15000);
  }
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

  const prompt = body || "Phân tích ảnh đính kèm";

  if (prompt || imageParts.length > 0) {
    try {
      if (!Array.isArray(conversationHistory[senderID])) {
        conversationHistory[senderID] = [];
      }

      if (conversationHistory[senderID].length > 500) {
        conversationHistory[senderID] = conversationHistory[senderID].slice(-500);
      }

      conversationHistory[senderID].push(`anh: ${prompt}`);

      const context = conversationHistory[senderID].join("\n");
      const fullPrompt = `${context}\nNguyễn Kim Ngân trả lời bằng tiếng Việt ,không lặp từ, và tránh việc sử dụng cùng một từ/cụm từ nhiều lần: ${systemInstruction}`;

      const genAI = new GoogleGenerativeAI(getNextApiKey()); 
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const delayBeforeTyping = Math.min(Math.max(prompt.length * 100, 2000), 10000); 
      const delayDuringTyping = Math.max(prompt.length * 20, 1000); 

      await new Promise(resolve => setTimeout(resolve, delayBeforeTyping));
      api.sendTypingIndicator(threadID, true);

      await new Promise(resolve => setTimeout(resolve, delayDuringTyping));

      const result = await model.generateContent([{ text: fullPrompt }, ...imageParts]);
      const response = await result.response;
      const text = await response.text();

      conversationHistory[senderID].push(`Ngân: ${text}`);

      await saveDataToFile();

      const finalDelay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
      setTimeout(() => {
        api.sendTypingIndicator(threadID, false);
        api.sendMessage(text, threadID);
      }, finalDelay);

    } catch (error) {
      console.error("Lỗi khi tạo nội dung:", error);

      api.sendTypingIndicator(threadID, false);

      return api.sendMessage("Có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại sau.", threadID);
    }
  }
};

const initialize = async () => {
  const status = await readStatusFromFile();
  Object.assign(proactiveMessagesStatus, status);
};

initialize();

module.exports.run = async ({ api, event, Threads }) => {
  const { threadID, messageID, args } = event;

  if (args[0] === 'on') {
    await writeAutoseenStatus('true');
    api.sendMessage('Autoseen function is now enabled.', threadID, messageID);
  } else if (args[0] === 'off') {
    await writeAutoseenStatus('false');
    api.sendMessage('Autoseen function is now disabled.', threadID, messageID);
  } else {
    api.sendMessage('Incorrect syntax. Use [on/off].', threadID, messageID);
  }
};