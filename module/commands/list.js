const fs = require('fs');
const path = require('path');
const groupsPath = path.join(__dirname, '../../module/commands/noti/groups.json');

function readGroupsData() {
  if (!fs.existsSync(groupsPath)) {
    fs.writeFileSync(groupsPath, JSON.stringify([]), 'utf8');
  }
  const rawData = fs.readFileSync(groupsPath);
  return JSON.parse(rawData);
}

module.exports.config = {
  name: "list",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Hoàng Ngọc Từ",
  description: "Hiển thị danh sách các nhóm và cho phép người dùng tham gia nhóm bằng số thứ tự.",
  commandCategory: "Công Cụ",
  usePrefix: true,
  usages: "[list]",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.handleReply = async ({ event, api, handleReply, Threads }) => {
  const { threadID, messageID, body, senderID } = event;
  const permission = ["61561753304881","61563982612558"]; // Thay đổi ID 
  if (!permission.includes(senderID))
    return api.sendMessage(`Chưa đủ quyền sử dụng lệnh này.`, threadID, messageID);

  const { threadList, author } = handleReply;
  if (senderID != author) return;

  api.unsendMessage(handleReply.messageID);

  if (!body || !parseInt(body)) 
    return api.sendMessage('Lựa chọn của bạn phải là một số.', threadID, messageID);

  const selectedIndex = parseInt(body) - 1;
  if (!threadList[selectedIndex]) 
    return api.sendMessage("Lựa chọn của bạn không nằm trong danh sách.", threadID, messageID);

  try {
    const threadInfo = threadList[selectedIndex];
    const { participantIDs } = threadInfo;
    if (participantIDs.includes(senderID)) 
      return api.sendMessage('Bạn đã có mặt trong nhóm này.', threadID, messageID);

    api.addUserToGroup(senderID, threadInfo.threadID, (e) => {
      if (e) 
        api.sendMessage(`Đã xảy ra lỗi: ${e.errorDescription}`, threadID, messageID);
      else 
        api.sendMessage(`Bot đã thêm bạn vào nhóm ${threadInfo.name}. Kiểm tra ở mục spam hoặc tin nhắn chờ nếu không thấy nhóm.` , threadID, messageID);
    });
  } catch (error) {
    return api.sendMessage(`Đã xảy ra lỗi: ${error}`, threadID, messageID);
  }
};

module.exports.run = async function({ api, event, Threads }) {
  const { threadID, messageID, senderID } = event;

  const allThreads = (await api.getThreadList(500, null, ["INBOX"])).filter(i => i.isGroup);
  let msg = `Danh sách tất cả các nhóm bạn có thể tham gia:\n──────────────────\n`;
  let number = 0;
  
  for (const thread of allThreads) {
    number++;
    msg += `${number}. ${thread.name}\n`;
  }
  
  msg += `\n→ Reply tin nhắn này kèm số tương ứng với nhóm mà bạn muốn vào.`;
  
  return api.sendMessage(msg, threadID, (error, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: senderID,
      threadList: allThreads
    });
  }, messageID);
};
