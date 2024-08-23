const axios = require('axios');

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

async function fetchRandomWikiArticle() {
  const apiUrl = `https://vi.wikipedia.org/api/rest_v1/page/random/summary`;
  try {
    const response = await axios.get(apiUrl);
    const wikiData = response.data;
    if (wikiData.title && wikiData.extract) {
      return {
        title: wikiData.title,
        extract: wikiData.extract,
        url: wikiData.content_urls.desktop.page
      };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Không thể truy xuất thông tin từ Wikipedia vào lúc này. Vui lòng thử lại sau.");
  }
}

module.exports.run = async function({ api, event, args }) {
  const searchTerm = args.join(" ");
  
  if (!searchTerm) {

    try {
      const randomWikiArticle = await fetchRandomWikiArticle();
      if (randomWikiArticle) {
        const message = `📚 Wikipedia: ${randomWikiArticle.title}\n\n${randomWikiArticle.extract}\n\nĐọc thêm: ${randomWikiArticle.url}\n\nBạn có thể tìm thêm thông tin bằng cách nhập wiki 'từ khóa'.`;
        api.sendMessage(message, event.threadID);
      } else {
        api.sendMessage("Không thể tìm thấy thông tin ngẫu nhiên từ Wikipedia vào lúc này.", event.threadID);
      }
    } catch (error) {
      api.sendMessage(error.message, event.threadID);
    }
  } else {

    const apiUrl = `https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
    try {
      const response = await axios.get(apiUrl);
      const wikiData = response.data;
      if (wikiData.title && wikiData.extract) {
        const message = `📚 Wikipedia: ${wikiData.title}\n\n${wikiData.extract}\n\nĐọc thêm: ${wikiData.content_urls.desktop.page}`;
        api.sendMessage(message, event.threadID);
      } else {
        api.sendMessage("Không tìm thấy thông tin từ khóa này trên Wikipedia.", event.threadID);
      }
    } catch (error) {
      api.sendMessage("Không thể truy xuất thông tin từ Wikipedia vào lúc này. Vui lòng thử lại sau.", event.threadID);
    }
  }
};
