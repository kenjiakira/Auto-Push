const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const diceImagesPath = path.join(__dirname, 'dice_images');
const combinedImagePath = path.join(__dirname, 'dice_images', 'combined_dice_image.png');
const jackpotDataPath = path.join(__dirname, 'json', 'jackpot.json');
const userDataPath = path.join(__dirname, 'json', 'userData.json');

const adminGroups = ['6589198804475799', '6589198804475799'];

function readJackpotData() {
  try {
    const rawData = fs.readFileSync(jackpotDataPath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu hũ từ jackpot.json:", error);
    return { jackpot: 0, lastWinner: null };
  }
}

function writeJackpotData(data) {
  try {
    fs.writeFileSync(jackpotDataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Lỗi khi ghi dữ liệu hũ vào jackpot.json:", error);
  }
}

let jackpotData = readJackpotData();
let jackpot = jackpotData.jackpot;

function readUserData() {
  try {
    const rawData = fs.readFileSync(userDataPath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu người chơi:", error);
    return {};
  }
}

function writeUserData(data) {
  try {
    fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Lỗi khi ghi dữ liệu người chơi:", error);
  }
}

let userData = readUserData();

const rollDice = () => Math.floor(Math.random() * 6) + 1;

const calculateOdds = (userID) => {
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
  const user = userData[userID] || { wins: 0, losses: 0 };
  const alpha = 2;
  const beta = 2;

  const totalGames = user.wins + user.losses + alpha + beta;
  const winProb = (user.wins + alpha) / totalGames;
  const lossProb = (user.losses + beta) / totalGames;

  return winProb;
};

const adjustedRollDice = (choose, userID) => {
  let dices;
  let totalDice;
  let isWin;
  const user = userData[userID] || { wins: 0, losses: 0 };

  let odds = (calculateOdds(userID) + calculateBayesianOdds(userID)) / 2;
  let loseChance = 1 - odds;

  do {
    dices = [rollDice(), rollDice(), rollDice()];
    totalDice = dices.reduce((sum, dice) => sum + dice, 0);

    const isXiuWin = (totalDice >= 3 && totalDice <= 10);
    const isTaiWin = (totalDice >= 11 && totalDice <= 17);

    if ((totalDice === 3 && choose === 'xỉu') || (totalDice === 18 && choose === 'tài')) {
      isWin = true;
    } else {
      isWin = (choose === 'xỉu' && isXiuWin) || (choose === 'tài' && isTaiWin);
    }

  } while (Math.random() < loseChance && isWin !== true);

  if (isWin) {
    user.wins = (user.wins || 0) + 1;
  } else {
    user.losses = (user.losses || 0) + 1;
  }

  userData[userID] = user;
  writeUserData(userData);

  return dices;
};

const combineImages = async (diceNumbers) => {
  try {
    const images = await Promise.all(
      diceNumbers.map(diceNumber =>
        sharp(path.join(diceImagesPath, `dice${diceNumber}.png`)).resize(200, 200).toBuffer()
      )
    );

    const combinedImage = sharp({
      create: {
        width: 600,
        height: 200,
        channels: 4,
        background: 'white'
      }
    });

    const compositeImage = combinedImage.composite(
      images.map((imageBuffer, index) => ({
        input: imageBuffer,
        top: 0,
        left: index * 200
      }))
    );

    await compositeImage.toFile(combinedImagePath);
    console.log("Hình ảnh đã được kết hợp và lưu tại:", combinedImagePath);
  } catch (error) {
    console.error("Lỗi khi kết hợp hình ảnh:", error);
  }
};

const sendResultWithImages = async (api, threadID, message, diceNumbers) => {
  try {
    await combineImages(diceNumbers);

    await api.sendMessage({
      body: message,
      attachment: fs.createReadStream(combinedImagePath)
    }, threadID);
  } catch (error) {
    console.error("Lỗi khi gửi hình ảnh xúc xắc và văn bản:", error);
  }
};

module.exports.config = {
  name: "tx",
  version: "1.1.9",
  hasPermission: 2,
  credits: "Akira",
  description: "Chơi tài xỉu",
  commandCategory: "Mini Game",
  usePrefix: true,
  usages: "Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]",
  cooldowns: 5
};
module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  const { threadID, messageID, senderID } = event;

  try {
    // Check if the command is being run in an admin group
    if (adminGroups.includes(threadID)) {
      return api.sendMessage("Chức năng này không khả dụng trong nhóm admin.", threadID, messageID);
    }

    const cooldown = 30; 
    const dataMoney = await Currencies.getData(senderID);
    const userData = await Users.getData(senderID);

    if (!dataMoney || !dataMoney.hasOwnProperty('money')) {
      return api.sendMessage("Bạn không có tiền.", threadID, messageID);
    }

    const moneyUser = dataMoney.money;

    // Check if args[0] is defined and valid
    if (!args[0] || (args[0].toLowerCase() !== 'tài' && args[0].toLowerCase() !== 'xỉu')) {
      return api.sendMessage("Bạn chưa nhập đúng cú pháp. Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]", threadID, messageID);
    }

    const choose = args[0].toLowerCase();

    if (!args[1]) {
      return api.sendMessage("Bạn chưa nhập đúng cú pháp. Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]", threadID, messageID);
    }

    let money = 0;
    const maxBet = 20000;

    if (args[1].toLowerCase() === 'allin') {
      if (moneyUser <= 0) {
        return api.sendMessage("Số dư của bạn không đủ để đặt cược allin.", threadID, messageID);
      }
      money = moneyUser;
    } else {
      money = parseInt(args[1]);
      if (money < 10 || isNaN(money) || money > maxBet) {
        return api.sendMessage("Mức đặt cược không hợp lệ hoặc cao hơn 20K xu!!!", threadID, messageID);
      }
      if (moneyUser < money) {
        return api.sendMessage(`Số dư của bạn không đủ ${money} xu để chơi`, threadID, messageID);
      }
    }

    const currentTime = Date.now();
    const lastPlayTime = userData.lastPlayTime || 0;
    if ((currentTime - lastPlayTime) < cooldown * 1000) {
      const remainingTime = Math.ceil((cooldown - (currentTime - lastPlayTime) / 1000));
      return api.sendMessage(`Bạn cần chờ thêm ${remainingTime} giây để chơi lại!`, threadID, messageID);
    }

    userData.lastPlayTime = currentTime;
    await Users.setData(senderID, userData);

    const dices = adjustedRollDice(choose, senderID);
    const totalDice = dices.reduce((sum, dice) => sum + dice, 0);

    let result = '';
    let winnings = 0;
    let jackpotContribution = 0;
    let jackpotWinMessage = '';

    const isWin = (choose === 'xỉu' && totalDice >= 3 && totalDice <= 10) || 
                   (choose === 'tài' && totalDice >= 11 && totalDice <= 17);

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
    } else if (isWin) {
      result = 'thắng';
      jackpotContribution = Math.floor(money * 0.05);
      winnings = money - jackpotContribution;
      jackpot += jackpotContribution;
    } else {
      result = 'thua';
      winnings = -money;
      await Currencies.decreaseMoney(senderID, money);
    }

    if (result === 'thắng') {
      await Currencies.increaseMoney(senderID, winnings);
    }

    let message = `🎲 ❄️ Kết quả: ${dices.join(' + ')} = ${totalDice}\n${userData.name} đã ${result}! ${result === 'thắng' ? '💰💰💰' : '😢😢😢'}\nSố tiền đặt cược: ${money.toFixed(0)} xu\n${result === 'thắng' ? `Tiền thắng: ${winnings.toFixed(0)} xu\nHũ thuế: ${jackpot.toFixed(0)} xu\n${jackpotWinMessage}` : 'Chúc bạn may mắn lần sau! 🍀🍀🍀'}`;

    await sendResultWithImages(api, threadID, message, dices);

    jackpotData.jackpot = jackpot;
    jackpotData.lastWinner = userData.name;
    writeJackpotData(jackpotData);

  } catch (error) {
    console.error("Lỗi trong quá trình thực hiện lệnh:", error);
    api.sendMessage("Đã xảy ra lỗi trong quá trình thực hiện lệnh. Vui lòng thử lại sau.", threadID, messageID);
  }
};
