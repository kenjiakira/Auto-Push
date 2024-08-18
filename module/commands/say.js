const stringSimilarity = require('string-similarity');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "say",
  version: "1.1.2",
  hasPermission: 0,
  credits: "Yan Maglinte",
  description: "Chuyển văn bản thành giọng nói",
  usePrefix: true,
  commandCategory: "message",
  usages: "[ngôn ngữ] [văn bản]",
  cooldowns: 5,
  dependencies: {
    "path": "",
    "fs-extra": "",
    "string-similarity": ""
  }
};

const supportedLanguages = [
  "en", "ru", "ko", "ja", "tl", "fr", "es", "de", "it", "pt", "ar", "zh-CN", "hi", "th", "vi",
  "pl", "tr", "cs", "da", "nl", "sv", "fi", "no", "hu", "ro", "sk", "sr", "bg", "el", "he"
];

const languageNames = {
  "en": "English",
  "ru": "Russian",
  "ko": "Korean",
  "ja": "Japanese",
  "tl": "Tagalog",
  "fr": "French",
  "es": "Spanish",
  "de": "German",
  "it": "Italian",
  "pt": "Portuguese",
  "ar": "Arabic",
  "zh-CN": "Chinese (Simplified)",
  "hi": "Hindi",
  "th": "Thai",
  "vi": "Vietnamese",
  "pl": "Polish",
  "tr": "Turkish",
  "cs": "Czech",
  "da": "Danish",
  "nl": "Dutch",
  "sv": "Swedish",
  "fi": "Finnish",
  "no": "Norwegian",
  "hu": "Hungarian",
  "ro": "Romanian",
  "sk": "Slovak",
  "sr": "Serbian",
  "bg": "Bulgarian",
  "el": "Greek",
  "he": "Hebrew"
};

module.exports.run = async function({ api, event, args }) {
  try {
    const { createReadStream, unlinkSync, stat } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];

    if (args.length === 0) {
      let languageList = "Danh sách ngôn ngữ hỗ trợ:\n";
      for (const [code, name] of Object.entries(languageNames)) {
        languageList += `- ${code}: ${name}\n`;
      }
      languageList += "\nSử dụng: [ngôn ngữ] [văn bản]\nVí dụ: !say en Hello, how are you?\nmặc định là tiếng việt , chỉ cần gõ say và văn bản.";
      return api.sendMessage(languageList, event.threadID, event.messageID);
    }

    const content = (event.type == "message_reply") ? event.messageReply.body : args.slice(1).join(" ");
    let languageToSay = supportedLanguages.find(lang => args[0].startsWith(lang)) || global.config.language;
    let msg = (languageToSay !== global.config.language) ? content : content;

    if (!supportedLanguages.includes(languageToSay)) {
      return api.sendMessage(`Ngôn ngữ không hợp lệ. Vui lòng sử dụng một trong các mã ngôn ngữ sau:\n${supportedLanguages.join(', ')}`, event.threadID, event.messageID);
    }

    const bannedWordsPath = resolve(__dirname, '../../module/commands/json/banned_words.json');
    const bannedWords = require(bannedWordsPath).bannedWords;

    const similarityThreshold = 0.4;
    const containsBannedWords = bannedWords.some(word => {
      return stringSimilarity.compareTwoStrings(msg.toLowerCase(), word.toLowerCase()) >= similarityThreshold;
    });

    if (containsBannedWords) {
      return api.sendMessage("⚠️ Nội dung chứa từ cấm. Vui lòng sửa đổi nội dung!", event.threadID, event.messageID);
    }

    if (!msg) {
      return api.sendMessage("Vui lòng nhập văn bản cần chuyển thành giọng nói!", event.threadID, event.messageID);
    }

    if (msg.length > 100) {
      return api.sendMessage("⚠️ Văn bản không được vượt quá 100 ký tự. Vui lòng nhập lại.", event.threadID, event.messageID);
    }

    const path = resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);
    await global.utils.downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`, path);

    const stats = await stat(path);
    const fileSizeInBytes = stats.size;
    const maxSizeBytes = 80 * 1024 * 1024;

    if (fileSizeInBytes > maxSizeBytes) {
      unlinkSync(path);
      return api.sendMessage('⚠️ Không thể gửi tệp vì kích thước lớn hơn 80MB.', event.threadID, event.messageID);
    }

    return api.sendMessage({ attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path), event.messageID);
  } catch (error) {
    console.log(error);
    return api.sendMessage("Đã xảy ra lỗi khi thực hiện chuyển văn bản thành giọng nói.", event.threadID, event.messageID);
  }
};
