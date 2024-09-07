const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');

const cacheDir = path.resolve(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
    fs.mkdirsSync(cacheDir);
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.config = {
  name: "wiki",
  version: "1.1.0",
  hasPermission: 0,
  credits: "HNT",
  description: "Tra cứu thông tin từ Wikipedia.",
  usePrefix: true,
  commandCategory: "utilities",
  usages: "wiki [từ khóa]",
  cooldowns: 5,
  dependencies: {}
};

async function fetchRandomWikiArticle(retries = 3) {
  const apiUrl = `https://vi.wikipedia.org/api/rest_v1/page/random/summary`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(apiUrl);
      const wikiData = response.data;
      if (wikiData.title && wikiData.extract) {
        const imageUrl = wikiData.thumbnail ? wikiData.thumbnail.source : null;
        return {
          title: wikiData.title,
          extract: wikiData.extract,
          url: wikiData.content_urls.desktop.page,
          image: imageUrl
        };
      } else {
        return null;
      }
    } catch (error) {
      if (attempt === retries) {
        throw new Error("Không thể truy xuất thông tin từ Wikipedia vào lúc này. Vui lòng thử lại sau.");
      }
      console.error(`Lỗi khi truy xuất thông tin: ${error.message}. Thử lại lần ${attempt}`);
      await delay(2000); // Chờ 2 giây trước khi thử lại
    }
  }
}

async function downloadImage(url, outputPath) {
  try {
    await image({ url, dest: outputPath });
    console.log(`Tải ảnh thành công từ ${url}`);
  } catch (error) {
    console.error(`Lỗi khi tải ảnh từ ${url}: ${error.message}`);
    throw new Error(`Không thể tải hình ảnh từ ${url}.`);
  }
}

module.exports.run = async function({ api, event, args }) {
  const searchTerm = args.join(" ");
  const outputPath = path.resolve(cacheDir, 'wiki_image.jpg');

  try {
    if (!searchTerm) {
      // Lấy bài viết ngẫu nhiên
      const randomWikiArticle = await fetchRandomWikiArticle();
      if (randomWikiArticle) {
        let attachments = [];
        if (randomWikiArticle.image) {
          await downloadImage(randomWikiArticle.image, outputPath);
          attachments.push(fs.createReadStream(outputPath));
        }
        const message = `📚 Wikipedia: ${randomWikiArticle.title}\n\n${randomWikiArticle.extract}\n\nĐọc thêm: ${randomWikiArticle.url}\n\nBạn có thể tìm thêm thông tin bằng cách nhập wiki 'từ khóa'.`;
        api.sendMessage({ body: message, attachment: attachments }, event.threadID, () => {
          // Xóa ảnh sau khi gửi
          try {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
          } catch (unlinkError) {
            console.error(`Không thể xóa tệp ${outputPath}: ${unlinkError.message}`);
          }
        });
      } else {
        api.sendMessage("Không thể tìm thấy thông tin ngẫu nhiên từ Wikipedia vào lúc này.", event.threadID);
      }
    } else {
      // Tìm kiếm thông tin theo từ khóa
      const apiUrl = `https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await axios.get(apiUrl);
          const wikiData = response.data;
          if (wikiData.title && wikiData.extract) {
            const imageUrl = wikiData.thumbnail ? wikiData.thumbnail.source : null;
            let attachments = [];
            if (imageUrl) {
              await downloadImage(imageUrl, outputPath);
              attachments.push(fs.createReadStream(outputPath));
            }
            const message = `📚 Wikipedia: ${wikiData.title}\n\n${wikiData.extract}\n\nĐọc thêm: ${wikiData.content_urls.desktop.page}`;
            api.sendMessage({ body: message, attachment: attachments }, event.threadID, () => {
              // Xóa ảnh sau khi gửi
              try {
                if (fs.existsSync(outputPath)) {
                  fs.unlinkSync(outputPath);
                }
              } catch (unlinkError) {
                console.error(`Không thể xóa tệp ${outputPath}: ${unlinkError.message}`);
              }
            });
            return;
          } else {
            api.sendMessage("Không tìm thấy thông tin từ khóa này trên Wikipedia.", event.threadID);
            return;
          }
        } catch (error) {
          if (attempt === 3) {
            api.sendMessage("Không thể truy xuất thông tin từ Wikipedia vào lúc này. Vui lòng thử lại sau.", event.threadID);
          } else {
            console.error(`Lỗi khi truy xuất thông tin: ${error.message}. Thử lại lần ${attempt}`);
            await delay(2000); // Chờ 2 giây trước khi thử lại
          }
        }
      }
    }
  } catch (error) {
    api.sendMessage(error.message, event.threadID);
  }
};
