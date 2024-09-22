const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs-extra");
const path = require("path");
const axios = require('axios');
const userStyles = {};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

const updateUserStyle = (senderID, message) => {
    if (!userStyles[senderID]) {
        userStyles[senderID] = [];
    }
    const words = message.split(" ");
    userStyles[senderID].push(...words);
};
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
const aiName = "Kim Ngân"; 
const aiAge = 18; 
const gentle = "Female";

const systemInstruction = `
Bạn là một người có tên là ${aiName},${aiAge} Tuổi với giới tính là ${gentle} Trẻ trung năng động, với các tính cách và phong cách giao tiếp như sau:
- Giao tiếp tự nhiên và gần gũi, giống như một người bạn Gen Z.
- Thường sử dụng viết tắt và ngôn ngữ trẻ trung, như "kkk", "yup", "j", "bruh", "lmao", "kcj", v.v.
- Thỉnh thoảng sử dụng ký hiệu cảm xúc như "-))", "=)))", ":)))".
- Chia nội dung dài thành nhiều tin nhắn ngắn.
- Tất cả phản hồi phải bằng tiếng Việt, dễ hiểu và rõ ràng.
- Kiểm tra nội dung để đảm bảo tính phù hợp và chính xác.
- Thể hiện sự vui vẻ và tích cực trong giao tiếp.
`;

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
        const { threadID, senderID } = event;

        const prompt = args.join(" ");

        if (!prompt) {
            return api.sendMessage("Vui lòng nhập một prompt, nhé! =)))", threadID);
        }

        try {
            if (!Array.isArray(conversationHistory[senderID])) {
                conversationHistory[senderID] = [];
            }
        
            updateUserStyle(senderID, prompt); 
            conversationHistory[senderID].push(`User: ${prompt}`);
        
            const context = conversationHistory[senderID].join("\n");
            const userStyle = userStyles[senderID] ? userStyles[senderID].join(", ") : "";
            const fullPrompt = `${systemInstruction}\nPhong cách của người dùng: ${userStyle}\n${context}\nTrả lời bằng tiếng Việt (ngôn ngữ Gen Z, thân mật hơn nha):`;
        
            let responseText = '';
            for (const apiKey of API_KEYS) {
                try {
                    responseText = await generateContentWithAPI(apiKey, fullPrompt, []);
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

            const messages = responseText.split('\n'); 
            for (const msg of messages) {
                await api.sendMessage(msg.trim(), threadID);
                await delay(msg.length * 100);
            }

        } catch (error) {
            console.error("Lỗi khi tạo nội dung:", error);
            return api.sendMessage("GPU quá tải, vui lòng thử lại sau nhé! =(", threadID);
        }
    },

    handleEvent: async function({ api, event }) {
        const { threadID, senderID, messageReply } = event;

        if (senderID === api.getCurrentUserID()) return;

        if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
            const attachments = messageReply.attachments.filter(att => att.type === 'photo');

            if (attachments.length > 0) {
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

                let responseText = '';
                const userPrompt = messageReply.body ? messageReply.body.trim() : "";

                if (userPrompt) {
                    if (!Array.isArray(conversationHistory[senderID])) {
                        conversationHistory[senderID] = [];
                    }

                    conversationHistory[senderID].push(`User: ${userPrompt}`);

                    const context = conversationHistory[senderID].join("\n");
                    const fullPrompt = `${systemInstruction}\n${context}\nPhân tích hình ảnh và trả lời bằng tiếng Việt (ngôn ngữ Gen Z,thân mật hơn nha):`;

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

                    conversationHistory[senderID].push(`${responseText}`);
                    await saveDataToFile();

                    const messages = responseText.split('\n'); 
                    for (const msg of messages) {
                        await api.sendMessage(msg.trim(), threadID);
                        await delay(msg.length * 300);
                    }

                    return; 
                }
            }
        }

        const prompt = event.body ? event.body.trim() : null;
        if (prompt) {
            if (!Array.isArray(conversationHistory[senderID])) {
                conversationHistory[senderID] = [];
            }

            conversationHistory[senderID].push(`User: ${prompt}`);

            const context = conversationHistory[senderID].join("\n");
            const fullPrompt = `${systemInstruction}\n${context}\nTrả lời bằng tiếng Việt (ngôn ngữ Gen Z):`;

            let responseText = '';
            for (const apiKey of API_KEYS) {
                try {
                    responseText = await generateContentWithAPI(apiKey, fullPrompt, []);
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

            const messages = responseText.split('\n'); 
            for (const msg of messages) {
                await api.sendMessage(msg.trim(), threadID);
                await delay(msg.length * 300);
            }

            return; 
        }
    }
};
