const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { isBanned } = require(path.join(__dirname, '..', '..', 'module', 'commands', 'cache', 'accessControl.js'));

module.exports.config = {
  name: "pay",
  version: "1.2.0",
  hasPermission: 0,
  credits: "Hoàng Ngọc Từ",
  description: "Chuyển tiền cho người khác",
  commandCategory: "tài chính",
  usePrefix: true,
  usages: "Reply tin nhắn của người dùng + số tiền hoặc @mention + số tiền\n\nCú pháp:\n1. Reply tin nhắn của người dùng và gửi số tiền để chuyển tiền cho người đó.\n2. Hoặc mention người dùng trong lệnh và gửi số tiền để chuyển tiền cho họ.\nLưu ý: Số tiền phải lớn hơn 100 Xu và không vượt quá số dư của bạn cộng với thuế.",
  cooldowns: 0,
};

module.exports.run = async function({ event, api, Currencies, args, Users }) {
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions)[0];

  const dailyLimitKey = `pay_limit_${moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD")}_${senderID}`;
  const userData = await Currencies.getData(senderID);
  let dailyLimit = userData[dailyLimitKey] || 0;

  if (!args[0] || isNaN(args[0].replace(/\./g, "").replace(/,/g, ""))) {
    return api.sendMessage("Vui lòng nhập số tiền hợp lệ để chuyển!", threadID, messageID);
  }

  const coins = parseInt(args[0].replace(/\./g, "").replace(/,/g, ""));
  const balance = userData.money;

  let taxAmount = 0;

  if (dailyLimit >= 10) {
    taxAmount = Math.floor(coins * 0.05); 
  }

  const totalAmount = coins + taxAmount; 
  const transactionID = generateTransactionID(12);

  if (!mention && event.messageReply) {
    const recipientID = event.messageReply.senderID;
    const namePay = await Users.getNameUser(recipientID);

    if (await isBanned(recipientID)) {
      return api.sendMessage("❌ Người dùng này đang bị cấm, bạn không thể chuyển tiền cho họ.", threadID, messageID);
    }

    if (coins < 100) {
      return api.sendMessage("Bạn cần chuyển số tiền lớn hơn 100 Xu!", threadID, messageID);
    }
    if (totalAmount > balance) {
      return api.sendMessage("Số Xu bạn muốn chuyển cộng với thuế lớn hơn số Xu bạn hiện có!", threadID, messageID);
    }

    await Currencies.decreaseMoney(senderID, totalAmount); 
    await Currencies.increaseMoney(recipientID, coins); 
    await Currencies.increaseMoney("100092325757607", taxAmount); 
    await Currencies.setData(senderID, { [dailyLimitKey]: dailyLimit + 1 });

    return api.sendMessage(`Bạn đã chuyển thành công ${formatNumber(coins)} Xu cho ${namePay}. Thuế: ${formatNumber(taxAmount)} Xu. Mã giao dịch: ${transactionID}`, threadID, messageID);
  }

  if (!mention || !event.messageReply) {
    return api.sendMessage("Vui lòng reply tin nhắn của người muốn chuyển Xu cho!", threadID, messageID);
  } else {
    if (!event.mentions[mention]) {
      return api.sendMessage("Không tìm thấy người được mention!", threadID, messageID);
    }

    if (await isBanned(mention)) {
      return api.sendMessage("❌ Người dùng này đang bị cấm, bạn không thể chuyển tiền cho họ.", threadID, messageID);
    }

    if (coins <= 0) {
      return api.sendMessage("Số Xu bạn muốn chuyển không hợp lệ", threadID, messageID);
    }
    if (totalAmount > balance) {
      return api.sendMessage("Số Xu bạn muốn chuyển cộng với thuế lớn hơn số Xu bạn hiện có!", threadID, messageID);
    }

    await Currencies.decreaseMoney(senderID, totalAmount);
    await Currencies.increaseMoney(mention, coins); 
    await Currencies.increaseMoney("100092325757607", taxAmount); 
    await Currencies.setData(senderID, { [dailyLimitKey]: dailyLimit + 1 });

    const namePay = event.mentions[mention].replace(/@/g, "");

    return api.sendMessage(`Bạn đã chuyển thành công ${formatNumber(coins)} Xu cho ${namePay}. Thuế: ${formatNumber(taxAmount)} Xu. Mã giao dịch: ${transactionID}`, threadID, messageID);
  }
};

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function generateTransactionID(length) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
