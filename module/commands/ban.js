const fs = require('fs');
const path = require('path');

const cccdFilePath = path.join(__dirname,'json', 'cccd.json');

module.exports.config = {
  name: "ban",
  version: "1.0.0",
  hasPermission: 2, 
  credits: "Akira",
  description: "Cấm người dùng khỏi hệ thống",
  commandCategory: "Quản trị",
  usePrefix: true,
  usages: "ban [UID]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const uid = args[0];

  if (!uid || isNaN(uid)) {
    return api.sendMessage("Vui lòng cung cấp UID hợp lệ để cấm.", threadID, messageID);
  }

  const cccdData = JSON.parse(fs.readFileSync(cccdFilePath, 'utf8'));

  if (!cccdData[uid]) {
    return api.sendMessage("UID không tồn tại trong hệ thống.", threadID, messageID);
  }

  cccdData[uid].status = 'BAN';
  fs.writeFileSync(cccdFilePath, JSON.stringify(cccdData, null, 2));

  return api.sendMessage(`Người dùng với UID ${uid} đã bị cấm thành công.`, threadID, messageID);
};
