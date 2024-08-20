const path = require('path'); 
const { hasID } = require(path.join(__dirname, '..', '..', 'module', 'commands', 'cache', 'accessControl.js'));

module.exports.config = {
    name: "checkid",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Hoàng Ngọc Từ",
    description: "Kiểm tra xem người dùng có ID CCCD hay không.",
    commandCategory: "Social",
    usePrefix: true,
    usages: ".checkid [ID người dùng] - Kiểm tra xem người dùng có ID CCCD hay không.",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    const args = body.trim().split(' ').slice(1);
    let userID = event.senderID;
    if (args[0]) {
        userID = args[0].replace(/<@!/, '').replace(/>/, '');
    }

    if (await hasID(userID)) {
        return api.sendMessage("Người dùng này đã có ID CCCD.", threadID, messageID);
    } else {
        return api.sendMessage("Người dùng này chưa có ID CCCD.", threadID, messageID);
    }
};
