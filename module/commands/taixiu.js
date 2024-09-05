module.exports.config = {
    name: "taixiu",
    version: "1.0.0",
    hasPermssion: 0,
    usePrefix: true,
    credits: "Niio-team (Vtuan)",
    description: "no",
    commandCategory: "Game",
    usages: "[]",
    cooldowns: 1,
};

const fs = require("fs");
const path = "./module/commands/json/";

if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

const data = path + 'json/';
if (!fs.existsSync(data)) fs.mkdirSync(data, { recursive: true });

const lichsugiaodich = data + 'lichsugiaodich/';
if (!fs.existsSync(lichsugiaodich)) fs.mkdirSync(lichsugiaodich, { recursive: true });

const betHistoryPath = data + 'betHistory/';
if (!fs.existsSync(betHistoryPath)) fs.mkdirSync(betHistoryPath, { recursive: true });

const moneyFile = path + 'money.json';
const phiênFile = path + 'phiên.json';
const fileCheck = path + 'file_check.json';

if (!fs.existsSync(moneyFile)) fs.writeFileSync(moneyFile, "[]", "utf-8");
if (!fs.existsSync(phiênFile)) fs.writeFileSync(phiênFile, "[]", "utf-8");
if (!fs.existsSync(fileCheck)) fs.writeFileSync(fileCheck, "[]", "utf-8");

class Command {
    constructor(config) {
        this.config = config;
        this.count_req = 0;
    }

    run({ messageID, text, api, threadID }) {
        api.sendMessage(text, threadID, (e, i) => {
            if (e) console.error(e);
        });
    }

    generateOfflineThreadingID() {
        var ret = Date.now();
        var value = Math.floor(Math.random() * 4294967295);
        var str = ("0000000000000000000000" + value.toString(2)).slice(-22);
        var msgs = ret.toString(2) + str;
        return this.binaryToDecimal(msgs);
    }

    binaryToDecimal(data) {
        var ret = "";
        while (data !== "0") {
            var end = 0;
            var fullName = "";
            var i = 0;
            for (; i < data.length; i++) {
                end = 2 * end + parseInt(data[i], 10);
                if (end >= 10) {
                    fullName += "1";
                    end -= 10;
                } else {
                    fullName += "0";
                }
            }
            ret = end.toString() + ret;
            data = fullName.slice(fullName.indexOf("1"));
        }
        return ret;
    }
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function playGame() {
    const dice1 = rollDice();
    const dice2 = rollDice();
    const dice3 = rollDice();
    const total = dice1 + dice2 + dice3;
    const result = (total >= 4 && total <= 10) ? 'xỉu' : 'tài';

    return {
        total,
        result,
        dice1,
        dice2,
        dice3
    };
}

function vtuandzs1tg(api, content, threadID) {
    return new Promise((resolve, reject) => {
        if (!api || !api.sendMessage) {
            console.error('API or api.sendMessage is not defined');
            return reject(new Error('API or api.sendMessage is not defined'));
        }
        api.sendMessage(content, threadID, (e, i) => {
            if (e) return reject(e);
            resolve(i);
        });
    });
}

let i = 0;
module.exports.onLoad = async function ({ api, model }) {
    let results = null;
    let startNewRound = false;

    setInterval(async () => {
        try {
            i += 1;
            const phiênData = JSON.parse(fs.readFileSync(phiênFile, "utf-8"));
            const checkData = JSON.parse(fs.readFileSync(fileCheck, "utf-8"));
            let phiên = phiênData.length ? phiênData[phiênData.length - 1].phien : 1;

            if (i === 1) {
                for (let threadID of checkData) {
                    if (!api || !api.sendMessage) {
                        console.error('API or api.sendMessage is not defined');
                        return;
                    }
                    api.sendMessage(`⏳ Chờ lượt mới...\nPhiên ${phiên} sẽ bắt đầu sau 5 giây.`, threadID);
                }
                // Set flag to start a new round after 5 seconds
                startNewRound = true;
            } else if (i === 6 && startNewRound) {
                // Start a new round
                startNewRound = false;
                results = playGame();
                console.log(results);
                for (let threadID of checkData) {
                    if (!api || !api.sendMessage) {
                        console.error('API or api.sendMessage is not defined');
                        return;
                    }
                    api.sendMessage(`🔄 Bắt đầu phiên ${phiên}!\n⏳ Bạn có 50 giây để đặt cược.`, threadID);
                }
            } else if (i === 25) {
                for (let threadID of checkData) {
                    if (!api || !api.sendMessage) {
                        console.error('API or api.sendMessage is not defined');
                        return;
                    }
                    api.sendMessage(`⚠️ Còn 30 giây để đặt cược!`, threadID);
                }
            } else if (i === 45) {
                for (let threadID of checkData) {
                    if (!api || !api.sendMessage) {
                        console.error('API or api.sendMessage is not defined');
                        return;
                    }
                    api.sendMessage(`⚠️ Còn 10 giây để đặt cược!`, threadID);
                }
            } else if (i === 55) {
                const checkmn = JSON.parse(fs.readFileSync(moneyFile, "utf-8"));
                let winList = [];
                let loseList = [];

                for (let user of checkmn) {
                    const userBetFile = betHistoryPath + `${user.senderID}.json`;
                    if (!fs.existsSync(userBetFile)) continue;
                    const userBetData = JSON.parse(fs.readFileSync(userBetFile, "utf-8"));

                    userBetData.forEach(entry => {
                        if (entry.phien === phiên) {
                            if (entry.choice === results.result) {
                                if ((results.dice1 == 6 && results.dice2 == 6 && results.dice3 == 6) || (results.dice1 == 1 && results.dice2 == 1 && results.dice3 == 1)) {
                                    user.input += entry.betAmount * 5;
                                } else {
                                    user.input += entry.betAmount;
                                }
                                winList.push(user.senderID);
                            } else {
                                user.input -= entry.betAmount;
                                loseList.push(user.senderID);
                            }
                        }
                    });
                    fs.writeFileSync(userBetFile, JSON.stringify(userBetData, null, 4), 'utf-8');
                }

                fs.writeFileSync(moneyFile, JSON.stringify(checkmn, null, 4), 'utf-8');

                let last10Phien = phiênData.slice(-10); // Lấy 10 phiên gần nhất
                const messagesMapping = {
                    'tài': '⚫️',
                    'xỉu': '⚪️'
                };
                let msgs = '';
                last10Phien.forEach(phiên => {
                    const { result } = phiên;
                    msgs += messagesMapping[result] || '';
                });

                let dcm = results.result === 'tài' ? '⚫️' : '⚪️';

                for (let threadID of checkData) {
                    let msgd = '';
                    if ((results.dice1 == 6 && results.dice2 == 6 && results.dice3 == 6) || (results.dice1 == 1 && results.dice2 == 1 && results.dice3 == 1)) {
                        msgd = `🎉 Nổ hũ: Tiền cược nhân 5`;
                    }
                
                    let message = `📊 Kết quả phiên ${phiên}: [ ${results.dice1} | ${results.dice2} | ${results.dice3} ]\nKết quả: ${results.result.toUpperCase()} - ${results.dice1 + results.dice2 + results.dice3}\n${msgd}` +
                        `Thắng: ${winList.length} người\n` +
                        `Thua: ${loseList.length} người\n` +
                        `Phiên gần đây:\n${msgs}${dcm}`;
                    
                    api.sendMessage(message, threadID, (e, i) => {
                        if (e) console.error(e);
                    });
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
            if (args[2] === undefined) {
                return api.sendMessage(`⚠️ Bạn phải cung cấp số tiền!`, threadID);
            }

            const input = parseInt(args[2].trim());
            if (isNaN(input)) {
                return api.sendMessage(`⚠️ Số tiền không hợp lệ!`, threadID);
            }

            if (!global.config.ADMINBOT.includes(senderID)) {
                return api.sendMessage(`⚠️ Bạn không có quyền sử dụng lệnh này!`, threadID);
            }

            const threadInfo = await api.getThreadInfo(threadID);
            const memberIDs = threadInfo.participantIDs;
            for (let i = 0; i < memberIDs.length; i++) {
                let newSenderID = memberIDs[i];
                const userHistoricFile = lichsugiaodich + `${newSenderID}.json`;
                let userHistoricData = [];
                if (fs.existsSync(userHistoricFile)) {
                    userHistoricData = JSON.parse(fs.readFileSync(userHistoricFile, "utf-8"));
                }

                let e = checkmn.findIndex(entry => entry.senderID == newSenderID);
                let time = Date.now();
                if (e !== -1) {
                    const historicInput = checkmn[e].input;
                    checkmn[e].input += input;
                    userHistoricData.push({
                        senderID: newSenderID,
                        time: time,
                        input: input,
                        historic_input: historicInput
                    });
                } else {
                    const newEntry = {
                        senderID: newSenderID,
                        input: input
                    };
                    checkmn.push(newEntry);
                    userHistoricData.push({
                        senderID: newSenderID,
                        time: time,
                        input: input,
                        historic_input: 0
                    });
                }

                fs.writeFileSync(moneyFile, JSON.stringify(checkmn, null, 4), 'utf-8');
                fs.writeFileSync(userHistoricFile, JSON.stringify(userHistoricData, null, 4), 'utf-8');
            }

            const message = `✅ Đã nạp thành công ${input} cho tất cả thành viên trong nhóm.`;
            return api.sendMessage(message, threadID);
        }
    } else if (args[0] === 'tài' || args[0] === 'xỉu') {
        if (args[1] === undefined) {
            return api.sendMessage(`⚠️ Bạn phải cung cấp số tiền!`, threadID);
        }

        const betAmount = parseInt(args[1].trim());
        if (isNaN(betAmount) || betAmount <= 0) {
            return api.sendMessage(`⚠️ Số tiền không hợp lệ!`, threadID);
        }

        const betChoice = args[0];
        const userBetFile = betHistoryPath + `${senderID}.json`;
        let userBetData = [];
        if (fs.existsSync(userBetFile)) {
            userBetData = JSON.parse(fs.readFileSync(userBetFile, "utf-8"));
        }

        userBetData.push({
            phien: phiên,
            choice: betChoice,
            betAmount: betAmount
        });
        fs.writeFileSync(userBetFile, JSON.stringify(userBetData, null, 4), 'utf-8');
        api.sendMessage(`✅ Bạn đã đặt cược ${betAmount} vào ${betChoice}`, threadID);
    } else if (args[0] === 'on' || args[0] === 'off') {
        const threadInfo = await api.getThreadInfo(threadID);
        if (!threadInfo.adminIDs.some(item => item.id === senderID)) {
            return api.sendMessage('❎ Bạn không đủ quyền hạn để sử dụng!', threadID);
        }   
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
        const userCheck = checkmn.find(entry => entry.senderID == senderID);
        if (userCheck) {
            api.sendMessage(`💰 Số tiền của bạn: ${userCheck.input}`, threadID);
        } else {
            api.sendMessage(`⚠️ Bạn chưa có số dư!`, threadID);
        }
    } else {
        api.sendMessage(`[ Tài Xỉu ]\n+tx on/off để bật/tắt server trong nhóm!!\n+tx tài/xỉu + số tiền/all\nChú Ý: server liên kết với tất cả các nhóm!!`, threadID);
    }
}
