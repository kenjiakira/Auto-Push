const fs = require("fs");
const path = "./module/commands/json/";
const moneyFile = path + 'money.json';
const phiênFile = path + 'phiên.json';
const fileCheck = path + 'file_check.json';
const betHistoryPath = path + 'betHistory/';

if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
if (!fs.existsSync(betHistoryPath)) fs.mkdirSync(betHistoryPath, { recursive: true });
if (!fs.existsSync(moneyFile)) fs.writeFileSync(moneyFile, JSON.stringify([]), "utf-8");
if (!fs.existsSync(phiênFile)) fs.writeFileSync(phiênFile, JSON.stringify([]), "utf-8");
if (!fs.existsSync(fileCheck)) fs.writeFileSync(fileCheck, JSON.stringify([]), "utf-8");

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function playGame() {
    const dice1 = rollDice();
    const dice2 = rollDice();
    const dice3 = rollDice();
    const total = dice1 + dice2 + dice3;
    const result = (total >= 4 && total <= 10) ? 'xỉu' : 'tài';
    return { total, result, dice1, dice2, dice3 };
}

function sendMessage(api, content, threadID) {
    return new Promise((resolve, reject) => {
        api.sendMessage(content, threadID, (e, i) => {
            if (e) return reject(e);
            resolve(i);
        });
    });
}

module.exports.config = {
    name: "tx2",
    version: "1.0.0",
    hasPermission: 0,
    usePrefix: true,
    credits: "Niio-team Mod Aki Team",
    description: "Trò chơi Tài Xỉu đơn giản",
    commandCategory: "Game",
    usages: "[]",
    cooldowns: 1,
};
module.exports.onLoad = async function ({ api }) {
    let i = 0;
    setInterval(async () => {
        try {
            i++;
            let phiênData = JSON.parse(fs.readFileSync(phiênFile, "utf-8"));
            const checkData = JSON.parse(fs.readFileSync(fileCheck, "utf-8"));
            let phiên = Array.isArray(phiênData) && phiênData.length ? phiênData[phiênData.length - 1].phien : 1;

            if (!Array.isArray(phiênData)) {
                phiênData = [];
            }

            if (i === 1) {
                for (const threadID of checkData) {
                    await sendMessage(api, `⏳ Chờ lượt mới...\nPhiên ${phiên} sẽ bắt đầu sau 5 giây.`, threadID);
                }
            } else if (i === 6) {
                const results = playGame();
                for (const threadID of checkData) {
                    await sendMessage(api, `🔄 Bắt đầu phiên ${phiên}!\n⏳ Bạn có 50 giây để đặt cược.`, threadID);
                }
            } else if (i === 25) {
                for (const threadID of checkData) {
                    await sendMessage(api, `⚠️ Còn 30 giây để đặt cược!`, threadID);
                }
            } else if (i === 45) {
                for (const threadID of checkData) {
                    await sendMessage(api, `⚠️ Còn 10 giây để đặt cược!`, threadID);
                }
            } else if (i === 55) {
                const checkmn = JSON.parse(fs.readFileSync(moneyFile, "utf-8"));
                const winList = [];
                const loseList = [];
                const results = playGame();

                for (const user of checkmn) {
                    const userBetFile = betHistoryPath + `${user.senderID}.json`;
                    if (fs.existsSync(userBetFile)) {
                        const userBetData = JSON.parse(fs.readFileSync(userBetFile, "utf-8"));
                        userBetData.forEach(entry => {
                            if (entry.phien === phiên) {
                                if (entry.choice === results.result) {
                                    user.input += (results.dice1 == 6 && results.dice2 == 6 && results.dice3 == 6) ? entry.betAmount * 5 : entry.betAmount;
                                    winList.push(user.senderID);
                                } else {
                                    user.input -= entry.betAmount;
                                    loseList.push(user.senderID);
                                }
                            }
                        });
                        fs.writeFileSync(userBetFile, JSON.stringify(userBetData, null, 4), 'utf-8');
                    }
                }
                fs.writeFileSync(moneyFile, JSON.stringify(checkmn, null, 4), 'utf-8');

                const last10Phien = Array.isArray(phiênData) ? phiênData.slice(-10) : [];
                const messagesMapping = { 'tài': '⚫️', 'xỉu': '⚪️' };
                let msgs = '';
                last10Phien.forEach(p => msgs += messagesMapping[p.result] || '');

                let dcm = results.result === 'tài' ? '⚫️' : '⚪️';
                for (const threadID of checkData) {
                    let msgd = '';
                    if (results.dice1 == 6 && results.dice2 == 6 && results.dice3 == 6 || results.dice1 == 1 && results.dice2 == 1 && results.dice3 == 1) {
                        msgd = `🎉 Nổ hũ: Tiền cược nhân 5`;
                    }
                    const message = `📊 Kết quả phiên ${phiên}: [ ${results.dice1} | ${results.dice2} | ${results.dice3} ]\nKết quả: ${results.result.toUpperCase()} - ${results.total}\n${msgd}` +
                        `Thắng: ${winList.length} người\n` +
                        `Thua: ${loseList.length} người\n` +
                        `Phiên gần đây:\n${msgs}${dcm}`;
                    await sendMessage(api, message, threadID);
                }
                phiênData.push({ phien: phiên + 1, result: results.result });
                fs.writeFileSync(phiênFile, JSON.stringify(phiênData, null, 4), 'utf-8');
                i = 0;
            }
        } catch (error) {
            console.error("Lỗi khi xử lý:", error);
        }
    }, 1000);
};

module.exports.run = async function ({ api, event, args }) {
    const { senderID, threadID } = event;
    const checkmn = JSON.parse(fs.readFileSync(moneyFile, "utf-8"));
    const phiênData = JSON.parse(fs.readFileSync(phiênFile, "utf-8"));
    const checkData = JSON.parse(fs.readFileSync(fileCheck, "utf-8"));
    let phiên = phiênData.length ? phiênData[phiênData.length - 1].phien : 1;

    if (args[0] === 'set') {
        if (args[1] === 'all') {
            if (!global.config.ADMINBOT.includes(senderID)) return api.sendMessage(`⚠️ Bạn không có quyền sử dụng lệnh này!`, threadID);
            const amount = parseInt(args[2].trim());
            if (isNaN(amount)) return api.sendMessage(`⚠️ Số tiền không hợp lệ!`, threadID);
            const threadInfo = await api.getThreadInfo(threadID);
            const memberIDs = threadInfo.participantIDs;
            for (const memberID of memberIDs) {
                let userData = checkmn.find(entry => entry.senderID === memberID);
                if (userData) {
                    userData.input += amount;
                } else {
                    checkmn.push({ senderID: memberID, input: amount });
                }
                fs.writeFileSync(moneyFile, JSON.stringify(checkmn, null, 4), 'utf-8');
            }
            api.sendMessage(`✅ Đã nạp thành công ${amount} cho tất cả thành viên trong nhóm.`, threadID);
        }
    } else if (args[0] === 'tài' || args[0] === 'xỉu') {
        if (args[0] === 'allin') {
            const user = checkmn.find(entry => entry.senderID === senderID);
            if (!user) return api.sendMessage(`⚠️ Bạn chưa có số dư!`, threadID);
            const betAmount = user.input;
            if (betAmount <= 0) return api.sendMessage(`⚠️ Số dư không đủ để cược!`, threadID);
            const betChoice = args[0];
            const userBetFile = betHistoryPath + `${senderID}.json`;
            let userBetData = [];
            if (fs.existsSync(userBetFile)) {
                userBetData = JSON.parse(fs.readFileSync(userBetFile, "utf-8"));
            }
            userBetData.push({ phien: phiên, choice: betChoice, betAmount: betAmount });
            fs.writeFileSync(userBetFile, JSON.stringify(userBetData, null, 4), 'utf-8');
            user.input = 0;  // Set balance to 0 after allin
            fs.writeFileSync(moneyFile, JSON.stringify(checkmn, null, 4), 'utf-8');
            api.sendMessage(`✅ Bạn đã cược toàn bộ ${betAmount} vào ${betChoice}`, threadID);
        } else if (!args[1]) {
            return api.sendMessage(`⚠️ Bạn phải cung cấp số tiền!`, threadID);
        } else {
            const betAmount = parseInt(args[1].trim());
            if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(`⚠️ Số tiền không hợp lệ!`, threadID);
            const betChoice = args[0];
            const userBetFile = betHistoryPath + `${senderID}.json`;
            let userBetData = [];
            if (fs.existsSync(userBetFile)) {
                userBetData = JSON.parse(fs.readFileSync(userBetFile, "utf-8"));
            }
            userBetData.push({ phien: phiên, choice: betChoice, betAmount: betAmount });
            fs.writeFileSync(userBetFile, JSON.stringify(userBetData, null, 4), 'utf-8');
            api.sendMessage(`✅ Bạn đã đặt cược ${betAmount} vào ${betChoice}`, threadID);
        }
    } else if (args[0] === 'on' || args[0] === 'off') {
        const threadInfo = await api.getThreadInfo(threadID);
        if (!threadInfo.adminIDs.some(admin => admin.id === senderID)) return api.sendMessage('❎ Bạn không đủ quyền hạn để sử dụng!', threadID);
        const checkData = JSON.parse(fs.readFileSync(fileCheck, "utf-8"));
        if (args[0] === 'on') {
            if (!checkData.includes(threadID)) {
                checkData.push(threadID);
                fs.writeFileSync(fileCheck, JSON.stringify(checkData, null, 4), 'utf-8');
                return api.sendMessage(`✅ Đã bật trò chơi cho nhóm này!`, threadID);
            } else {
                return api.sendMessage(`⚠️ Trò chơi đã được bật cho nhóm này rồi!`, threadID);
            }
        } else if (args[0] === 'off') {
            const index = checkData.indexOf(threadID);
            if (index > -1) {
                checkData.splice(index, 1);
                fs.writeFileSync(fileCheck, JSON.stringify(checkData, null, 4), 'utf-8');
                return api.sendMessage(`Đã tắt trò chơi cho nhóm này!`, threadID);
            } else {
                return api.sendMessage(`⚠️ Trò chơi chưa được bật cho nhóm này!`, threadID);
            }
        }
    } else if (args[0] === 'check') {
        const userCheck = checkmn.find(entry => entry.senderID === senderID);
        if (userCheck) {
            api.sendMessage(`💰 Số tiền của bạn: ${userCheck.input}`, threadID);
        } else {
            api.sendMessage(`⚠️ Bạn chưa có số dư!`, threadID);
        }
    } else {
        api.sendMessage(`[ Tài Xỉu ]\n+tx on/off để bật/tắt server trong nhóm!!\n+tx tài/xỉu + số tiền/allin\nChú Ý: server liên kết với tất cả các nhóm!!`, threadID);
    }
}
