const fs = require('fs');
const moment = require('moment-timezone');

module.exports.config = {
    name: "greet", 
    version: "1.0.0",
    hasPermission: 0,
    credit: "HNT",
    description: "lệnh admin",
    commandCategory: "Quản Trị Viên",
    usages: "[text]",
    usePrefix: false,
    cooldowns: 0
};

const botUIDs = ["100056955484415", "100040203282108", "100092325757607"];

module.exports.handleEvent = async ({ event, api, Users }) => {
    let greetKeywords = ["hello", "hi", "hai", "chào", "chao", "hí", "híí", "hì", "hìì", "lô", "hii", "helo", "hê nhô"];
    let byeKeywords = ["bye", "bai", "off", "byee", "pai", "paii"];

    if (event.body && !botUIDs.includes(event.senderID)) {  
        let stickerData = [
            "526214684778630", "526220108111421", "526220308111401", 
            "526220484778050", "526220691444696", "526220814778017", 
            "526220978111334", "526221104777988", "526221318111300", 
            "526221564777942", "526221711444594", "526221971444568", 
            "2041011389459668", "2041011569459650", "2041011726126301", 
            "2041011836126290", "2041011952792945", "2041012109459596", 
            "2041012262792914", "2041012406126233", "2041012539459553", 
            "2041012692792871", "2041014432792697", "2041014739459333", 
            "2041015016125972", "2041015182792622", "2041015329459274", 
            "2041015422792598", "2041015576125916", "2041017422792398", 
            "2041020049458802", "2041020599458747", "2041021119458695", 
            "2041021609458646", "2041022029458604", "2041022286125245"
        ];
        
        let sticker = stickerData[Math.floor(Math.random() * stickerData.length)];
        let currentTime = moment.tz('Asia/Ho_Chi_Minh');
        let hours = currentTime.hours();
        let textOptions = ["ngày tuyệt vời", "buổi tối vui vẻ", "một ngày thật đáng yêu", "một ngày tuyệt diệu", "buổi chiều năng động", "buổi sáng tràn đầy năng lượng"];
        let text = textOptions[Math.floor(Math.random() * textOptions.length)];
        let session = (
            hours >= 5 && hours < 10 ? "buổi sáng" :
            hours >= 10 && hours < 13 ? "buổi trưa" :
            hours >= 13 && hours < 17 ? "buổi chiều" :
            hours >= 17 && hours < 21 ? "buổi tối" : 
            hours >= 21 || hours < 5 ? "buổi đêm" : 
            "không rõ"
        );

        let name = await Users.getNameUser(event.senderID);
        let mentions = [{ tag: name, id: event.senderID }];

        let greetBodies = [
            `🌟 Chào ${name} 🌟\n✨ Chúc bạn một ${session} ${text} ✨\n💖 Chúc bạn một ngày tuyệt vời!\n⏰ Thời gian hiện tại: ${currentTime.format("HH:mm:ss || DD/MM/YYYY")}`,
            `🌈 Hi ${name} 🌈\n🎉 Chúc bạn một ${session} tràn đầy năng lượng ${text}! 🎉\n💫 Hy vọng bạn có một ngày thật tuyệt!\n⏰ Thời gian hiện tại: ${currentTime.format("HH:mm:ss || DD/MM/YYYY")}`,
            `🎈 Xin chào ${name} 🎈\n🌟 Chúc bạn một ${session} đáng yêu ${text} 🌟\n🌷 Chúc bạn có một ngày thật tốt lành!\n⏰ Thời gian hiện tại: ${currentTime.format("HH:mm:ss || DD/MM/YYYY")}`
        ];
        
        let byeBodies = [
            `👋 Tạm biệt ${name} 👋\n💔 Chúc bạn có một ${session} thật vui vẻ 💔\n🌹 Hãy quay lại để trò chuyện với bot nhé!\n⏰ Thời gian hiện tại: ${currentTime.format("HH:mm:ss || DD/MM/YYYY")}`,
            `🚀 Tạm biệt ${name} 🚀\n💫 Hy vọng bạn có một ${session} tuyệt vời 💫\n🌈 Hãy trở lại và trò chuyện với bot khi bạn muốn nhé!\n⏰ Thời gian hiện tại: ${currentTime.format("HH:mm:ss || DD/MM/YYYY")}`
        ];

        if (greetKeywords.includes(event.body.toLowerCase())) {
            let msg = {
                body: greetBodies[Math.floor(Math.random() * greetBodies.length)],
                mentions
            };
            api.sendMessage(msg, event.threadID, (e, info) => {
                setTimeout(() => {
                    api.sendMessage({ sticker: sticker }, event.threadID);
                }, 100);
            }, event.messageID);
        } else if (byeKeywords.includes(event.body.toLowerCase())) {
            let msg = {
                body: byeBodies[Math.floor(Math.random() * byeBodies.length)],
                mentions
            };
            api.sendMessage(msg, event.threadID, (e, info) => {
                setTimeout(() => {
                    api.sendMessage({ sticker: sticker }, event.threadID);
                }, 100);
            }, event.messageID);
        }
    }
};

module.exports.run = async ({ event, api, Threads, getText }) => {
    return api.sendMessage(getText("noActionRequired"), event.threadID, event.messageID);
};

module.exports.languages = {
    "vi": {
        "noActionRequired": "Lệnh đã được cấu hình để luôn luôn hoạt động và không cần bật/tắt.",
    }
};
