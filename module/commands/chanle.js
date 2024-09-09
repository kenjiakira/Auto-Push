const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

module.exports.config = {
    name: "chanle",
    version: "1.2.0",
    hasPermission: 0,
    credits: "Hoàng Ngọc Từ",
    description: "Chơi chẵn lẻ với hệ thống phức tạp hơn",
    commandCategory: "game",
    usePrefix: true,
    usages: "[chẵn | lẻ] [số xu hoặc allin]",
    cooldowns: 5,
};

const adminGroups = ['6589198804475799'];

const playerCooldowns = {};
const userDataPath = path.join(__dirname, '..', '..', 'module', 'commands', 'json', 'userDatacl.json');

const readUserData = () => {
    try {
        const rawData = fs.readFileSync(userDataPath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Lỗi khi đọc dữ liệu người chơi:", error);
        return {};
    }
};

const writeUserData = (data) => {
    try {
        fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Lỗi khi ghi dữ liệu người chơi:", error);
    }
};

const calculateOdds = (userID) => {
    const userData = readUserData();
    const user = userData[userID] || { wins: 0, losses: 0 };
    let odds = 0.5; 
    const totalGames = user.wins + user.losses;

    if (totalGames > 0) {
        odds = user.wins / totalGames;
        odds = Math.max(0.2, Math.min(0.8, odds));
    }

    return odds;
};

const calculateBayesianOdds = (userID) => {
    const userData = readUserData();
    const user = userData[userID] || { wins: 0, losses: 0 };
    const alpha = 2; 
    const beta = 2;

    const totalGames = user.wins + user.losses + alpha + beta;
    const winProb = (user.wins + alpha) / totalGames;
    const lossProb = (user.losses + beta) / totalGames;

    return winProb;
};

const generateResult = (userID) => {
    const colors = ["⚪", "🔴"];
    const coins = [];
    const odds = (calculateOdds(userID) + calculateBayesianOdds(userID)) / 2;

    for (let i = 0; i < 4; i++) {
        const randomColor = Math.random() < odds ? "🔴" : "⚪";
        coins.push(randomColor);
    }

    return coins;
};

const checkResult = (coins) => {
    const whiteCount = coins.filter(coin => coin === "⚪").length;
    const redCount = coins.filter(coin => coin === "🔴").length;

    let result = "chẵn";
    if (whiteCount % 2 !== 0 || redCount % 2 !== 0) {
        result = "lẻ";
    }

    return { result, whiteCount, redCount };
};

const isWithinAllowedTime = () => {
    const currentTime = moment().tz('Asia/Ho_Chi_Minh');
    const startTime = currentTime.clone().set({ hour: 18, minute: 0, second: 0 });
    const endTime = currentTime.clone().set({ hour: 22, minute: 0, second: 0 });

    return currentTime.isBetween(startTime, endTime);
};

module.exports.run = async ({ api, event, args, Currencies, Users }) => {
    const { threadID, messageID, senderID } = event;

    if (adminGroups.includes(threadID)) {
        return api.sendMessage("Chức năng này không khả dụng trong nhóm admin.", threadID, messageID);
    }

    if (!isWithinAllowedTime()) {
        return api.sendMessage("Bạn chỉ có thể chơi từ 18:00 đến 22:00", threadID, messageID);
    }

    const cooldown = 30 * 1000;
    const currentTime = Date.now();

    if (!playerCooldowns[senderID]) {
        playerCooldowns[senderID] = 0;
    }

    if (currentTime - playerCooldowns[senderID] < cooldown) {
        const remainingTime = Math.ceil((cooldown - (currentTime - playerCooldowns[senderID])) / 1000);
        return api.sendMessage(`Vui lòng đợi ${remainingTime} giây trước khi chơi lại.`, threadID, messageID);
    }

    playerCooldowns[senderID] = currentTime;

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

    const coins = generateResult(senderID);
    const { result, whiteCount, redCount } = checkResult(coins);

    let response = `Kết quả: ${coins.join(" ")}\n`;
    let win = false;
    let winAmount = 0;

    if (betType === result) {
        win = true;
        winAmount = betAmount * 2;
    } else {
        winAmount = 0;
    }

    const userData = readUserData();
    const userRecord = userData[senderID] || { wins: 0, losses: 0 };

    if (win) {
        response += `Chúc mừng! Bạn đã thắng ${formatCurrency(winAmount)} xu! 🎉`;
        await Currencies.increaseMoney(senderID, winAmount);
        userRecord.wins += 1;
    } else {
        response += `Rất tiếc! Bạn đã thua ${formatCurrency(betAmount)} xu. 😢`;
        await Currencies.decreaseMoney(senderID, betAmount);
        userRecord.losses += 1;
    }

    userData[senderID] = userRecord;
    writeUserData(userData);

    const userNewBalance = (await Currencies.getData(senderID)).money;
    response += `\nSố dư hiện tại của bạn là ${formatCurrency(userNewBalance)} xu.`;

    return api.sendMessage(response, threadID, messageID);
};

function formatCurrency(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00$/, '');
}
