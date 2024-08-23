const path = require('path');

module.exports.config = {
  name: "baucua",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Hoàng Ngọc Từ",
  description: "Chơi Bầu Cua",
  commandCategory: "game",
  usePrefix: true,
  usages: "baucua <cược> <bầu/cua/cá/mèo/tôm/nai>\n\n" +
      "Hướng dẫn sử dụng:\n" +
      "- `<cược>`: Số tiền bạn muốn cược, ví dụ: 1000\n" +
      "- `<bầu/cua/cá/mèo/tôm/nai>`: Con vật bạn dự đoán sẽ xuất hiện, chọn một trong các con vật này\n\n" +
      "Ví dụ:\n" +
      "- Cược 1000 xu vào con mèo: `baucua 1000 mèo`\n" +
      "- Cược 5000 xu vào con tôm: `baucua 5000 tôm`\n\n" +
      "Lưu ý:\n" +
      "- Số tiền cược tối đa là 20000 xu.\n" +
      "- Bạn phải chờ 15 giây trước khi chơi lại.",
  cooldowns: 5
};

const playingUsers = new Set();
const maxBet = 20000;

const { hasID, isBanned } = require(path.join(__dirname, '..', '..', 'module', 'commands', 'cache', 'accessControl.js'));

module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, messageID, senderID } = event;

  if (!(await hasID(senderID))) {
    return api.sendMessage("⚡ Bạn cần có ID để chơi trò này!\ngõ .id để tạo ID", threadID, messageID);
  }

  if (await isBanned(senderID)) {
    return api.sendMessage("⚡ Bạn đã bị cấm và không thể chơi trò này!", threadID, messageID);
  }

  if (playingUsers.has(senderID)) {
    return api.sendMessage("⏳ Bạn phải chờ 15 giây trước khi chơi lại.", threadID, messageID);
  }

  if (args.length < 2) {
    return api.sendMessage("📝 Bạn phải nhập số tiền cược và chọn một trong các con vật: bầu, cua, cá, mèo, tôm, nai. Ví dụ: baucua 1000 mèo", threadID, messageID);
  }

  const betAmount = parseInt(args[0]);
  const chosenAnimal = args[1].toLowerCase();
  const animals = ["bầu", "cua", "cá", "mèo", "tôm", "nai"];
  const animalEmojis = {
    "bầu": "🍐",
    "cua": "🦀",
    "cá": "🐟",
    "mèo": "🐈",
    "tôm": "🦐",
    "nai": "🦌"
  };

  if (!animals.includes(chosenAnimal)) {
    return api.sendMessage("❌ Con vật bạn chọn không hợp lệ. Vui lòng chọn một trong các con vật: bầu, cua, cá, mèo, tôm, nai. Ví dụ: baucua 1000 mèo", threadID, messageID);
  }

  const userData = await Currencies.getData(senderID);
  const userMoney = userData.money;

  if (isNaN(betAmount) || betAmount <= 0) {
    return api.sendMessage("❌ Số tiền cược không hợp lệ.", threadID, messageID);
  }

  if (betAmount > userMoney) {
    return api.sendMessage("❌ Bạn không có đủ tiền để đặt cược.", threadID, messageID);
  }

  if (betAmount > maxBet) {
    return api.sendMessage(`❌ Số tiền cược tối đa là ${maxBet} xu.`, threadID, messageID);
  }

  playingUsers.add(senderID);

  const diceResults = Array(3).fill().map(() => animals[Math.floor(Math.random() * animals.length)]);
  const diceEmojis = diceResults.map(animal => animalEmojis[animal]).join(' ');

  const winnings = diceResults.filter(animal => animal === chosenAnimal).length * betAmount;

  let message;
  if (winnings > 0) {
    await Currencies.increaseMoney(senderID, winnings);
    message = `🎉 Kết quả: ${diceEmojis}\nChúc mừng! Bạn đã thắng ${winnings} xu.`;
  } else {
    await Currencies.decreaseMoney(senderID, betAmount);
    message = `😢 Kết quả: ${diceEmojis}\nRất tiếc! Bạn đã thua ${betAmount} xu.`;
  }

  api.sendMessage(message, threadID, messageID);

  setTimeout(() => playingUsers.delete(senderID), 15000); 
};
