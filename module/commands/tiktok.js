const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const FormData = require('form-data');

const ffmpegPath = 'D:\\ffmpeg\\bin\\ffmpeg.exe'; 
const cacheDir = path.join(__dirname, 'cache');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

const is_url = (url) => /^http(s)?:\/\//.test(url);

const stream_url = async (url, type) => {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    if (res.data) {
      const filePath = path.join(cacheDir, `${Date.now()}.${type}`);
      fs.writeFileSync(filePath, res.data);
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }, 1000 * 60);
      return filePath;
    } else {
      throw new Error('No data received from URL');
    }
  } catch (error) {
    console.error("Lỗi khi tải tệp từ URL:", error);
    throw new Error("Không thể tải tệp từ URL");
  }
};

const convertVideoToMp3 = (videoPath) => {
  return new Promise((resolve, reject) => {
    const mp3Path = videoPath.replace(/\.(mp4|avi|mov)$/, '.mp3');
    
    exec(`"${ffmpegPath}" -i "${videoPath}" -vn -ar 44100 -ac 2 -b:a 192k "${mp3Path}"`, (error) => {
      if (error) {
        console.error('Lỗi khi chuyển đổi video thành MP3:', error.message);
        reject(error);
      } else {
        console.log('Chuyển đổi video thành MP3 hoàn tất');
        resolve(mp3Path);
      }
    });
  });
};

const uploadToFileIo = async (filePath) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    const response = await axios.post('https://file.io', form, {
      headers: {
        ...form.getHeaders()
      },
    });

    if (response.data && response.data.link) {
      return response.data.link;
    } else {
      throw new Error('Không nhận được liên kết từ file.io');
    }
  } catch (error) {
    console.error('Lỗi khi tải tệp lên file.io:', error);
    throw new Error('Không thể tải tệp lên file.io');
  }
};

module.exports.config = {
  name: 'tiktok',
  version: '1.0.0',
  hasPermission: 0,
  credits: 'HNT',
  description: '🎥 Tải video hoặc chuyển thành nhạc MP3 từ TikTok',
  commandCategory: 'Giải trí',
  usages: 'tiktok [URL TikTok]',
  usePrefix: true,
  cooldowns: 5
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, body } = event;
  
  if (typeof body !== 'string') return;
  
  const url = body.trim();

  if (is_url(url) && /tiktok\.com/.test(url)) {
    try {
      const res = await axios.post('https://www.tikwm.com/api/', { url });

      if (res.data.code !== 0) {
        return api.sendMessage("⚠️ Không thể tải nội dung từ URL này.", threadID, messageID);
      }

      const tiktok = res.data.data;
      const videoPath = await stream_url(tiktok.play, 'mp4');

      const mp3Path = await convertVideoToMp3(videoPath);
      
      const downloadLink = await uploadToFileIo(mp3Path);

      api.sendMessage({
        body: `==[ TIKTOK ATDOWN ]==\n\n🎬 -Tiêu đề: ${tiktok.title}\n❤️ -Lượt thích: ${tiktok.digg_count}\n👤 -Tác giả: ${tiktok.author.nickname}\n🆔 -ID TikTok: ${tiktok.author.unique_id}\n\n🔗 -Link tải MP3: ${downloadLink}`,
        attachment: [fs.createReadStream(videoPath)] 
      }, threadID, async () => {
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath); 
        }
        if (fs.existsSync(mp3Path)) {
          fs.unlinkSync(mp3Path); 
        }
      }, messageID);

    } catch (error) {
      console.error("Lỗi trong quá trình xử lý:", error);
      return api.sendMessage("❌ Đã xảy ra lỗi khi xử lý yêu cầu của bạn.", threadID, messageID);
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const url = args.join(" ").trim();

  if (!url) {
    return api.sendMessage("⚠️ Vui lòng cung cấp URL TikTok.", threadID, messageID);
  }

  if (!is_url(url)) {
    return api.sendMessage("❌ Vui lòng cung cấp URL hợp lệ.", threadID, messageID);
  }

  if (/tiktok\.com/.test(url)) {
    api.sendMessage("⏳ Đang xử lý... Vui lòng đợi.", threadID, async () => {
      try {
        const res = await axios.post('https://www.tikwm.com/api/', { url });

        if (res.data.code !== 0) {
          return api.sendMessage("⚠️ Không thể tải nội dung từ URL này.", threadID, messageID);
        }

        const tiktok = res.data.data;
        const videoPath = await stream_url(tiktok.play, 'mp4');

        const mp3Path = await convertVideoToMp3(videoPath);
        
        const downloadLink = await uploadToFileIo(mp3Path);

        api.sendMessage({
          body: `==[ TIKTOK ATDOWN ]==\n\n🎬 -Tiêu đề: ${tiktok.title}\n❤️ -Lượt thích: ${tiktok.digg_count}\n👤 -Tác giả: ${tiktok.author.nickname}\n🆔 -ID TikTok: ${tiktok.author.unique_id}\n\n🔗 -Link tải MP3: ${downloadLink}`,
          attachment: [fs.createReadStream(videoPath)] 
        }, threadID, async () => {
          if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
          }
          if (fs.existsSync(mp3Path)) {
            fs.unlinkSync(mp3Path); 
          }
        }, messageID);

      } catch (error) {
        console.error("Lỗi trong quá trình xử lý:", error);
        return api.sendMessage("❌ Đã xảy ra lỗi khi xử lý yêu cầu của bạn.", threadID, messageID);
      }
    });
  } else {
    return api.sendMessage("⚠️ Vui lòng cung cấp URL TikTok hợp lệ.", threadID, messageID);
  }
};
