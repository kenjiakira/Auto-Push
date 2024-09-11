const fs = require("fs");

module.exports.config = {
  name: "money",
  version: "1.1.1",
  hasPermission: 0,
  credits: "Mirai Team Mod By AKIRA",
  description: "Kiểm tra số tiền của bản thân hoặc người được tag",
  commandCategory: "Tài Chính",
  usePrefix: true,
  usages: "gõ .balance để xem xu của mình or của người khác bằng cách tag \nvd: bạn cần xem tiền người tên A\ngõ [.balance @A] ",
  cooldowns: 5
};

module.exports.languages = {
  "vi": {
    "balance_personal": "Số xu bạn đang có: %1 xu",
    "balance_other": "Số xu của %1 hiện đang có là: %2 xu"
  },
  "en": {
    "balance_personal": "Your current balance: %1 💰",
    "balance_other": "%1's current balance: %2 💰"
  }
};

module.exports.run = async function ({ api, event, args, Currencies, getText }) {
  const { threadID, messageID, senderID, mentions } = event;

  if (!args[0]) {
    const userData = await Currencies.getData(senderID);
    const balance = userData && userData.money ? userData.money : 0;
    const formattedBalance = formatNumber(balance);
    return api.sendMessage(`${getText("balance_personal", formattedBalance)}`, threadID, messageID);
  }

  if (Object.keys(mentions).length === 1) {
    const mention = Object.keys(mentions)[0];
    const userData = await Currencies.getData(mention);
    const balance = userData && userData.money ? userData.money : 0;
    const formattedBalance = formatNumber(balance);
    return api.sendMessage({
      body: `${getText("balance_other", mentions[mention].replace(/\@/g, ""), formattedBalance)}`,
      mentions: [
        { tag: mentions[mention].replace(/\@/g, ""), id: mention }
      ]
    }, threadID, messageID);
  }

  return global.utils.throwError(this.config.name, threadID, messageID);
};

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
