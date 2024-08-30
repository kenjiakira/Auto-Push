const { randomInt } = require('crypto');
const path = require('path');

const slotSymbols = ["🍒", "🍋", "🍇", "🍀", "🍉", "🍊", "🍎", "💎", "⭐"];
const betAmounts = [500, 1000, 2000, 5000, 10000];
const taxRecipientUID = "100029043375434";
const wildSymbol = "💎";
const scatterSymbol = "⭐";
const jackpotRewards = {
  500: 25000,
  1000: 50000,
  2000: 250000,
  5000: 500000,
  10000: 1000000
};
const bonusPrizes = [25000, 50000, 100000];

module.exports.config = {
  name: "slot",
  version: "3.0.0",
  hasPermission: 0,
  credits: "HNT",
  description: "Mini game",
  commandCategory: "game",
  usePrefix: true,
  usages: "Sử dụng: .slot [cược]",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args, Currencies, Users }) => {
  const { senderID, threadID } = event;


  const userData = await Currencies.getData(senderID);
  const user = await Users.getData(senderID);

  if (!userData) {
    await Currencies.setData(senderID, { money: 0 });
  }

  const userMoney = userData.money || 0;
  const bet = parseInt(args[0]);

  if (!betAmounts.includes(bet)) {
    return api.sendMessage("❌ Vui lòng chọn một mức cược hợp lệ: " + betAmounts.join(", "), threadID);
  }

  if (userMoney < bet) {
    return api.sendMessage("❌ Số dư của bạn không đủ để đặt cược " + formatNumber(bet) + " xu.", threadID);
  }

  api.sendMessage("⏳ Đang quay slot, vui lòng đợi 10 giây...", threadID, async () => {
    setTimeout(async () => {
      const spinResult = [];
      for (let i = 0; i < 3; i++) {
        const randomSymbolIndex = Math.floor(Math.random() * slotSymbols.length);
        spinResult.push(randomSymbolIndex);
      }

      const spinResultText = spinResult.map(index => slotSymbols[index]).join(" ");

      const symbolCounts = spinResult.reduce((acc, index) => {
        acc[index] = (acc[index] || 0) + 1;
        return acc;
      }, {});

      const uniqueSymbols = Object.values(symbolCounts);

      let message = `🎰 Kết quả: ${spinResultText}\n`;
      let winAmount = 0;
      const winnerName = user.name;

      if (spinResult.every(index => slotSymbols[index] === wildSymbol)) {
        const jackpotAmount = jackpotRewards[bet];
        message += `🎉 Chúc mừng! ${winnerName} đã thắng Jackpot trị giá ${formatNumber(jackpotAmount)} xu!`;
        await Currencies.increaseMoney(senderID, jackpotAmount);
      } else if (spinResult.every(index => slotSymbols[index] === scatterSymbol)) {
        const bonusPrize = bonusPrizes[Math.floor(Math.random() * bonusPrizes.length)];
        message += `🎉 Chúc mừng! ${winnerName} đã trúng 5 sao và nhận được vòng quay phụ với giải thưởng ${formatNumber(bonusPrize)} xu!`;
        await Currencies.increaseMoney(senderID, bonusPrize);
      } else {
        let multiplier = 0;

        if (uniqueSymbols.includes(3)) { 
          multiplier = 4;
        } else if (uniqueSymbols.includes(2)) { 
          multiplier = 2;
        }

        if (multiplier > 0) {
          winAmount = bet * 1.45 * multiplier;
          message += `🎉 Chúc mừng! ${winnerName} đã thắng ${formatNumber(winAmount)} xu với hệ số ${multiplier}x.\n`;

          const tax = Math.floor(winAmount * 0.01);
          winAmount -= tax;

          if (taxRecipientUID === senderID) {
            message += `👏 Bạn đã nhận được ${formatNumber(winAmount)} xu\n(thuế 1%: ${formatNumber(tax)} xu).`;
          } else {
            await Currencies.increaseMoney(senderID, winAmount);
            await Currencies.increaseMoney(taxRecipientUID, tax);
            message += `👏 ${winnerName} đã nhận được ${formatNumber(winAmount)} xu.\n👏 Thuế đã trừ: ${formatNumber(tax)} xu.`;
          }
        } else {
          await Currencies.decreaseMoney(senderID, bet);
          message += `😢 Rất tiếc, ${winnerName} đã thua ${formatNumber(bet)} xu. Hãy thử lại may mắn ở lần sau.`;
        }
      }

      api.sendMessage(message, threadID);
    }, 10000); 
  });
};

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
}
