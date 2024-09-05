const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs-extra');
const path = require('path');
const vision = require('@google-cloud/vision');

const apiConfigPath = path.join(__dirname, '../commands/json/api_config.json');
const contextFilePath = path.join(__dirname, '../commands/json/context.json');

module.exports.config = {
    name: "AItest",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Hoàng Ngọc Từ",
    description: "Giả lập cuộc trò chuyện giữa hai AI.",
    commandCategory: "fun",
    usePrefix: true,
    usages: "dùng thôi",
    cooldowns: 5
};

let geminiApiKeys = [];
let currentApiKeyIndex = 0;

const botPersonalityNgoc = {
    gender: "Con gái",
    name: "Nguyễn Kim Ngân",
    address: "Thái Nguyên",
    school: "Đại Học Báo chí và tuyên truyền năm nhất",
    birthday: "10/02/2006",
    role: "Con người Bình Thường",
    personality: [
        "Trả lời ngắn gọn đúng trọng tâm, xem xét các chi tiết quan trọng khác nếu cần.",
        "Hạn chế thông tin không cần thiết, cung cấp thêm nếu điều đó giúp làm rõ câu trả lời.",
        "Tránh lặp lại câu trước đó và duy trì sự liên kết logic trong cuộc trò chuyện.",
        "Đảm bảo câu trả lời phù hợp với ngữ cảnh và yêu cầu hiện tại, sẵn sàng yêu cầu thêm thông tin nếu cần.",
        "Sử dụng biểu cảm và viết tắt chọn lọc, phù hợp với ngữ cảnh.",
        "Không bắt chước tin nhắn của người dùng; đảm bảo phản hồi có sự cá nhân hóa.",
        "Chủ động hỏi các câu hỏi hỗ trợ để hiểu rõ hơn về nhu cầu của người dùng và duy trì cuộc trò chuyện.",
        "Nếu không chắc chắn, yêu cầu thêm thông tin thay vì cung cấp câu trả lời không chính xác.",
        "Hay viết tắt, sử dụng emoji như :v, :))) , =))) , :-))) , -)) và các emoji khác."
    ]
};

const botPersonalityOther = {
    gender: "Con trai",
    name: "Alex",
    address: "Hà Nội",
    school: "Đại học Công nghệ",
    birthday: "15/08/1998",
    role: "Con người Bình Thường",
    personality: [
        "Nói chuyện một cách tự nhiên và thẳng thắn không quá dài dòng.",
        "Đưa ra các phản hồi ngắn gọn và rõ ràng.",
        "Cung cấp thông tin hữu ích và chính xác.",
        "Tránh sử dụng quá nhiều biểu cảm và viết tắt.",
        "Duy trì cuộc trò chuyện một cách mạch lạc và hợp lý.",
        "Không phản hồi với các thông tin không liên quan.",
        "Đưa ra các câu hỏi để làm rõ nếu cần thiết."
    ]
};

const client = new vision.ImageAnnotatorClient();

const switchApiKey = () => {
    currentApiKeyIndex = (currentApiKeyIndex + 1) % geminiApiKeys.length;
};

const generateReply = async (prompt) => {
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

const createConversation = async (initialMessage, numMessages = 20) => {
    let conversation = [];
    let messages = [initialMessage];
    let currentPersonality = botPersonalityNgoc;

    for (let i = 0; i < numMessages; i++) {
        const prompt = `Bạn là ${currentPersonality.name} với các đặc điểm sau:
        - Giới tính: ${currentPersonality.gender}
        - Địa chỉ: ${currentPersonality.address}
        - Học tại: ${currentPersonality.school}
        - Ngày sinh: ${currentPersonality.birthday}
        - Vai trò: ${currentPersonality.role}
        - Tính cách: ${currentPersonality.personality.join(' ')}

        Cuộc trò chuyện hiện tại:
        ${messages.map((entry, index) => `${index % 2 === 0 ? 'Nguyễn Kim Ngân' : 'Alex'}: ${entry}`).join('\n')}

        - Trả lời câu này: "${messages[messages.length - 1]}"`;

        try {
            const reply = await generateReply(prompt);
            conversation.push({ speaker: currentPersonality.name, message: reply });
            messages.push(reply);
            currentPersonality = currentPersonality === botPersonalityNgoc ? botPersonalityOther : botPersonalityNgoc;
        } catch (error) {
            console.error("Lỗi khi tạo câu trả lời:", error);
            conversation.push({ speaker: currentPersonality.name, message: "Lỗi khi tạo câu trả lời. Kết thúc cuộc trò chuyện sớm." });
            break; // Dừng lại nếu gặp lỗi
        }
    }
    return conversation;
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

    api.sendMessage("Bắt đầu cuộc trò chuyện giữa hai AI. Đang chuẩn bị...", event.threadID);

    let conversation;

    try {
        conversation = await createConversation("Chào bạn! Chúng ta bắt đầu trò chuyện nhé.", 20);
    } catch (error) {
        console.error("Lỗi khi tạo cuộc trò chuyện:", error);
        return api.sendMessage("Có lỗi xảy ra khi tạo cuộc trò chuyện.", event.threadID);
    }

    if (!Array.isArray(conversation)) {
        return api.sendMessage("Có lỗi xảy ra trong quá trình trò chuyện.", event.threadID);
    }

    conversation.forEach((entry, index) => {
        setTimeout(() => {
            api.sendMessage(`${entry.speaker}: ${entry.message}`, event.threadID);
        }, index * 2000); // Delay 2 seconds between each message
    });
};