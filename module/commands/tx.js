const fs = require('fs');
const path = require('path');

// Path to the JSON file where jackpot data is stored
const jackpotDataPath = path.join(__dirname, 'json', 'jackpot.json');

// Function to read the jackpot data from the JSON file
function readJackpotData() {
  try {
    const rawData = fs.readFileSync(jackpotDataPath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu hũ từ jackpot.json:", error);
    return { jackpot: 0, lastWinner: null };
  }
}

// Function to write the updated jackpot data back to the JSON file
function writeJackpotData(data) {
  try {
    fs.writeFileSync(jackpotDataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Lỗi khi ghi dữ liệu hũ vào jackpot.json:", error);
  }
}

// Initialize jackpot data
let jackpotData = readJackpotData();
let jackpot = jackpotData.jackpot;

// Module configuration for the bot
module.exports.config = {
  name: "tx",
  version: "1.1.7",
  hasPermission: 0,
  credits: "Akira",
  description: "Chơi tài xỉu",
  commandCategory: "Mini Game",
  usePrefix: true,
  usages: "Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]",
  cooldowns: 15
};

// Main function to handle the game logic
module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  const { threadID, messageID, senderID } = event;

  try {
    // Check if the user provided the correct arguments
    if (!args[0]) return api.sendMessage("Bạn chưa nhập đúng cú pháp. Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]", threadID, messageID);

    // Get the user's current money and data
    const dataMoney = await Currencies.getData(senderID);
    const userData = await Users.getData(senderID);

    if (!dataMoney || !dataMoney.hasOwnProperty('money')) {
      return api.sendMessage("Bạn không có tiền.", threadID, messageID);
    }

    const moneyUser = dataMoney.money;
    const choose = args[0].toLowerCase();

    // Validate the user's choice
    if (choose !== 'tài' && choose !== 'xỉu')
      return api.sendMessage("Bạn chưa nhập đúng cú pháp. Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]", threadID, messageID);

    // Validate the bet amount
    if (!args[1])
      return api.sendMessage("Bạn chưa nhập đúng cú pháp. Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]", threadID, messageID);

    let money = 0;
    const maxBet = 20000;

    if (args[1].toLowerCase() === 'allin') {
      money = moneyUser;
    } else {
      money = parseInt(args[1]);
      if (money < 10 || isNaN(money) || money > maxBet)
        return api.sendMessage("Mức đặt cược không hợp lệ hoặc cao hơn 20K xu!!!", threadID, messageID);
      if (moneyUser < money)
        return api.sendMessage(`Số dư của bạn không đủ ${money} xu để chơi`, threadID, messageID);
    }

    // Function to simulate dice roll
    const rollDice = () => Math.floor(Math.random() * 6) + 1;

    const dices = [rollDice(), rollDice(), rollDice()];
    const totalDice = dices.reduce((sum, dice) => sum + dice, 0);

    let result = '';
    let winnings = 0;
    let jackpotContribution = 0;
    let jackpotWinMessage = '';

    // Calculate game results based on the dice roll and user's bet
    if (totalDice === 3 && choose === 'xỉu') {
      result = 'thắng';
      winnings = money * 10 + jackpot;
      jackpotWinMessage = `🎉🎉🎉 Chúc mừng!!! ${userData.name} đã TRÚNG JACKPOT!!! 🏆🥳\nBạn đã thắng ${winnings.toFixed(0)} xu!!!\nHũ giờ là ${jackpot.toFixed(0)} xu.`;
      jackpot = 0;
    } else if (totalDice === 18 && choose === 'tài') {
      result = 'thắng';
      winnings = money * 10 + jackpot;
      jackpotWinMessage = `🎉🎉🎉 Chúc mừng!!! ${userData.name} đã TRÚNG JACKPOT!!! 🏆🥳\nBạn đã thắng ${winnings.toFixed(0)} xu!!!\nHũ giờ là ${jackpot.toFixed(0)} xu.`;
      jackpot = 0;
    } else if (choose === 'xỉu' && totalDice >= 4 && totalDice <= 10) {
      result = 'thắng';
      jackpotContribution = Math.floor(money * 0.05);
      winnings = money - jackpotContribution;
      jackpot += jackpotContribution;
    } else if (choose === 'tài' && totalDice >= 11 && totalDice <= 17) {
      result = 'thắng';
      jackpotContribution = Math.floor(money * 0.05);
      winnings = money - jackpotContribution;
      jackpot += jackpotContribution;
    } else {
      result = 'thua';
    }

    let winnerName = userData.name;
    if (result !== 'thắng') {
      winnerName = "Bot";
    }

    let message;
    // Handle winnings or loss
    if (result === 'thắng') {
      await Currencies.increaseMoney(senderID, winnings);
      message = `🎲 ❄️ Kết quả: ${dices.join(' + ')} = ${totalDice}\n${winnerName} đã ${result}! 💰💰💰\nSố tiền đặt cược: ${money.toFixed(0)} xu\nTiền thắng: ${winnings.toFixed(0)} xu\nHũ thuế: ${jackpot.toFixed(0)} xu\n${jackpotWinMessage}`;
    } else {
      await Currencies.decreaseMoney(senderID, parseInt(money));
      message = `🎲 ❄️ Kết quả: ${dices.join(' + ')} = ${totalDice}\n${winnerName} đã ${result}! 😢😢😢\nSố tiền đặt cược: ${money.toFixed(0)} xu\nChúc bạn may mắn lần sau! 🍀🍀🍀`;
    }

    api.sendMessage(message, threadID, messageID);

    // Update and save jackpot data
    jackpotData.jackpot = jackpot;
    jackpotData.lastWinner = winnerName;
    writeJackpotData(jackpotData);

  } catch (error) {
    console.error("Lỗi trong quá trình thực hiện lệnh:", error);
    api.sendMessage("Đã xảy ra lỗi trong quá trình thực hiện lệnh. Vui lòng thử lại sau.", threadID, messageID);
  }
};
