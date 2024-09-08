const axios = require('axios');

module.exports.config = {
  name: "ip",
  version: "1.1.0",
  hasPermission: 0,
  credits: "NTKhang, Nguyên Blue [convert]",
  description: "Kiểm tra thông tin IP hoặc cung cấp IP ngẫu nhiên",
  commandCategory: "TOOLS",
  usePrefix: true,
  usages: "ip [địa chỉ IP]\n\n" +
          "Hướng dẫn sử dụng:\n" +
          "- `ip [địa chỉ IP]`: Kiểm tra thông tin địa chỉ IP.\n" +
          "- `ip random`: Cung cấp thông tin IP ngẫu nhiên.",
  cooldowns: 5
};

const randomIps = [
  '8.8.8.8', 
  '1.1.1.1', 
  '9.9.9.9', 
  '208.67.222.222', 
  '185.199.108.153' 
];

function getRandomIp() {
  return randomIps[Math.floor(Math.random() * randomIps.length)];
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  let ipAddress = args.join(' ').toLowerCase();

  if (ipAddress === 'random') {
    ipAddress = getRandomIp();
  }

  if (!ipAddress) {
    return api.sendMessage("❎ Vui lòng nhập địa chỉ IP bạn muốn kiểm tra hoặc gõ `random` để lấy IP ngẫu nhiên.", threadID, messageID);
  }

  try {
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}?fields=66846719`);
    const infoip = response.data;

    if (infoip.status === 'fail') {
      return api.sendMessage(`⚠️ Đã xảy ra lỗi: ${infoip.message}`, threadID, messageID);
    }

    const messageBody = `🗺️ Châu lục: ${infoip.continent}\n` +
                        `🏳️ Quốc gia: ${infoip.country}\n` +
                        `🎊 Mã QG: ${infoip.countryCode}\n` +
                        `🕋 Khu vực: ${infoip.region}\n` +
                        `⛱️ Vùng/Tiểu bang: ${infoip.regionName}\n` +
                        `🏙️ Thành phố: ${infoip.city}\n` +
                        `🛣️ Quận/Huyện: ${infoip.district}\n` +
                        `📮 Mã bưu chính: ${infoip.zip}\n` +
                        `🧭 Latitude: ${infoip.lat}\n` +
                        `🧭 Longitude: ${infoip.lon}\n` +
                        `⏱️ Timezone: ${infoip.timezone}\n` +
                        `👨‍✈️ Tên tổ chức: ${infoip.org}\n` +
                        `💵 Đơn vị tiền tệ: ${infoip.currency}`;

    return api.sendMessage({
      body: messageBody,
      location: {
        latitude: infoip.lat,
        longitude: infoip.lon,
        current: true
      }
    }, threadID, messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("⚠️ Đã xảy ra lỗi khi kiểm tra IP. Vui lòng thử lại sau.", threadID, messageID);
  }
};
