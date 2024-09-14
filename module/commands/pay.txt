const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

module.exports.config = {
  name: "pay",
  version: "1.0.0",
  hasPermission: 0,
  credits: "",
  description: "Chuyển tiền cho người khác",
  commandCategory: "tài chính",
  usePrefix: true,
  usages: "Reply tin nhắn của người dùng + số tiền hoặc @mention + số tiền",
  cooldowns: 0,
};

module.exports.run = async function({ event, api, Currencies, args, Users }) {
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions)[0];

  const dailyLimitKey = `pay_limit_${moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD")}_${senderID}`;
  
  const userData = await Currencies.getData(senderID) || { money: 0, [dailyLimitKey]: 0 };
  let dailyLimit = userData[dailyLimitKey] || 0;

  if (!args[0] || isNaN(args[0].replace(/\./g, "").replace(/,/g, ""))) {
    return api.sendMessage("Vui lòng nhập số tiền hợp lệ để chuyển!", threadID, messageID);
  }

  const coins = parseInt(args[0].replace(/\./g, "").replace(/,/g, ""));
  const balance = userData.money;

  if (!mention && event.messageReply) {
    const recipientID = event.messageReply.senderID;
    const recipientData = await Currencies.getData(recipientID);
    if (!recipientData) {
      return api.sendMessage("Người nhận không tồn tại trong cơ sở dữ liệu!", threadID, messageID);
    }

    if (coins < 1000) {
      return api.sendMessage("Bạn cần chuyển số tiền lớn hơn 1000 Xu!", threadID, messageID);
    }
    if (coins > balance) {
      return api.sendMessage("Số Xu bạn muốn chuyển lớn hơn số Xu bạn hiện có!", threadID, messageID);
    }

    await Currencies.decreaseMoney(senderID, coins);
    await Currencies.increaseMoney(recipientID, coins);
    await Currencies.setData(senderID, { [dailyLimitKey]: dailyLimit + 1 });

    return api.sendMessage(`Chuyển thành công ${coins} Xu đến ${await Users.getNameUser(recipientID)}`, threadID, messageID);
  }

  if (mention) {
    if (coins <= 0) {
      return api.sendMessage("Số Xu bạn muốn chuyển không hợp lệ", threadID, messageID);
    }
    if (coins > balance) {
      return api.sendMessage("Số Xu bạn muốn chuyển lớn hơn số Xu bạn hiện có!", threadID, messageID);
    }

    const mentionID = event.mentions[mention].replace(/@/g, "");
    const mentionData = await Currencies.getData(mentionID);
    if (!mentionData) {
      return api.sendMessage("Người nhận không tồn tại trong cơ sở dữ liệu!", threadID, messageID);
    }

    await Currencies.decreaseMoney(senderID, coins);
    await Currencies.increaseMoney(mentionID, coins);
    await Currencies.setData(senderID, { [dailyLimitKey]: dailyLimit + 1 });

    return api.sendMessage(`Chuyển thành công ${coins} Xu đến ${await Users.getNameUser(mentionID)}`, threadID, messageID);
  } else {
    return api.sendMessage("Vui lòng reply tin nhắn của người muốn chuyển Xu cho hoặc mention người nhận!", threadID, messageID);
  }
};

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


---CÓ GÌ HOT?---

--cập nhật thử nghiệm bản AI (BETA có giới hạn)--

-nếu bạn rảnh bạn có thể trò chuyện cùng với trợ lý của Admin này bằng cú pháp 'ai' và Phản hồi lại tin nhắn của AI để trò chuyện. mở thử nghiệm nên sẽ có giới hạn.