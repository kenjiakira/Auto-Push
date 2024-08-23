module.exports.config = {
  name: "ghep", 
  version: "1.0.2",
  hasPermission: 0,
  credits: "HNT",
  description: "Xem mức độ hợp đôi giữa 2 người",
  commandCategory: "Mini Game",
  usePrefix: true,
  usages: "gõ ghep [tag] người cần xem",
  cooldowns: 0,
  dependencies: {
      "fs-extra": "",
      "axios": ""
  }
}

const cooldownTime = 20 * 1000; 
const botUID = "100054035411784"; 

if (typeof global.cooldowns === 'undefined') {
  global.cooldowns = {};
}

module.exports.run = async function({ api, args, Users, event, Currencies }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  const senderID = event.senderID;
  const mention = Object.keys(event.mentions)[0];

  if (!mention) {
    return api.sendMessage("Bạn cần tag một người để xem tỷ lệ hợp đôi.", event.threadID);
  }

  if (mention === botUID) {
    return api.sendMessage("Bạn không thể ghép đôi với bot.", event.threadID);
  }

  const now = Date.now();
  const cooldownKey = `ghep_${senderID}`;
  const lastUsage = global.cooldowns[cooldownKey] || 0;

  if (now - lastUsage < cooldownTime) {
    const timeRemaining = Math.ceil((cooldownTime - (now - lastUsage)) / 1000);
    return api.sendMessage(`Vui lòng đợi thêm ${timeRemaining} giây trước khi thử lại.`, event.threadID);
  }

  try {
    const user1 = await Users.getData(senderID);
    const user2 = await Users.getData(mention);

    if (!user1 || !user2) {
      return api.sendMessage("Không thể lấy thông tin người dùng. Vui lòng thử lại sau.", event.threadID);
    }

    const name1 = user1.name;
    const name2 = user2.name;

    const tile = Math.floor(Math.random() * 101);
    const arraytag = [
      { id: mention, tag: name2 },
      { id: senderID, tag: name1 }
    ];

    const avatarUrl1 = `https://graph.facebook.com/${mention}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarUrl2 = `https://graph.facebook.com/${senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const avatar1 = (await axios.get(avatarUrl1, { responseType: "arraybuffer" })).data; 
   const avatar2 = (await axios.get(avatarUrl2, { responseType: "arraybuffer" })).data;

   fs.writeFileSync(__dirname + "/cache/ghep/avt.png", Buffer.from(avatar1));
 fs.writeFileSync(__dirname + "/cache/ghep/avt2.png", Buffer.from(avatar2)); 

   const imglove = [
     fs.createReadStream(__dirname + "/cache/ghep/avt2.png"),
      fs.createReadStream(__dirname + "/cache/ghep/avt.png")
    ];
    
    const msg = {
      body: `⚡️Tỷ lệ hợp đôi giữa hai bạn⚡️\n💟 ${name1} 💗 ${name2} 💟\n💘 Khoảng là ${tile}% 💘`,
      mentions: arraytag,
     attachment: imglove
    };

    await api.sendMessage(msg, event.threadID, event.messageID);


    global.cooldowns[cooldownKey] = Date.now();

  } catch (err) {
    console.error(err);
    return api.sendMessage("Có lỗi xảy ra trong quá trình gửi thông báo. Vui lòng thử lại sau.", event.threadID, event.messageID);
 } finally {
  try {
      fs.unlinkSync(__dirname + "/cache/ghep/avt.png");
      fs.unlinkSync(__dirname + "/cache/ghep/avt2.png");
  } catch (err) {
 console.error("Không thể xóa các tệp ảnh:", err);
    }
 }
};
