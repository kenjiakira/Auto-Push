const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const sharp = require('sharp');

const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

const API_KEY = '81877a1e333d6976ef9eb75df402046be41681edc4456176555b0f28f5f49eb0cb3e46a5c8a96ed2255714e02bbe7cd7';

const checkPremium = (userId) => {
  const premiumData = JSON.parse(fs.readFileSync('module/commands/json/premium.json', 'utf8'));
  const user = premiumData[userId];
  return user && user.isPremium;
};

const getImageDimensions = async (imagePath) => {
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  return { width: metadata.width, height: metadata.height };
};

const upscaleImageSync = async (imagePath, targetWidth, targetHeight) => {
  const form = new FormData();
  form.append('image_file', fs.createReadStream(imagePath));
  form.append('target_width', targetWidth.toString());
  form.append('target_height', targetHeight.toString());

  try {
    const response = await axios.post('https://clipdrop-api.co/image-upscaling/v1/upscale', form, {
      headers: {
        ...form.getHeaders(),
        'x-api-key': API_KEY,
      },
      responseType: 'arraybuffer'
    });

    const contentType = response.headers['content-type'];
    if (contentType.includes('image')) {
      return response.data; 
    } else {
      console.error('API response is not an image:', response.data);
      throw new Error('API response is not an image.');
    }
  } catch (error) {
    console.error("Lỗi khi nâng cao ảnh:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const processImage = async (imagePath) => {
  const { width, height } = await getImageDimensions(imagePath);
  const outputFilePath = path.join(cacheDir, `upscaled_${Date.now()}.jpg`);
  try {
   
    const targetWidth = width * 2;  
    const targetHeight = height * 2;

    const imageData = await upscaleImageSync(imagePath, targetWidth, targetHeight);
    fs.writeFileSync(outputFilePath, imageData);
    return outputFilePath;
  } catch (error) {
    console.error("Lỗi khi lưu ảnh nâng cao:", error);
    throw error;
  }
};

module.exports = {
  config: {
    name: "netanh",
    version: "1.0.3",
    hasPermission: 0,
    credits: "HNT",
    description: "Làm nét ảnh với sự hỗ trợ của API nâng cao ảnh.",
    commandCategory: "image",
    usages: "[reply ảnh]",
    usePrefix: true,
    cooldowns: 5
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID, messageReply, senderID } = event;

    const isPremiumUser = checkPremium(senderID);

    if (!isPremiumUser) {
      return api.sendMessage("Bạn cần có Premium để sử dụng tính năng này.\nVui lòng liên hệ để mua quyền Premium.", threadID, messageID);
    }

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0 || messageReply.attachments[0].type !== 'photo') {
      return api.sendMessage("Vui lòng reply một ảnh để làm nét.", threadID, messageID);
    }

    try {
      await api.sendMessage("Chờ một chút trong khi chúng tôi làm nét ảnh của bạn...", threadID, async (error, info) => {
        if (error) {
          console.error("Lỗi khi gửi thông báo chờ:", error);
          return;
        }

        try {
          const imageUrl = messageReply.attachments[0].url;
          const imageFileName = `original_${Date.now()}.jpg`;
          const imagePath = path.join(cacheDir, imageFileName);

          const response = await axios({
            url: imageUrl,
            responseType: 'stream',
          });

          await new Promise((resolve, reject) => {
            response.data.pipe(fs.createWriteStream(imagePath))
              .on('finish', resolve)
              .on('error', reject);
          });

          const outputFilePath = await processImage(imagePath);

          const imageStream = fs.createReadStream(outputFilePath);
          api.sendMessage({
            body: "Ảnh đã được làm nét thành công!",
            attachment: imageStream,
          }, threadID, () => {
            fs.unlinkSync(imagePath);
            fs.unlinkSync(outputFilePath);
          }, messageID);

        } catch (error) {
          console.error("Lỗi khi làm nét ảnh:", error);
          return api.sendMessage("Đã xảy ra lỗi khi làm nét ảnh. Vui lòng thử lại sau.", threadID, messageID);
        }
      });
      
    } catch (error) {
      console.error("Lỗi khi gửi thông báo chờ:", error);
      return api.sendMessage("Đã xảy ra lỗi khi gửi thông báo chờ. Vui lòng thử lại sau.", threadID, messageID);
    }
  }
};
