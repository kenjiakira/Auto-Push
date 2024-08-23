const axios = require('axios');
const translate = require('translate-google');

module.exports.config = {
  name: "fact",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Hoàng Ngọc Từ",
  description: "Gửi một sự thật ngẫu nhiên.",
  commandCategory: "general",
  usePrefix: true,
  usages: "fact - Gửi một sự thật ngẫu nhiên.",
  cooldowns: 5
};

async function fetchRandomFact(api, threadID) {
  try {
    const response = await axios.get('https://useless-facts.sameerkumar.website/api');
    const fact = response.data.data;

    const translatedFact = await translate(fact, { to: 'vi' });
    api.sendMessage(`📚 Sự thật ngẫu nhiên: ${translatedFact}`, threadID);
  } catch (error) {
    console.error(error);
    if (threadID) {
      api.sendMessage('Đã xảy ra lỗi khi lấy sự thật ngẫu nhiên.', threadID);
    }
  }
}

module.exports.run = async ({ api, event }) => {
  fetchRandomFact(api, event.threadID);
};

module.exports.onLoad = function({ api }) {
  const vietnamTimezoneOffset = 7 * 60 * 60 * 1000; 
  
  const now = new Date();
  const localTime = new Date(now.getTime() + vietnamTimezoneOffset); 

  const minutesUntilNextHalfHour = 30 - (localTime.getMinutes() % 30);
  const msUntilNextHalfHour = (minutesUntilNextHalfHour * 60 + (60 - localTime.getSeconds())) * 1000; 

  console.log(`Đang chờ ${msUntilNextHalfHour} ms để gửi sự thật ngẫu nhiên đầu tiên.`);

  setTimeout(() => {
      console.log('Gửi sự thật ngẫu nhiên đầu tiên.');
      notifyRandomFact(api); 
      setInterval(() => {
          console.log('Gửi sự thật ngẫu nhiên mỗi 30 phút.');
          notifyRandomFact(api); 
      }, 30 * 60 * 1000);
  }, msUntilNextHalfHour);

  async function notifyRandomFact(api) {
    let threadIDs = [];
    try {
        const data = await fs.readFile('module/commands/noti/groups.json', 'utf8');
        const jsonData = JSON.parse(data);
        threadIDs = jsonData.map(entry => entry.threadID);
    } catch (error) {
        console.error("Lỗi khi đọc tệp groups.json:", error.message);
        return;
    }

    if (threadIDs.length === 0) {
      console.log('Danh sách Thread ID không hợp lệ hoặc trống.');
      return;
    }

    threadIDs.forEach(threadID => {
        if (threadID) {
            fetchRandomFact(api, threadID);
        } else {
            console.log('Thread ID không hợp lệ:', threadID);
        }
    });
  }
};
