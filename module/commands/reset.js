const adminUIDs = ["61563982612558"];

module.exports.config = {
  name: "reset",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Yae Miko",
  description: "lệnh admin",
  commandCategory: "Hệ Thống",
  usePrefix: true,
  usages: "reset [%]",
  cooldowns: 5
};

module.exports.config = {
  name: "reset",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Yae Miko",
  description: "Reset số Xu người dùng",
  commandCategory: "Hệ Thống",
  usePrefix: true,
  usages: "reset [%]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args, Currencies }) => {
  const percentageInput = args[0];
  const senderID = event.senderID;

  if (!adminUIDs.includes(senderID)) {
    return api.sendMessage("Bạn không có quyền truy cập vào chức năng này!", event.threadID);
  }

  const threadList = await api.getThreadList(100, null, ["INBOX"]); 

  if (!percentageInput) {

    for (const thread of threadList) {
      const threadID = thread.threadID;
      const threadInfo = await api.getThreadInfo(threadID);
      const threadMembers = threadInfo.userInfo;

      for (const member of threadMembers) {
        const userID = member.id;
        const currenciesData = await Currencies.getData(userID);

        if (currenciesData && typeof currenciesData.money === 'number' && currenciesData.money > 0) {
          console.log(`Reset tiền cho userID: ${userID}, Tên: ${member.name}, Số tiền trước khi reset: ${currenciesData.money}`);
          await Currencies.setData(userID, { money: 0 });
          console.log(`Số tiền sau khi reset: 0`);
        }
      }
    }
    return api.sendMessage("Toàn bộ số tiền của thành viên trong server đã được xóa về 0!", event.threadID);
  }

  const percentage = parseInt(percentageInput);

  if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
    return api.sendMessage("Vui lòng nhập một phần trăm hợp lệ từ 1 đến 100 hoặc không nhập để xóa toàn bộ tiền!", event.threadID);
  }

  for (const thread of threadList) {
    const threadID = thread.threadID;
    const threadInfo = await api.getThreadInfo(threadID);
    const threadMembers = threadInfo.userInfo;

    for (const member of threadMembers) {
      const userID = member.id;
      const currenciesData = await Currencies.getData(userID);

      if (currenciesData && typeof currenciesData.money === 'number' && currenciesData.money > 0) {
        const money = currenciesData.money;
        const reducedMoney = Math.ceil(money * (percentage / 100)); 
        console.log(`Giảm tiền cho userID: ${userID}, Tên: ${member.name}, Số tiền trước khi giảm: ${money}, Số tiền sau khi giảm: ${reducedMoney}`);
        await Currencies.setData(userID, { money: reducedMoney });
      }
    }
  }

  return api.sendMessage(`Số tiền của tất cả thành viên trong server đã được giảm về ${percentage}%!`, event.threadID);
};