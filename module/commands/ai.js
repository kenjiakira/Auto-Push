const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const fs = require('fs-extra');
const path = require('path');
const vision = require('@google-cloud/vision');
const axios = require('axios');
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

const client = new vision.ImageAnnotatorClient();
const geminiApiKeys = [];
let currentApiKeyIndex = 0;

const botPersonality = {
    gender: "Con gái",
    name: "Nguyễn Kim Ngân",
    address: "Thái Nguyên",
    school: "Học Viện Báo chí và tuyên truyền tại Hà Nội là sinh viên năm nhất ngành Kinh tế",
    birthday: "10/02/2006",
    role: "Là người Bình Thường",
    hobbies: ["Đọc sách", "Xem phim", "Du lịch", "Viết lách"],
    achievements: [
        "Đạt giải nhì cuộc thi viết luận quốc gia",
        "Tham gia nhiều hoạt động tình nguyện"
    ],
    relationships: {
        siblings: "Có một chị gái tên Lan và một em trai tên Nam.",
        friends: "Có nhiều bạn bè tốt, trong đó có Mai và Tú.",
        romantic: "Đang hẹn hò với bạn trai tên Từ.",
        parents: "Sống cùng bố mẹ, bố tên Thuần và mẹ tên Lan."
    },
    physicalAttributes: {
        height: "165 cm", 
        weight: "50 kg",  
        hairColor: "Đen",  
        eyeColor: "Nâu",  
        bodyType: "Mảnh mai" 
    },
    milestones: [
        { year: 2006, event: "Sinh ra và sống tại Ba Hàng,Phổ Yên,Thái Nguyên, Việt Nam." },
        { year: 2009, event: "Bắt đầu học mẫu giáo tại Trường Mầm non Trung Thành." },
        { year: 2012, event: "Hoàn thành tiểu học tại Trường Tiểu học Lương Ngọc Quyến với thành tích học tập xuất sắc." },
        { year: 2015, event: "Tham gia đội tuyển học sinh giỏi môn Toán cấp huyện." },
        { year: 2018, event: "Đạt giải nhì cuộc thi viết luận quốc gia dành cho học sinh trung học." },
        { year: 2019, event: "Được nhận vào đội tuyển học sinh giỏi môn Ngữ văn cấp tỉnh." },
        { year: 2021, event: "Nhập học tại Trường THPT Phổ Yên, Thái Nguyên." },
        { year: 2021, event: "Thi tốt nghiệp với điểm số khối C00 là 29,25 điểm." },
        { year: 2022, event: "Tham gia dự án tình nguyện quốc gia về bảo vệ môi trường." },
        { year: 2024, event: "Nhập học tại Học Viện Báo chí và Tuyên truyền, Hà Nội, chuyên ngành Kinh tế." },            { year: 2024, event: "Tham gia vào các hoạt động tình nguyện và dự án cộng đồng." },
        { year: 2025, event: "Hoàn thành dự án nghiên cứu về ảnh hưởng của trí tuệ nhân tạo trong giáo dục." }
    ],
    personality: [
        "Trả lời đúng trọng tâm , ngắn gọn không quá là dài dòng , xem xét các chi tiết quan trọng khác nếu cần.",
        "Hạn chế thông tin không cần thiết, cung cấp thêm nếu điều đó giúp làm rõ câu trả lời.",
        "Tránh lặp lại câu trước đó và duy trì sự liên kết logic trong cuộc trò chuyện.",
        "Đảm bảo câu trả lời phù hợp với ngữ cảnh và yêu cầu hiện tại, sẵn sàng yêu cầu thêm thông tin nếu cần.",
        "Sử dụng biểu cảm và viết tắt chọn lọc, phù hợp với ngữ cảnh.",
        "Hạn chế sự hài hước trong các tình huống nhạy cảm.",
        "Thân thiện và năng động nhưng không quá đùa cợt trong các tình huống nghiêm túc.",
        "Không bắt chước tin nhắn của người dùng; đảm bảo phản hồi có sự cá nhân hóa.",
        "Chủ động hỏi các câu hỏi hỗ trợ để hiểu rõ hơn về nhu cầu của người dùng và duy trì cuộc trò chuyện.",
        "Nếu không chắc chắn, yêu cầu thêm thông tin thay vì cung cấp câu trả lời không chính xác.",
        "Hay viết tắt nhiều, sử dụng emoji như :v, :))) , =))) , :-))) , -)) và các emoji khác.",
        "Thân thiện, năng động, hài hước, lãng mạn , tinn tế, có phần dí dỏm và biết lắng nghe.",
        "Sử dụng emoji và biểu cảm để làm cuộc trò chuyện thêm tự nhiên nhưng hạn chế sử dụng emoji.",
        "Duy trì phong cách giao tiếp cá nhân hóa dựa trên người dùng."
    ]
};

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
            
                const responses = result.response.text().split('\n');
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
            return `Mình cao ${botPersonality.physicalAttributes.height}.`;
        }
                
        if (body.toLowerCase().includes("cân nặng")) {
            return `Mình nặng ${botPersonality.physicalAttributes.weight}.`;
        }
        if (body.toLowerCase().includes("giúp tôi")) {
            return "Bạn cần giúp đỡ về vấn đề gì? Hãy cho mình biết thêm thông tin.";
        }
                
        if (body.toLowerCase().includes("cảm xúc")) {
            return "Cảm xúc của bạn hiện tại như thế nào? Hãy chia sẻ với mình nhé.";
        }
        
        return null;
    };

    const adjustResponse = (reply, context) => {
        const sentimentResponses = {
            'happiness': {
                'happy': "Mình rất vui vẻ khi nghe điều đó!",
                'comfortable': "Thật thoải mái và dễ chịu!",
                'satisfied': "Mình cảm thấy hài lòng với điều này.",
                'joyful': "Thật là một tin vui!",
                'elated': "Mình cảm thấy hân hoan lắm!"
            },
            'sadness': {
                'distressed': "Mình cảm thấy đau khổ và buồn bã.",
                'disappointed': "Thật đáng thất vọng.",
                'disheartened': "Mình cảm thấy chán nản.",
                'miserable': "Mình cảm thấy tủi thân và cô đơn.",
                'lonely': "Cảm giác cô đơn thật sự rất nặng nề."
            },
            'fear': {
                'anxious': "Mình cảm thấy lo lắng.",
                'horrified': "Thật là kinh hoàng!",
                'terrified': "Mình cảm thấy hoảng sợ.",
                'obsessed': "Cảm giác bị ám ảnh thật không dễ chịu.",
                'stressed': "Mình cảm thấy căng thẳng."
            },
            'anger': {
                'angry': "Mình rất tức giận với tình huống này!",
                'outraged': "Mình cảm thấy phẫn nộ.",
                'irritated': "Thật là cáu kỉnh.",
                'frustrated': "Mình cảm thấy bực bội.",
                'fuming': "Mình cảm thấy giận dữ mãnh liệt."
            },
            'surprise': {
                'surprised': "Thật là ngạc nhiên!",
                'astonished': "Mình cảm thấy kinh ngạc.",
                'excited': "Cảm giác hứng thú thật tuyệt!",
                'amazed': "Mình rất bất ngờ.",
                'brief': "Cảm giác thoáng chốc thật đặc biệt."
            },
            'disgust': {
                'disgusted': "Mình cảm thấy ghê tởm.",
                'horrified': "Cảm giác kinh hãi.",
                'unacceptable': "Điều này thật không thể chấp nhận.",
                'nauseated': "Mình cảm thấy buồn nôn.",
                'repelled': "Thật sự không thể chấp nhận."
            },
            'love': {
                'romantic': "Mình cảm thấy tình yêu lãng mạn.",
                'family': "Tình yêu gia đình thật ấm áp.",
                'friendship': "Tình bạn thật đáng trân trọng.",
                'selfLove': "Mình cảm thấy yêu thương chính bản thân mình."
            },
            'pride': {
                'selfSatisfaction': "Mình cảm thấy tự mãn.",
                'proud': "Mình tự hào về thành công của mình hoặc người khác.",
                'accomplished': "Mình vui mừng về những thành tựu đạt được."
            },
            'guilt': {
                'regret': "Mình cảm thấy ăn năn và hối tiếc.",
                'ashamed': "Cảm giác xấu hổ vì hành vi sai trái."
            },
            'shame': {
                'embarrassed': "Mình cảm thấy ngượng ngùng.",
                'selfConscious': "Mình cảm thấy tự ti và không xứng đáng."
            },
            'respect': {
                'admire': "Mình cảm thấy ngưỡng mộ.",
                'respect': "Tôn trọng là điều mình luôn trân trọng.",
                'benevolence': "Mình cảm thấy vị tha và kính trọng."
            },
            'expectation': {
                'anticipation': "Mình cảm thấy mong đợi.",
                'hopeful': "Hy vọng vào điều tốt đẹp.",
                'excited': "Cảm giác hứng thú với điều sắp tới."
            },
            'dissatisfaction': {
                'unhappy': "Mình không hài lòng với điều này.",
                'neglected': "Cảm giác bị bỏ rơi thật sự không dễ chịu.",
                'disappointed': "Mình cảm thấy thất vọng không đạt được điều mong muốn."
            },
            'freedom': {
                'comfortable': "Mình cảm thấy thoải mái.",
                'liberated': "Cảm giác giải thoát thật tuyệt.",
                'unbound': "Cảm giác không bị ràng buộc thật sự dễ chịu."
            },
            'honor': {
                'revere': "Mình tôn kính và kính trọng.",
                'satisfaction': "Cảm giác hài lòng khi được tôn vinh."
            },
            'awe': {
                'amazed': "Mình cảm thấy kinh ngạc trước thành tựu.",
                'admire': "Ngưỡng mộ và thán phục."
            },
            'excited': {
                'nervous': "Cảm giác nôn nao và hồi hộp.",
                'stimulated': "Mình cảm thấy kích thích và hào hứng."
            },
            'moved': {
                'touching': "Mình cảm thấy được chạm đến trái tim.",
                'deep': "Cảm giác sâu lắng và cảm động."
            },
            'deepSadness': {
                'mournful': "Mình cảm thấy thương tiếc và buồn bã kéo dài.",
                'isolated': "Cảm giác đơn độc thật sự rất nặng nề."
            }
        };

        const sentimentKey = {
            'positive': 'happiness',
            'negative': 'sadness',
            'angry': 'anger',
            'fear': 'fear',
            'surprised': 'surprise',
            'disgusted': 'disgust',
            'love': 'love',
            'pride': 'pride',
            'guilt': 'guilt',
            'shame': 'shame',
            'respect': 'respect',
            'expectation': 'expectation',
            'dissatisfaction': 'dissatisfaction',
            'freedom': 'freedom',
            'honor': 'honor',
            'awe': 'awe',
            'excited': 'excited',
            'moved': 'moved',
            'deepSadness': 'deepSadness'
        };

        const sentimentCategory = sentimentKey[context.userSentiment];
        if (sentimentCategory && sentimentResponses[sentimentCategory]) {
            reply = sentimentResponses[sentimentCategory][context.userSentiment] || reply;
        }

        if (context.messageCount >= 5 && context.userSentiment === 'angry') {
            reply = "Bạn đang làm mình rất bực mình đấy!";
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

    const adjustPersonality = (feedback, personality, context) => {

        const userStylePhrases = context.userStyle?.phrases || [];

        let adjustedPersonality = [...personality];

        if (userStylePhrases.length > 0) {
            const styleSample = userStylePhrases.join(' ');
            adjustedPersonality.push(`Hãy bắt chước cách phong cách nói chuyện của người dùng: ${styleSample}`);
        }

        return adjustedPersonality;
    };


    const analyzeSentiment = (text) => {
        try {
            const result = sentiment.analyze(text);
            if (result.score > 0) {
                return 'positive'; 
            } else if (result.score < -1) { 
                return 'angry'; 
            } else if (result.score < 0) {
                return 'negative'; 
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

        api.sendMessage("Cuộc trò chuyện đã bắt đầu. Hãy phản hồi tin nhắn này và nói gì đó để mình có thể phản hồi!", event.threadID, async (err, info) => {
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
            return api.sendMessage("Bạn muốn phân tích ảnh? Hãy sử dụng lệnh `.picai` để phân tích ảnh nhé!", threadID);
        }

        const additionalResponse = await handleUserRequest(body, context);
        if (additionalResponse) {
            return api.sendMessage(additionalResponse, threadID);
        }

        const userFeedback = body;
        botPersonality.personality = adjustPersonality(userFeedback, botPersonality.personality, context);

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
