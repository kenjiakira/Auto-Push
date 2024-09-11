const fs = require('fs');
module.exports.config = {
    name: "data",
    version: "0.0.2",
    hasPermission: 2,
    credits: "Hoàng Ngọc Từ",
    description: "lệnh admin",
    commandCategory: "Lệnh Admin",
    usePrefix: true,
    usages: "[UID] [số tiền] hoặc reply tin nhắn hoặc tag người dùng",
    cooldowns: 5,
    info: [
        {
            key: 'UID',
            prompt: 'ID của người dùng để thay đổi số dư',
            type: 'Số',
            example: '100029043375434'
        },
        {
            key: 'số tiền',
            prompt: 'Số tiền muốn thay đổi',
            type: 'Số',
            example: '1000'
        }
    ]
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
    const adminUIDs = ["100029043375434", "61561753304881", "61563982612558"];
    
    if (!adminUIDs.includes(event.senderID)) {
        return api.sendMessage("Bạn không có quyền sử dụng lệnh này.", event.threadID, event.messageID);
    }
    
    const { threadID, messageID, senderID } = event;
    let targetUID, moneySet;

    if (args.length === 2) {
        targetUID = args[0];
        moneySet = parseInt(args[1]);
    } else if (event.messageReply) {
 
        targetUID = event.messageReply.senderID;
        moneySet = parseInt(args[0]);
    } else if (Object.keys(event.mentions).length > 0) {
       
        targetUID = Object.keys(event.mentions)[0];
        moneySet = parseInt(args[1]);
    } else {
        return api.sendMessage("❌ Vui lòng sử dụng cú pháp: .data [UID] [số tiền] hoặc reply tin nhắn hoặc tag người dùng. Ví dụ: .data 100029043375434 5000", threadID, messageID);
    }

    if (isNaN(moneySet) || moneySet < 0) {
        return api.sendMessage("❌ Vui lòng nhập một số tiền hợp lệ!", threadID, messageID);
    }

    try {
        await Currencies.setData(targetUID, { money: moneySet });
        const targetName = (await Users.getData(targetUID)).name;
        return api.sendMessage({
            body: `✅ Đã thay đổi số dư của người dùng ${targetName} (ID: ${targetUID}) thành ${moneySet} xu.`,
            mentions: [
                { tag: targetName, id: targetUID }
            ]
        }, threadID, messageID);
    } catch (error) {
        console.error("Lỗi khi thay đổi số dư:", error);
        return api.sendMessage("❌ Đã xảy ra lỗi khi thay đổi số dư. Vui lòng thử lại sau.", threadID, messageID);
    }
};
