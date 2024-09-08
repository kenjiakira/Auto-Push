const { exec } = require('child_process');

module.exports.config = {
  name: 'speedtest',
  version: '1.0.0',
  hasPermission: 0,
  credits: 'HNT',
  description: 'Kiểm tra tốc độ mạng của hệ thống Bot',
  commandCategory: 'Hệ thống',
  usages: 'speedtest',
  cooldowns: 10,
  usePrefix: true
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  api.sendMessage('🔄 Đang kiểm tra tốc độ mạng, vui lòng chờ...', threadID, messageID);

  exec('speedtest-cli --simple', (error, stdout, stderr) => {
    if (error) {
      console.error(`Lỗi khi chạy lệnh speedtest-cli: ${error.message}`);
      return api.sendMessage('❌ Đã xảy ra lỗi khi kiểm tra tốc độ mạng.', threadID, messageID);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return api.sendMessage('❌ Đã xảy ra lỗi khi kiểm tra tốc độ mạng.', threadID, messageID);
    }

    api.sendMessage(`📊 Kết quả kiểm tra tốc độ mạng:\n\n${stdout}`, threadID, messageID);
  });
};
