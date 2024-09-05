const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const fs = require('fs-extra');
const path = require('path');
const vision = require('@google-cloud/vision');
const axios = require('axios');
const moment = require('moment-timezone');

module.exports.config = {
    name: "bot",
    version: "2.0.0",
    hasPermission: 0,
    credits: "AKI Team",
    description: "AI trò chuyện.",
    commandCategory: "advanced",
    usePrefix: true,
    usages: "dùng để giao tiếp tự nhiên và cảm xúc",
    cooldowns: 5
};

const apiConfigPath = path.join(__dirname, '../commands/json/api_config.json');
const contextFilePath = path.join(__dirname, '../commands/json/context.json');

const client = new vision.ImageAnnotatorClient();
const geminiApiKeys = [];
let currentApiKeyIndex = 0;

const botPersonality = {
    gender: "Con gái",
    name: "Nguyễn Kim Ngân",
    address: "Thái Nguyên",
    school: "Đại Học Báo chí và tuyên truyền năm nhất",
    birthday: "10/02/2006",
    role: "Con người Bình Thường",
    personality: [
        "Trả lời đúng trọng tâm không dài dòng, xem xét các chi tiết quan trọng khác nếu cần.",
        "Hạn chế thông tin không cần thiết, cung cấp thêm nếu điều đó giúp làm rõ câu trả lời.",
        "Tránh lặp lại câu trước đó và duy trì sự liên kết logic trong cuộc trò chuyện.",
        "Đảm bảo câu trả lời phù hợp với ngữ cảnh và yêu cầu hiện tại, sẵn sàng yêu cầu thêm thông tin nếu cần.",
        "Sử dụng biểu cảm và viết tắt chọn lọc, phù hợp với ngữ cảnh.",
        "Không bắt chước tin nhắn của người dùng; đảm bảo phản hồi có sự cá nhân hóa.",
        "Chủ động hỏi các câu hỏi hỗ trợ để hiểu rõ hơn về nhu cầu của người dùng và duy trì cuộc trò chuyện.",
        "Nếu không chắc chắn, yêu cầu thêm thông tin thay vì cung cấp câu trả lời không chính xác.",
        "Hay viết tắt nhiều, sử dụng emoji như :v, :))) , =))) , :-))) , -)) và các emoji khác."
    ]
};

const ADMIN_IDS = ['61563982612558', '61561753304881'];

const getVietnamTime = () => {
    return moment.tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'); 
};
const getVietnamDateTime = () => {
    return moment.tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
};
const switchApiKey = () => {
    currentApiKeyIndex = (currentApiKeyIndex + 1) % geminiApiKeys.length;
};

const analyzeImage = async (imageUrl) => {
    try {
        const [result] = await client.labelDetection(imageUrl);
        const labels = result.labelAnnotations;
        return labels.map(label => label.description).join(', ');
    } catch (error) {
        console.error("Lỗi khi phân tích ảnh:", error);
        return "Không thể phân tích ảnh hiện tại.";
    }
};

const handleImageUpload = async (attachment, context) => {
    const imageUrl = attachment.url;
    const analysisResult = await analyzeImage(imageUrl);
    
    context.images = context.images || [];
    context.images.push({ url: imageUrl, analysis: analysisResult });

    await saveContext(context.threadID, context);

    return `Ảnh của bạn đã được lưu và phân tích. Kết quả: ${analysisResult}`;
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
                        [HarmCategory.HARM_CATEGORY_HATE_SPEECH]: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                        [HarmCategory.HARM_CATEGORY_HARASSMENT]: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                        [HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT]: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                        [HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT]: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                    }
                }
            );
            return result.response.text();
        } catch (error) {
            console.error(`Lỗi khi sử dụng API key ${geminiApiKeys[currentApiKeyIndex]}:`, error);
            switchApiKey();
            if (currentApiKeyIndex === 0) {
                throw new Error("Tất cả các API key đều gặp lỗi.");
            }
        }
    }
};

const saveContext = async (threadID, context) => {
    try {
        const data = await fs.readFile(contextFilePath, 'utf8');
        const allContexts = JSON.parse(data);
        allContexts[threadID] = context;
        await fs.writeFile(contextFilePath, JSON.stringify(allContexts, null, 2));
    } catch (error) {
        console.error("Lỗi khi lưu ngữ cảnh:", error);
    }
};

const handleUserRequest = async (body, context) => {
    if (body.toLowerCase().includes("giúp tôi")) {
        return "Bạn cần giúp đỡ về vấn đề gì? Hãy cho mình biết thêm thông tin.";
    }
    
    if (body.toLowerCase().includes("cảm xúc")) {
        return "Cảm xúc của bạn hiện tại như thế nào? Hãy chia sẻ với mình nhé.";
    }

    return null;
};

const adjustResponse = (reply, userGender, userSentiment) => {
    if (userGender === "male") {
        reply = reply.replace(/cô gái/g, "chàng trai");
    } else if (userGender === "female") {
        reply = reply.replace(/chàng trai/g, "cô gái");
    }
    if (userSentiment === "positive") {
        reply = reply + " 😊";
    } else if (userSentiment === "negative") {
        reply = reply + " 😔";
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

const adjustPersonality = (feedback, personality) => {

    return personality;
};

const analyzeSentiment = (text) => {
    if (text.includes("tốt") || text.includes("vui")) {
        return "positive";
    } else if (text.includes("xấu") || text.includes("buồn")) {
        return "negative";
    }
    return "neutral";
};

const loadContext = async (threadID) => {
    try {
        const data = await fs.readFile(contextFilePath, 'utf8');
        const allContexts = JSON.parse(data);
        return allContexts[threadID] || {
            messages: [],
            userGender: "unknown",
            userSentiment: "neutral",
            messageCount: 0,
            lastMessageDate: getVietnamTime(),
            preferences: {},
            userState: {},
            previousTopics: []
        };
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
            previousTopics: []
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

    api.sendMessage("Cuộc trò chuyện đã bắt đầu. Hãy nói gì đó để mình có thể phản hồi!", event.threadID, async (err, info) => {
        if (err) return console.error(err);

        global.client.handleReply.push({
            type: "chat",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        });
    });
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { threadID, senderID, body, attachment } = event;

    if (senderID !== handleReply.author) return;

    let context = await loadContext(threadID);

    updateUserGender(body, context);
    context.userSentiment = analyzeSentiment(body);

    const today = getVietnamTime().split(' ')[0];
    if (context.lastMessageDate !== today) {
        context.messageCount = 0;
        context.lastMessageDate = today;
    }

    if (!ADMIN_IDS.includes(senderID)) {
        if (context.messageCount >= 20) {
            return api.sendMessage("Bạn đã vượt quá giới hạn 20 tin nhắn trong ngày. Vui lòng quay lại vào ngày mai.", threadID);
        }
        context.messageCount++;
    }

    context.messages.push({ user: body.trim() });

    if (attachment && attachment.type === 'photo') {
        const response = await handleImageUpload(attachment, context);
        return api.sendMessage(response, threadID);
    }

    const additionalResponse = await handleUserRequest(body, context);
    if (additionalResponse) {
        return api.sendMessage(additionalResponse, threadID);
    }

    const userFeedback = body;
    botPersonality.personality = adjustPersonality(userFeedback, botPersonality.personality);

    if (!Array.isArray(context.previousTopics)) {
        context.previousTopics = [];
    }

    const prompt = `Bạn là ${botPersonality.name}, một ${context.userGender === "female" ? "cô gái" : "chàng trai"} với các đặc điểm sau:
    - Giới tính: ${botPersonality.gender}
    - Địa chỉ: ${botPersonality.address}
    - Học tại: ${botPersonality.school}
    - Ngày sinh: ${botPersonality.birthday}
    - Vai trò: ${botPersonality.role}
    - Tính cách: ${botPersonality.personality.join(' ')}
    
    Ngữ cảnh hiện tại:
    ${context.messages.map(entry => `- ${entry.user}`).join('\n')}
    - Thông tin sở thích: ${JSON.stringify(context.preferences)}
    - Trạng thái tâm lý: ${JSON.stringify(context.userState)}
    - Các chủ đề trước đó: ${context.previousTopics.join(', ')}
    - Các ảnh đã gửi: ${Array.isArray(context.images) ? context.images.map(img => `- URL: ${img.url}, Phân tích: ${img.analysis}`).join('\n') : "Chưa có ảnh nào được gửi"}
    
    - Trả lời câu này: "${body.trim()}"
    
    **Hãy cân nhắc các yếu tố cảm xúc và ngữ cảnh để tạo ra phản hồi tự nhiên và chân thành nhất.**`;

    try {
        const reply = await generateReply(prompt);
        const adjustedReply = adjustResponse(reply, context.userGender, context.userSentiment);
        context.messages.push({ bot: adjustedReply });
        await saveContext(threadID, context);

        api.sendMessage(adjustedReply, threadID, (err, info) => {
            if (err) return console.error(err);

            global.client.handleReply.push({
                type: "chat",
                name: this.config.name,
                author: senderID,
                messageID: info.messageID
            });
        });
    } catch (error) {
        console.error("Lỗi khi tạo câu trả lời:", error);
        api.sendMessage("Sorry mình không thể trả lời bạn lúc này, vui lòng thử lại sau.", threadID);
    }
};
