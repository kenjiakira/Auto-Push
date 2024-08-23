const fs = require('fs');
const path = require('path');

const cccdFilePath = path.join(__dirname, 'json', 'cccd.json');

module.exports.config = {
  name: "ban",
  version: "1.1.0",
  hasPermission: 2,
  credits: "Akira",
  description: "Lệnh Admin để Ban hoặc UnBan người dùng",
  commandCategory: "Quản trị",
  usePrefix: true,
  usages: "ban [ban/unban] [UID]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const action = args[0]?.toLowerCase();
  const uid = args[1];

  if (!action || !['ban', 'unban'].includes(action)) {
    return api.sendMessage("Vui lòng cung cấp hành động hợp lệ (ban/unban) và UID.", threadID, messageID);
  }

  if (!uid || isNaN(uid)) {
    return api.sendMessage("Vui lòng cung cấp UID hợp lệ.", threadID, messageID);
  }

  const cccdData = JSON.parse(fs.readFileSync(cccdFilePath, 'utf8'));

  if (!cccdData[uid]) {
    return api.sendMessage("UID không tồn tại trong hệ thống.", threadID, messageID);
  }

  if (action === 'ban') {
    if (cccdData[uid].status === 'BAN') {
      return api.sendMessage(`Người dùng với UID ${uid} đã bị cấm trước đó.`, threadID, messageID);
    }
    cccdData[uid].status = 'BAN';
    fs.writeFileSync(cccdFilePath, JSON.stringify(cccdData, null, 2));
    return api.sendMessage(`Người dùng với UID ${uid} đã bị cấm thành công.`, threadID, messageID);

  } else if (action === 'unban') {
    if (cccdData[uid].status === 'Bình Thường') {
      return api.sendMessage(`Người dùng với UID ${uid} đang ở trạng thái Bình Thường.`, threadID, messageID);
    }
    cccdData[uid].status = 'Bình Thường';
    fs.writeFileSync(cccdFilePath, JSON.stringify(cccdData, null, 2));
    return api.sendMessage(`Người dùng với UID ${uid} đã được gỡ cấm và trở lại trạng thái Bình Thường.`, threadID, messageID);
  }
};
