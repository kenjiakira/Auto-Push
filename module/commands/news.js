const axios = require('axios');
const cheerio = require('cheerio');
const schedule = require('node-schedule');

module.exports.config = {
  name: "news",
  version: "1.0.3",
  hasPermission: 0,
  credits: "HungCho mod by Hoàng Ngọc Từ",
  description: "Xem tin tức mới nhất",
  commandCategory: "Tiện ích",
  usePrefix: true,
  usages: "news\n\nLệnh này lấy tin tức mới nhất từ VnExpress và gửi đến bạn",
  cooldowns: 0,
  dependencies: { "axios": "", "cheerio": "", "node-schedule": "" }
};

async function fetchNews(api, threadID) {
  try {
    const response = await axios.get('https://vnexpress.net/tin-tuc-24h');
    const $ = cheerio.load(response.data);
    const thoigian = $('.time-count');
    const tieude = $('.thumb-art');
    const noidung = $('.description');
    const time = thoigian.find('span').attr('datetime');
    const title = tieude.find('a').attr('title');
    const des = noidung.find('a').text();
    const link = noidung.find('a').attr('href');
    const description = des.split('.');

    const message = `===  [ 𝗧𝗜𝗡 𝗧𝗨̛́𝗖 ] ===\n━━━━━━━━━━━━━\n📺 Tin tức mới nhất\n⏰ Thời gian đăng: ${time}\n📰 Tiêu đề: ${title}\n\n📌 Nội dung: ${description[0]}\n🔗 Link: ${link}\n`;

    api.sendMessage(message, threadID);
  } catch (error) {
    api.sendMessage("Đã xảy ra lỗi khi lấy tin từ VnExpress.", threadID);
  }
}

module.exports.run = async function({ api, event }) {
  const { threadID } = event;


  schedule.scheduleJob('0 * * * *', () => {
    fetchNews(api, threadID);
  });


  await fetchNews(api, threadID);
};
