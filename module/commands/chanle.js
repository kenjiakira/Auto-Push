const { randomInt } = require('crypto');
const path = require('path');
const { hasID, isBanned } = require(path.join(__dirname, '..', '..', 'module', 'commands', 'cache', 'accessControl.js'));

module.exports.config = {
    name: "chanle",
    version: "1.1.6",
    hasPermission: 0,
    credits: "Hoàng Ngọc Từ",
    description: "Chơi chẵn lẻ",
    commandCategory: "game",
    usePrefix: true,
    usages: "[chẵn | lẻ] [số xu hoặc allin]",
    cooldowns: 5,
};

module.exports.run = async ({ api, event, args, Currencies, Users }) => {
    const { threadID, messageID, senderID } = event;
    const lastGameTime = global.lastGameTime || 0;
    const currentTime = Date.now();

    if (currentTime - lastGameTime < 30000) {
        const remainingTime = Math.ceil((30000 - (currentTime - lastGameTime)) / 1000);
        return api.sendMessage(`Vui lòng đợi ${remainingTime} giây trước khi chơi lại.`, threadID, messageID);
    }
    
    global.lastGameTime = currentTime;

    // Kiểm tra ID CCCD và tình trạng bị cấm (BAN)
    if (!(await hasID(senderID))) {
        return api.sendMessage("⚡ Bạn cần có ID CCCD để thực hiện trò chơi này!\ngõ .id để tạo ID", threadID);
    }

    if (await isBanned(senderID)) {
        return api.sendMessage("⚡ Bạn đã bị cấm và không thể chơi trò chơi này!", threadID);
    }

    const generateResult = () => {
        const colors = ["⚪", "🔴"];
        const coins = [];
        const isSuperRare = Math.random() < 1 / 50;
        if (isSuperRare) {
            const rareColor = colors[Math.floor(Math.random() * colors.length)];
            coins.push(rareColor, rareColor, rareColor, rareColor);
        } else {
            for (let i = 0; i < 4; i++) {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                coins.push(randomColor);
            }
        }
        return coins;
    };

    const checkResult = (coins) => {
        const whiteCount = coins.filter(coin => coin === "⚪").length;
        const redCount = coins.filter(coin => coin === "🔴").length;

        let result = "chẵn";
        if (whiteCount === 1 || redCount === 1 || whiteCount === 3 || redCount === 3) {
            result = "lẻ";
        }

        return { result, whiteCount, redCount };
    };

    if (args.length < 2) {
        return api.sendMessage("Bạn phải đặt cược theo cú pháp: [chẵn | lẻ] [số xu hoặc allin]. Ví dụ: !chanle chẵn allin", threadID, messageID);
    }

    const betType = args[0].toLowerCase();
    const betAmountStr = args[1].toLowerCase();

    if (!["chẵn", "lẻ"].includes(betType)) {
        return api.sendMessage("Bạn phải đặt cược vào 'chẵn' hoặc 'lẻ'. Ví dụ: !chanle chẵn 100", threadID, messageID);
    }

    let betAmount = 0;
    const maxBetAmount = 20000;

    if (betAmountStr === 'allin') {
        const userBalance = (await Currencies.getData(senderID)).money;
        if (userBalance <= 0) {
            return api.sendMessage("Bạn không có tiền để cược toàn bộ.", threadID, messageID);
        }
        betAmount = userBalance;
    } else {
        betAmount = parseInt(betAmountStr);
        if (isNaN(betAmount) || betAmount <= 0) {
            return api.sendMessage("Bạn phải đặt cược một số xu hợp lệ. Ví dụ: !chanle chẵn 100", threadID, messageID);
        }
        if (betAmount > maxBetAmount) {
            return api.sendMessage(`Số tiền cược không được vượt quá ${maxBetAmount} xu.`, threadID, messageID);
        }

        const userBalance = (await Currencies.getData(senderID)).money;
        if (userBalance < betAmount) {
            return api.sendMessage("Bạn không đủ xu để đặt cược.", threadID, messageID);
        }
    }

    const coins = generateResult();
    const { result, whiteCount, redCount } = checkResult(coins);

    let response = `Kết quả: ${coins.join(" ")}\n`;
    let win = false;
    let winAmount = 0;

    if ((whiteCount === 4 || redCount === 4) && betType === "chẵn") {
        winAmount = betAmount * 6;
        win = true;
    } else if ((whiteCount === 4 || redCount === 4) && betType === "lẻ") {
        winAmount = 0; 
    } else if (betType === "chẵn" && result === "chẵn") {
        win = true;
        winAmount = betAmount * 2;
    } else if (betType === "lẻ" && result === "lẻ") {
        win = true;
        winAmount = betAmount * 2;
    }

    const userData = await Users.getData(senderID);
    const userName = userData.name;

    if (win) {
        response += `${userName} đã thắng ${formatCurrency(winAmount)} xu!`;
        await Currencies.increaseMoney(senderID, winAmount);
    } else {
        response += `${userName} đã thua ${formatCurrency(betAmount)} xu.`;
        await Currencies.decreaseMoney(senderID, betAmount);
    }

    const userNewBalance = (await Currencies.getData(senderID)).money;
    response += `\nSố dư hiện tại của bạn là ${formatCurrency(userNewBalance)} xu.`;

    return api.sendMessage(response, threadID, messageID);
};

function formatCurrency(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00$/, '');
}
