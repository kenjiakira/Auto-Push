const fs = require('fs');
const path = require('path');
const request = require('request'); // Thay thế với request-promise nếu có
const { hasID, isBanned } = require(path.join(__dirname, '..', '..', 'module', 'commands', 'cache', 'accessControl.js'));

module.exports.config = {
    name: "mine",
    version: "1.0.6",
    hasPermission: 0,
    credits: "Akira",
    description: "Khai thác tài nguyên [Beta]",
    commandCategory: "game",
    usePrefix: true,
    update: true,
    cooldowns: 5,
    envConfig: {
        cooldownTime: 600000 // Thời gian cooldown 10 phút
    },
    dependencies: {
        "fs": "",
        "request": ""
    }
};

module.exports.handleReply = async ({ event: e, api, handleReply, Currencies }) => {
    const { threadID, senderID } = e;
    let data = (await Currencies.getData(senderID)).data || {};

    if (handleReply.author != e.senderID) {
        return api.sendMessage("⚡ Đừng bấm nhanh quá nhé, chờ cooldown đã!", threadID, e.messageID);
    }

    let rewardMessage = "";
    let rewardAmount = 0;

    switch (handleReply.type) {
        case "choosee": {
            switch (e.body) {
                case "1":
                    const minerals = ["đồng", "bạc", "vàng", "thiếc", "bạch kim", "kim cương"];
                    const weights = [1000, 2000, 50, 500, 50, 10]; // Trọng số cho các khoáng sản mới
                    const index = weightedRandom(weights);
                    const mineral = minerals[index];

                    // Số tiền khai thác cho từng khoáng sản
                    switch (index) {
                        case 0: // Khai thác đồng
                            rewardAmount = Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000;
                            break;
                        case 1: // Khai thác bạc
                            rewardAmount = Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000;
                            break;
                        case 2: // Khai thác vàng
                            rewardAmount = Math.floor(Math.random() * (25000 - 20000 + 1)) + 20000;
                            break;
                        case 3: // Khai thác thiếc
                            rewardAmount = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
                            break;
                        case 4: // Khai thác bạch kim
                            rewardAmount = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
                            break;
                        case 5: // Khai thác kim cương
                            rewardAmount = Math.floor(Math.random() * (80000 - 70000 + 1)) + 70000;
                            break;
                    }

                    rewardMessage = `Bạn vừa khai thác được ${mineral} và bán được ${rewardAmount} xu.`;
                    if (rewardAmount > 0) await Currencies.increaseMoney(senderID, rewardAmount);
                    break;

                case "2":
                    const tasks = ["Khai thác KS ở Quảng Ninh", "Khai thác vật liệu ở nam Cực", "Khai thác quặng ở Lào"];
                    const randomIndex = Math.floor(Math.random() * tasks.length);
                    const task = tasks[randomIndex];
                    const reward = Math.floor(Math.random() * 3000) + 3000;
                    rewardMessage = `Bạn vừa hoàn thành công việc "${task}" và nhận được ${reward} xu.`;
                    await Currencies.increaseMoney(senderID, reward);
                    break;

                default:
                    rewardMessage = "⚡ Lựa chọn không hợp lệ!";
                    break;
            }

            const choice = parseInt(e.body);
            if (isNaN(choice) || choice < 1 || choice > 2) {
                return api.sendMessage("⚡ Vui lòng nhập theo thứ tự 1 hoặc 2!", threadID, e.messageID);
            }

            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(`${rewardMessage}`, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { data });
            });
        }
    }
};

function weightedRandom(weights) {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const randomNumber = Math.random() * totalWeight;
    let weightSum = 0;

    for (let i = 0; i < weights.length; i++) {
        weightSum += weights[i];
        if (randomNumber < weightSum) {
            return i;
        }
    }
    return weights.length - 1; // Trả về chỉ số cuối cùng nếu không tìm thấy
}

module.exports.run = async ({ event: e, api, handleReply, Currencies }) => {
    const { threadID, senderID } = e;
    const cooldown = module.exports.config.envConfig.cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};

    // Kiểm tra xem người dùng có ID CCCD không
    if (!(await hasID(senderID))) {
        return api.sendMessage("⚡ Bạn cần có ID CCCD để thực hiện hành động này!\ngõ .id để tạo ID", threadID, e.messageID);
    }

    // Kiểm tra tình trạng bị cấm
    if (await isBanned(senderID)) {
        return api.sendMessage("⚡ Bạn đã bị cấm và không thể khai thác tài nguyên!", threadID, e.messageID);
    }

    if (data.work2Time && cooldown - (Date.now() - data.work2Time) > 0) {
        const timeRemaining = cooldown - (Date.now() - data.work2Time);
        const minutes = Math.floor((timeRemaining / 60000) % 60);
        const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);
        return api.sendMessage(`⚡ Bạn đã khai thác gần đây. Chờ ${minutes} phút ${seconds} giây trước khi khai thác tiếp.`, threadID, e.messageID);
    }

    const msg = {
        body: "===💎 KHAI THÁC 💎===" +
            "\n1 ≻ KHAI THÁC KHOÁNG SẢN TẠI MỎ ĐÁ 🚛" +
            "\n2 ≻ KHAI THÁC NHIỆM VỤ KHÁC" +
            "\n\n📌Reply để chọn hoạt động khai thác!"
    };

    return api.sendMessage(msg, threadID, (error, info) => {
        if (error) return console.error(error);
        data.work2Time = Date.now();
        global.client.handleReply.push({
            type: "choosee",
            name: this.config.name,
            author: senderID,
            messageID: info.messageID
        });
    });
};
