const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const fs = require('fs-extra');
const path = require('path');
const vision = require('@google-cloud/vision');
const moment = require('moment-timezone');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

module.exports.config = {
    name: "ai",
    version: "2.0.0",
    hasPermission: 0,
    credits: "AKI Team",
    description: "AI trò chuyện.",
    commandCategory: "advanced",
    usePrefix: true,
    update: true,
    usages: "dùng để giao tiếp tự nhiên và cảm xúc",
    cooldowns: 5
};

const apiConfigPath = path.join(__dirname, '../commands/json/api_config.json');
const contextFilePath = path.join(__dirname, '../commands/json/context.json');
const stickersFilePath = path.join(__dirname, '../commands/json/stickers.json');
const profileFilePath = path.join(__dirname, '../commands/json/profiles.json');
const personalityFilePath = path.join(__dirname, '../commands/json/personality.json');

const client = new vision.ImageAnnotatorClient();
const geminiApiKeys = [];
let currentApiKeyIndex = 0;
let botPersonality = {}; 

async function init() {
    try {
        const data = await fs.readFile(personalityFilePath, 'utf8');
        botPersonality = JSON.parse(data);
    } catch (error) {
        console.error("Lỗi khi đọc tệp personality.json:", error);
    }

    try {
        const data = await fs.readFile(apiConfigPath, 'utf8');
        const apiConfig = JSON.parse(data);
        geminiApiKeys.push(...apiConfig.gemini_api_keys);
    } catch (error) {
        console.error("Lỗi khi đọc tệp cấu hình:", error);
    }
}

init();

const getVietnamTime = () => moment.tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
const getVietnamDateTime = () => moment.tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
const switchApiKey = () => currentApiKeyIndex = (currentApiKeyIndex + 1) % geminiApiKeys.length;

const updateUserProfile = async (userID, info) => {
    try {
        let profiles = {};
        if (fs.existsSync(profileFilePath)) {
            const data = await fs.readFile(profileFilePath, 'utf8');
            profiles = JSON.parse(data);
        }
        profiles[userID] = { ...profiles[userID], ...info };
        profiles[userID].previousResponses = profiles[userID].previousResponses || [];
        profiles[userID].previousResponses.push(info.response);
        await fs.writeFile(profileFilePath, JSON.stringify(profiles, null, 2));
    } catch (error) {
        console.error("Lỗi cập nhật hồ sơ người dùng:", error);
    }
};

const getStickerData = async () => {
    try {
        const data = await fs.readFile(stickersFilePath, 'utf8');
        const stickerData = JSON.parse(data);
        return stickerData.stickers;
    } catch (error) {
        console.error("Lỗi khi đọc tệp ID sticker:", error);
        return [];
    }
};

const sendRandomSticker = async (api, threadID) => {
    const stickerData = await getStickerData();
    if (stickerData.length === 0) return;

    const stickerID = stickerData[Math.floor(Math.random() * stickerData.length)];
    api.sendMessage({ sticker: stickerID }, threadID);
};
const sendStickerInterval = 5;

const shouldSendSticker = (context) => {
    return context.messageCount > 0 && context.messageCount % sendStickerInterval === 0;
};

const updateUserStyle = (body, context) => {
    context.userStyle = context.userStyle || { phrases: [] };
    context.userStyle.phrases.push(body.trim());

    if (context.userStyle.phrases.length > 20) {
        context.userStyle.phrases.shift();
    }
};

const generateReply = async (prompt) => {
    while (true) {
        try {
            const genAI = new GoogleGenerativeAI(geminiApiKeys[currentApiKeyIndex]);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const result = await model.generateContent(
                [{ text: prompt }],
                {
                    safety_settings: {
                        [HarmCategory.HARM_CATEGORY_HATE_SPEECH]: HarmBlockThreshold.BLOCK_NONE,
                        [HarmCategory.HARM_CATEGORY_HARASSMENT]: HarmBlockThreshold.BLOCK_NONE,
                        [HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT]: HarmBlockThreshold.BLOCK_NONE,
                        [HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT]: HarmBlockThreshold.BLOCK_NONE,
                    }
                }
            );

            const responses = result.response.text().split('\n').map(r => r.replace(/^"|"$/g, ''));
            return responses;
        } catch (error) {
            console.error(`Lỗi khi sử dụng API key ${geminiApiKeys[currentApiKeyIndex]}:`, error);
            switchApiKey();
            if (currentApiKeyIndex === 0) {
                throw new Error("Tất cả các API key đều gặp lỗi.");
            }
        }
    }
};

const saveContext = async (userID, context) => {
    try {
        let allContexts = {};
        if (fs.existsSync(contextFilePath)) {
            const data = await fs.readFile(contextFilePath, 'utf8');
            allContexts = JSON.parse(data);
        }
        allContexts[userID] = {
            messages: context.messages,
            userGender: context.userGender,
            userSentiment: context.userSentiment,
            messageCount: context.messageCount,
            lastMessageDate: context.lastMessageDate,
            preferences: context.preferences,
            userState: context.userState,
            previousTopics: context.previousTopics,
            images: context.images,
            additionalData: context.additionalData
        };
        await fs.writeFile(contextFilePath, JSON.stringify(allContexts, null, 2));
    } catch (error) {
        console.error("Lỗi khi lưu ngữ cảnh:", error);
    }
};

const handleUserRequest = async (body, context, api , threadID) => {
    if (body.toLowerCase().includes("chiều cao")) {
        return `Tôi cao ${botPersonality.physicalAttributes.height}.`;
    }
            
    if (body.toLowerCase().includes("cân nặng")) {
        return `Tôi nặng ${botPersonality.physicalAttributes.weight}.`;
    }
    if (body.toLowerCase().includes("giúp tôi")) {
        return "Bạn cần sự giúp đỡ về điều gì? Hãy cho tôi biết thêm chi tiết.";
    }
            
    if (body.toLowerCase().includes("cảm xúc")) {
        return "Bạn cảm thấy thế nào hôm nay? Chia sẻ với tôi nhé.";
    }
    
    return null;
};

const adjustResponse = (reply, context) => {
    reply = reply.replace(/^"|"$/g, '');

    switch (context.userSentiment) {
        case 'happy':
            reply = `Rất vui vì bạn đang vui vẻ! :)))\n${reply}`;
            break;
        case 'sad':
            reply = `Mình thấy bạn có vẻ không vui. Có chuyện gì không ổn không? :-(\n${reply}`;
            break;
        case 'angry':
            reply = `Bạn có vẻ đang tức giận. Có điều gì khiến bạn khó chịu? :((\n${reply}`;
            break;
        case 'annoyed':
            reply = `Có vẻ như bạn đang bực bội. Thư giãn chút nhé! :-))\n${reply}`;
            break;
        case 'pouting':
            reply = `Hơi dỗi à? Có gì mình có thể làm để làm bạn vui hơn không? :-(\n${reply}`;
            break;
        default:
            break;
    }

    if (Array.isArray(context.previousTopics) && context.previousTopics.length > 0) {
        const recentTopics = context.previousTopics.slice(-3).join(', ');
        reply = `${reply} (Đã thảo luận gần đây: ${recentTopics})`;
    }

    return reply;
};

const updateUserGender = (body, context) => {
    if (body.toLowerCase().includes("tôi là nam")) {
        context.userGender = "male";
    } else if (body.toLowerCase().includes("tôi là nữ")) {
        context.userGender = "female";
    }
};

const adjustPersonality = (personality, context) => {
    const userStylePhrases = context.userStyle?.phrases || [];
    let adjustedPersonality = [...personality];

    if (userStylePhrases.length > 0) {
        const styleSample = userStylePhrases.join(' ');
        adjustedPersonality.push(`Bắt chước cách nói chuyện của người dùng: ${styleSample}`);
    }

    adjustedPersonality.push(`Phong cách giao tiếp của tôi hôm nay: ${context.userStyle?.style || 'thân thiện'}`);
    return adjustedPersonality;
};

const analyzeSentiment = (text) => {
    try {
        const result = sentiment.analyze(text);
        if (result.score > 0.5) {
            return 'happy';
        } else if (result.score < -0.5) {
            return 'angry';
        } else if (result.score < 0) {
            return 'sad';
        }
        return 'neutral';
    } catch (error) {
        console.error("Lỗi phân tích cảm xúc:", error);
        return 'neutral';
    }
};

const loadContext = async (userID) => {
    try {
        if (!fs.existsSync(contextFilePath)) {
            return {
                messages: [],
                userGender: "unknown",
                userSentiment: "neutral",
                messageCount: 0,
                lastMessageDate: getVietnamTime(),
                preferences: {},
                userState: {},
                previousTopics: [],
                images: [],
                additionalData: {}
            };
        }
        const data = await fs.readFile(contextFilePath, 'utf8');
        const allContexts = JSON.parse(data);
        return allContexts[userID] || {
            messages: [],
            userGender: "unknown",
            userSentiment: "neutral",
            messageCount: 0,
            lastMessageDate: getVietnamTime(),
            preferences: {},
            userState: {},
            previousTopics: [],
            images: [],
            additionalData: {}
        };
<<<<<<< HEAD
    } catch (error) {
        console.error("Lỗi khi tải ngữ cảnh:", error);
        return {
            messages: [],
            userGender: "unknown",
            userSentiment: "neutral",
            messageCount: 0,
            lastMessageDate: getVietnamTime(),
            preferences: {},
            userState: {},
            previousTopics: [],
            images: [],
            additionalData: {}
=======
        const adjustResponse = (reply, context) => {
   
            switch (context.userSentiment) {
                case 'happy':
                    reply = `${reply}`;
                    break;
                case 'sad':
                    reply = `${reply}`;
                    break;
                case 'angry':
                    reply = "" + reply;
                    break;  
                case 'annoyed':
                    reply = "" + reply;
                    break;
                case 'pouting':
                    reply = "" + reply;
                    break;
                default:
                    break;
            }
            
            if (Array.isArray(context.previousTopics) && context.previousTopics.length > 0) {
                const recentTopics = context.previousTopics.slice(-3).join(', ');
                reply = `${reply} (Đã thảo luận gần đây: ${recentTopics})`;
            }
            
            return reply;
>>>>>>> 81896d2c1f51cc9f4efd237cd7cc419a4dc20ce6
        };
    }
};

const today = getVietnamDateTime();

module.exports.run = async function({ api, event }) {
    try {
        const data = await fs.readFile(apiConfigPath, 'utf8');
        const apiConfig = JSON.parse(data);
        geminiApiKeys.push(...apiConfig.gemini_api_keys);
    } catch (error) {
        console.error("Lỗi khi đọc tệp cấu hình:", error);
        return api.sendMessage("Có lỗi xảy ra khi đọc tệp cấu hình.", event.threadID);
    }

    api.sendMessage("Chào bạn! Hãy gửi tin nhắn để bắt đầu trò chuyện nhé.", event.threadID, async (err, info) => {
        if (err) return console.error(err);

        global.client.handleReply.push({
            type: "chat",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        });
    });
};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, senderID, body, attachment } = event;

    if (senderID === api.getCurrentUserID()) return;

    let context = await loadContext(senderID);

    updateUserGender(body, context);

    context.userSentiment = await analyzeSentiment(body);

    updateUserStyle(body, context);

    const today = getVietnamTime().split(' ')[0];
    if (context.lastMessageDate !== today) {
        context.messageCount = 0;
        context.lastMessageDate = today;
    }

    context.messages.push({ user: body.trim() });

    if (attachment && (attachment.type === 'photo' || attachment.base64)) {
        return api.sendMessage("Bạn có muốn phân tích ảnh không? Hãy sử dụng lệnh `.picai` để phân tích nhé!", threadID);
    }

    const additionalResponse = await handleUserRequest(body, context, api, threadID);
    if (additionalResponse) {
        return api.sendMessage(additionalResponse, threadID);
    }

    botPersonality.personality = adjustPersonality(body, botPersonality.personality, context);

    if (!Array.isArray(context.previousTopics)) {
        context.previousTopics = [];
    }

    const prompt = `
    Bạn là ${botPersonality.name}, một ${context.userGender === "female" ? "cô gái" : "chàng trai"} với các đặc điểm sau:
    - Giới tính: ${botPersonality.gender}
    - Địa chỉ: ${botPersonality.address}
    - Học tại: ${botPersonality.school}
    - Ngày sinh: ${botPersonality.birthday}
    - Vai trò: ${botPersonality.role}
    - Chiều cao: ${botPersonality.physicalAttributes.height}
    - Cân nặng: ${botPersonality.physicalAttributes.weight}
    - Màu tóc: ${botPersonality.physicalAttributes.hairColor}
    - Màu mắt: ${botPersonality.physicalAttributes.eyeColor}
    - Hình dáng cơ thể: ${botPersonality.physicalAttributes.bodyType}
    - Sở thích: ${botPersonality.hobbies.join(', ')}
    - Thành tích nổi bật: ${botPersonality.achievements.join(', ')}
    - Các mốc sự kiện quan trọng trong cuộc đời tôi: ${botPersonality.milestones.map(m => `${m.year}: ${m.event}`).join(', ')}
    - Mối quan hệ: ${Object.entries(botPersonality.relationships).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join(', ')}
    - Tính cách: ${botPersonality.personality.join(' ')}
    Ngữ cảnh hiện tại:
    ${context.messages.map(entry => `- ${entry.user}`).join('\n')}
    - Thông tin sở thích: ${JSON.stringify(context.preferences)}
    - Trạng thái tâm lý: ${context.userSentiment}
    - Các chủ đề trước đó: ${context.previousTopics.join(', ')}
    - Các ảnh đã gửi: ${Array.isArray(context.images) ? context.images.map(img => `- URL: ${img.url}, Phân tích: ${img.analysis}`).join('\n') : "Chưa có ảnh nào được gửi"}
    - Dữ liệu bổ sung: ${JSON.stringify(context.additionalData)}
    Trả lời câu này: "${body.trim()}"
    **Hãy cân nhắc các yếu tố cảm xúc và ngữ cảnh để tạo ra phản hồi tự nhiên và chân thành nhất.**
    `;
        
    const replies = await generateReply(prompt);

    try {
        for (const reply of replies) {
            const adjustedReply = adjustResponse(reply, context); 
            context.messages.push({ bot: adjustedReply });

            await saveContext(senderID, context);

            await updateUserProfile(senderID, {
                gender: context.userGender,
                sentiment: context.userSentiment,
                messageCount: context.messageCount
            });

            await api.sendMessage(adjustedReply, threadID, async (err, info) => {
                if (err) {
                    console.error(err);
                    return;
                }

                if (shouldSendSticker(context)) {
                    await sendRandomSticker(api, threadID); 
                }

                global.client.handleReply.push({
                    type: "chat",
                    name: this.config.name,
                    author: senderID,
                    messageID: info.messageID
                });
            });
        }
    } catch (error) {
        console.error("Lỗi khi tạo câu trả lời:", error);
        api.sendMessage("Xin lỗi, mình không thể trả lời bạn lúc này, vui lòng thử lại sau.", threadID);
    }
};
