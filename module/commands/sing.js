const fs = require('fs-extra');
const ytdl = require('@distube/ytdl-core');
const Youtube = require('youtube-search-api');
const axios = require('axios');
const path = require('path');

const historyPath = path.join(__dirname, 'json', 'sing.json');

if (!fs.existsSync(historyPath)) {
  fs.writeFileSync(historyPath, JSON.stringify({}), 'utf8');
}

const convertHMS = (value) => new Date(value * 1000).toISOString().slice(11, 19);

const config = {
  name: "sing",
  version: "1.0.1",
  hasPermission: 0,
  credits: "Akira",
  description: "Phát nhạc qua liên kết YouTube hoặc từ khóa tìm kiếm",
  usePrefix: true,
  commandCategory: "Phương tiện",
  usages: "[searchMusic] | history - Xem lịch sử nhạc | suggest - Đề xuất nhạc",
  cooldowns: 0
};

const ITAG = 140; 

const downloadMusicFromYoutube = async (link, filePath, itag = ITAG) => {
  try {
    if (!link || typeof link !== 'string') {
      throw new Error('Liên kết không hợp lệ');
    }

    const videoIDMatch = link.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    if (!videoIDMatch || videoIDMatch.length < 2) {
      throw new Error('ID video không hợp lệ');
    }
    const videoID = videoIDMatch[1];

    if (videoID.length !== 11) {
      throw new Error('ID video không hợp lệ');
    }

    const data = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoID}`);
    if (!data || !data.videoDetails) {
      throw new Error('Không thể lấy thông tin video');
    }

    const result = {
      title: data.videoDetails.title,
      dur: Number(data.videoDetails.lengthSeconds),
      viewCount: data.videoDetails.viewCount,
      likes: data.videoDetails.likes,
      author: data.videoDetails.author.name,
      timestart: Date.now()
    };

    return new Promise((resolve, reject) => {
      ytdl(link, { filter: format => format.itag === itag })
        .pipe(fs.createWriteStream(filePath))
        .on('finish', () => {
          resolve({
            data: filePath,
            info: result
          });
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  } catch (e) {
    console.error('Lỗi khi tải nhạc từ YouTube:', e.message);
    throw e;
  }
};

const updateHistory = (userID, record) => {
  try {
    const historyData = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    if (!historyData[userID]) {
      historyData[userID] = [];
    }

    const linkExists = historyData[userID].some(item => item.link === record.link);
    if (!linkExists) {
      historyData[userID].push(record);
    }

    if (historyData[userID].length > 15) {
      historyData[userID].shift(); 
    }
    fs.writeFileSync(historyPath, JSON.stringify(historyData, null, 2), 'utf8');
  } catch (error) {
    console.error('Lỗi khi cập nhật lịch sử:', error);
  }
};

const handleReply = async ({ api, event, handleReply }) => {
  try {
    const selectedIndex = parseInt(event.body) - 1; 
    const filePath = path.resolve(__dirname, 'cache', `audio-${event.senderID}.mp3`);
    const selectedLink = handleReply.link[selectedIndex];
    if (!selectedLink) {
      return api.sendMessage('⚠️ Lựa chọn không hợp lệ.', event.threadID, event.messageID);
    }

    const downloadResult = await downloadMusicFromYoutube(selectedLink, filePath, ITAG);

    if (!downloadResult || !downloadResult.data) {
      console.error('Lỗi: Data không xác định');
      return;
    }

    const { data, info } = downloadResult;

    if (fs.statSync(data).size > 26214400) {
      return api.sendMessage('⚠️Không thể gửi tệp vì kích thước lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    }

    api.unsendMessage(handleReply.messageID);

    const message = {
      body: `❍━━━━━━━━━━━━❍\n🎵 Tiêu đề: ${info.title}\n⏱️ Thời lượng: ${convertHMS(info.dur)}\n⏱️ Thời gian xử lý: ${Math.floor((Date.now() - info.timestart) / 1000)} giây\n❍━━━━━━━━━━━━❍`,
      attachment: fs.createReadStream(data),
    };

    updateHistory(event.senderID, {
      type: 'download',
      title: info.title,
      link: selectedLink,
      timestamp: Date.now()
    });

    return api.sendMessage(message, event.threadID, async () => {
      fs.unlinkSync(filePath);
    }, event.messageID);
  } catch (error) {
    console.log('Lỗi khi xử lý phản hồi:', error);
    api.sendMessage('⚠️Đã xảy ra lỗi khi gửi tin nhắn.', event.threadID, event.messageID);
  }
};

const suggestMusic = async (userID) => {
  try {
    const historyData = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    const userHistory = historyData[userID] || [];

    if (userHistory.length > 0) {
      const userLinks = new Set(userHistory.map(record => record.link));
      const allHistories = Object.values(historyData).flat();
      const uniqueHistories = allHistories.filter(record => !userLinks.has(record.link));
      
      const randomSongs = uniqueHistories
        .sort(() => 0.5 - Math.random())
        .slice(0, 5) 
        .map((record, index) => ({
          index: index + 1,
          title: record.title,
          link: record.link
        }));

      if (randomSongs.length === 0) {
        return [];
      }

      return randomSongs;
    } else {
      const allHistories = Object.values(historyData).flat();
      const randomSongs = allHistories
        .sort(() => 0.5 - Math.random())
        .slice(0, 5) 
        .map((record, index) => ({
          index: index + 1,
          title: record.title,
          link: record.link
        }));

      if (randomSongs.length === 0) {
        return [];
      }

      return randomSongs;
    }
  } catch (e) {
    console.log('Lỗi khi đề xuất nhạc:', e);
    return [];
  }
};

const run = async function({ api, event, args }) {
  if (args.length === 0) {
    try {
      const suggestions = await suggestMusic(event.senderID);

      if (suggestions.length === 0) {
        return api.sendMessage('❯ Không có bản nhạc nào để đề xuất.', event.threadID, event.messageID);
      }

      const body = `Có ${suggestions.length} bản nhạc đề xuất cho bạn:\n\n${suggestions.map(({ index, title }) => `❍ ${index}. ${title}`).join('\n')}\n\n❯ Vui lòng trả lời với số thứ tự để chọn bản nhạc.`;

      return api.sendMessage(body, event.threadID, (error, info) => {
        global.client.handleReply.push({
          type: 'reply',
          name: config.name,
          messageID: info.messageID,
          author: event.senderID,
          link: suggestions.map(s => s.link)
        });
      }, event.messageID);
    } catch (e) {
      console.log('Lỗi khi đề xuất nhạc:', e);
      return api.sendMessage('⚠️Đã xảy ra lỗi khi đề xuất nhạc.', event.threadID, event.messageID);
    }
  }

  if (args[0]?.startsWith("https://")) {
    const filePath = path.resolve(__dirname, 'cache', `sing-${event.senderID}.mp3`);
    try {
      const { data, info } = await downloadMusicFromYoutube(args[0], filePath);
      const body = `❍━━━━━━━━━━━━❍\n🎵 Tiêu đề: ${info.title}\n⏱️ Thời lượng: ${convertHMS(info.dur)}\n⏱️ Thời gian xử lý: ${Math.floor((Date.now() - info.timestart) / 1000)} giây\n❍━━━━━━━━━━━━❍`;

      if (fs.statSync(data).size > 26214400) {
        return api.sendMessage('⚠️Không thể gửi tệp vì kích thước lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(data), event.messageID);
      }

      updateHistory(event.senderID, {
        type: 'download',
        title: info.title,
        link: args[0],
        timestamp: Date.now()
      });

      return api.sendMessage({ body, attachment: fs.createReadStream(data) }, event.threadID, () => fs.unlinkSync(data), event.messageID);
    } catch (e) {
      console.log('Lỗi khi tải nhạc từ YouTube:', e);
      api.sendMessage('⚠️Đã xảy ra lỗi khi tải nhạc.', event.threadID, event.messageID);
    }
  } else if (args[0]?.toLowerCase() === "history") {
    try {
      const historyData = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
      const userHistory = historyData[event.senderID] || [];

      if (userHistory.length === 0) {
        return api.sendMessage('❯ Bạn chưa có lịch sử nhạc.', event.threadID, event.messageID);
      }

      const historyMessages = userHistory.map((record, index) => {
        return `❍━━━━━━━━━━━━❍\n${index + 1} - ${record.type === 'download' ? 'Tải nhạc' : 'Tìm kiếm'}\n🎵 Tiêu đề: ${record.title}\n📅 Ngày: ${new Date(record.timestamp).toLocaleString()}\n🔗 Liên kết: ${record.link}\n\n`;
      }).join('');

      return api.sendMessage(`Lịch sử nhạc của bạn:\n\n${historyMessages}`, event.threadID, event.messageID);
    } catch (e) {
      console.log('Lỗi khi đọc lịch sử:', e);
      api.sendMessage('⚠️Đã xảy ra lỗi khi đọc lịch sử.', event.threadID, event.messageID);
    }
  } else if (args[0]?.toLowerCase() === "suggest") {
    try {
      const suggestions = await suggestMusic(event.senderID);

      if (suggestions.length === 0) {
        return api.sendMessage('❯ Không có bản nhạc nào để đề xuất.', event.threadID, event.messageID);
      }

      const body = `Có ${suggestions.length} bản nhạc đề xuất cho bạn:\n\n${suggestions.map(({ index, title }) => `❍ ${index}. ${title}`).join('\n')}\n\n❯ Vui lòng trả lời với số thứ tự để chọn bản nhạc.`;

      return api.sendMessage(body, event.threadID, (error, info) => {
        global.client.handleReply.push({
          type: 'reply',
          name: config.name,
          messageID: info.messageID,
          author: event.senderID,
          link: suggestions.map(s => s.link)
        });
      }, event.messageID);
    } catch (e) {
      console.log('Lỗi khi đề xuất nhạc:', e);
      return api.sendMessage('⚠️Đã xảy ra lỗi khi đề xuất nhạc.', event.threadID, event.messageID);
    }
  } else {
    const keywordSearch = args.join(" ");
    const filePath = path.resolve(__dirname, 'cache', `sing-${event.senderID}.mp3`);
    
    try {
      const searchResults = await Youtube.GetListByKeyword(keywordSearch, false, 6);
      if (!searchResults || !searchResults.items) {
        throw new Error('Không có kết quả tìm kiếm');
      }
      const data = searchResults.items;
      const link = data.map(value => `https://www.youtube.com/watch?v=${value.id}`);
      const thumbnails = [];

      for (let i = 0; i < data.length; i++) {
        const videoId = data[i]?.id;
        if (!videoId) {
          console.error(`ID video không tồn tại cho mục ${i}`);
          continue;
        }

        const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        const thumbnailPath = path.resolve(__dirname, 'cache', `thumbnail-${event.senderID}-${i + 1}.jpg`);
        try {
          const response = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
          fs.writeFileSync(thumbnailPath, Buffer.from(response.data, 'binary'));
          thumbnails.push(fs.createReadStream(thumbnailPath));
        } catch (err) {
          console.error(`Lỗi khi tải ảnh thu nhỏ từ ${thumbnailUrl}:`, err);
        }
      }

      const body = `Có ${link.length} kết quả phù hợp với từ khóa tìm kiếm của bạn:\n\n${data.map((value, index) => `❍━━━━━━━━━━━━❍\n${index + 1} - ${value?.title} (${value?.length?.simpleText})\n\n`).join('')}❯ Vui lòng trả lời để chọn một trong những kết quả tìm kiếm trên`;

      return api.sendMessage({ attachment: thumbnails, body }, event.threadID, (error, info) => {
        for (let i = 0; i < thumbnails.length; i++) {
          fs.unlinkSync(path.resolve(__dirname, 'cache', `thumbnail-${event.senderID}-${i + 1}.jpg`));
        }

        global.client.handleReply.push({
          type: 'reply',
          name: config.name,
          messageID: info.messageID,
          author: event.senderID,
          link
        });
      }, event.messageID);
    } catch (e) {
      console.log('Lỗi khi tìm kiếm video:', e);
      return api.sendMessage(`⚠️Đã xảy ra lỗi, vui lòng thử lại sau!!\n${e.message}`, event.threadID, event.messageID);
    }
  }
};

module.exports = { config, run, handleReply };
