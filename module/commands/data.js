    const fs = require('fs');
    module.exports.config = {
        name: "data",
        version: "0.0.2",
        hasPermission: 2,
        credits: "Hoàng Ngọc Từ",
        description: "Lệnh admin để thay đổi số dư người dùng",
        commandCategory: "Lệnh Admin",
        usePrefix: true,
        usages: "[UID] [số tiền]",
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
    module.exports.run = async function ({ api, event, args, Currencies }) {
        const adminUIDs = ["100029043375434", "61561753304881", "61563982612558"];
    
        // Kiểm tra quyền admin
        if (!adminUIDs.includes(event.senderID)) {
            return api.sendMessage("Bạn không có quyền sử dụng lệnh này.", event.threadID, event.messageID);
        }
    
        // Kiểm tra cú pháp lệnh
        if (args.length < 2) {
            return api.sendMessage("❌ Vui lòng sử dụng cú pháp: .data [UID] [số tiền]. Ví dụ: .data 100029043375434 5000", event.threadID, event.messageID);
        }
    
        const targetUID = args[0];
        const moneySet = parseInt(args[1]);
    
        // Kiểm tra số tiền hợp lệ
        if (isNaN(moneySet) || moneySet < 0) {
            return api.sendMessage("❌ Vui lòng nhập một số tiền hợp lệ!", event.threadID, event.messageID);
        }
    
        // Cập nhật số dư của người dùng
        try {
            await Currencies.setData(targetUID, { money: moneySet });
            return api.sendMessage({
                body: `✅ Đã thay đổi số dư của người dùng với ID ${targetUID} thành ${moneySet} xu.`,
                mentions: [
                    { tag: `Người dùng với ID ${targetUID}`, id: targetUID }
                ]
            }, event.threadID, event.messageID);
        } catch (error) {
            console.error("Lỗi khi thay đổi số dư:", error);
            return api.sendMessage("❌ Đã xảy ra lỗi khi thay đổi số dư. Vui lòng thử lại sau.", event.threadID, event.messageID);
        }
    };
    