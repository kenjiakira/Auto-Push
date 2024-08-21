const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const diceImagesPath = path.join(__dirname, 'dice_images');
const combinedImagePath = path.join(__dirname, 'dice_images', 'combined_dice_image.png');
const jackpotDataPath = path.join(__dirname, 'json', 'jackpot.json');

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

module.exports.config = {
  name: "tx",
  version: "1.1.7",
  hasPermission: 0,
  credits: "Akira",
  description: "Chơi tài xỉu",
  commandCategory: "Mini Game",
  usePrefix: true,
  usages: "Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]",
  cooldowns: 0
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  const { threadID, messageID, senderID } = event;

  try {
    if (!args[0]) return api.sendMessage("Bạn chưa nhập đúng cú pháp. Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]", threadID, messageID);

    const dataMoney = await Currencies.getData(senderID);
    const userData = await Users.getData(senderID);

    if (!dataMoney || !dataMoney.hasOwnProperty('money')) {
      return api.sendMessage("Bạn không có tiền.", threadID, messageID);
    }

    const moneyUser = dataMoney.money;
    const choose = args[0].toLowerCase();

    if (choose !== 'tài' && choose !== 'xỉu')
      return api.sendMessage("Bạn chưa nhập đúng cú pháp. Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]", threadID, messageID);

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

    const rollDice = () => {
      return Math.floor(Math.random() * 6) + 1;
    };

    const dices = [rollDice(), rollDice(), rollDice()];
    const totalDice = dices.reduce((sum, dice) => sum + dice, 0);

    let result = '';
    let winnings = 0;
    let jackpotContribution = 0;

    // Cơ chế mới: Cược thấp có cơ hội trúng ít, cược cao có cơ hội trúng nhiều hơn
    if (totalDice === 3 && choose === 'xỉu') {
      result = 'thắng';
      winnings = money * 5 + jackpot;
      jackpot = 0;
    } else if (totalDice === 18 && choose === 'tài') {
      result = 'thắng';
      winnings = money * 5 + jackpot;
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
    if (result === 'thắng') {
      await Currencies.increaseMoney(senderID, winnings);
      message = `🎲 ❄️ Kết quả: ${dices.join(' + ')} = ${totalDice}\n${winnerName} đã ${result}! 💰💰💰\nSố tiền đặt cược: ${money.toFixed(0)} xu\nTiền thắng: ${winnings.toFixed(0)} xu\nHũ thuế: ${jackpot.toFixed(0)} xu`;
    } else {
      await Currencies.decreaseMoney(senderID, parseInt(money));
      message = `🎲 ❄️ Kết quả: ${dices.join(' + ')} = ${totalDice}\n${winnerName} đã ${result}! 😢😢😢\nSố tiền đặt cược: ${money.toFixed(0)} xu\nChúc bạn may mắn lần sau! 🍀🍀🍀`;
    }

    await sendResultWithImages(api, threadID, message, dices);

    // Cập nhật dữ liệu hũ và người thắng
    jackpotData.jackpot = jackpot;
    jackpotData.lastWinner = winnerName;
    writeJackpotData(jackpotData);

  } catch (error) {
    console.error("Lỗi trong quá trình thực hiện lệnh:", error);
    api.sendMessage("Đã xảy ra lỗi trong quá trình thực hiện lệnh. Vui lòng thử lại sau.", threadID, messageID);
  }
};
