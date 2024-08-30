module.exports = function({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require('string-similarity');
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const logger = require("../../utils/log.js");
  const axios = require('axios');
  const moment = require("moment-timezone");

  return async function({ event }) {
    const dateNow = Date.now();
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:MM:ss DD/MM/YYYY");
    const { allowInbox, PREFIX, ADMINBOT, DeveloperMode, adminOnly, keyAdminOnly } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;
    const { body, senderID, threadID, messageID } = event;
    
    const senderIDStr = String(senderID);
    const threadIDStr = String(threadID);
    const threadSetting = threadData.get(threadIDStr) || {};
    const args = (body || '').trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    let command = commands.get(commandName);
    const replyAD = '[ MODE ] - Đang Bảo Trì.... thông cảm';

    // Kiểm tra lệnh và quyền admin
    if (command && command.config && command.config.name.toLowerCase() === commandName.toLowerCase()) {
      if (!ADMINBOT.includes(senderIDStr) && adminOnly && senderIDStr !== api.getCurrentUserID()) {
        return api.sendMessage(replyAD, threadIDStr, messageID);
      }
    }

    // Kiểm tra tiền tố lệnh
    if (typeof body === 'string' && body.startsWith(PREFIX) && !ADMINBOT.includes(senderIDStr) && adminOnly && senderIDStr !== api.getCurrentUserID()) {
      return api.sendMessage(replyAD, threadIDStr, messageID);
    }

    // Kiểm tra người dùng và nhóm bị cấm
    if (userBanned.has(senderIDStr) || threadBanned.has(threadIDStr) || (allowInbox && senderIDStr === threadIDStr)) {
      if (!ADMINBOT.includes(senderIDStr)) {
        if (userBanned.has(senderIDStr)) {
          const { reason, dateAdded } = userBanned.get(senderIDStr) || {};
          return api.sendMessage(global.getText("handleCommand", "userBanned", reason, dateAdded), threadIDStr, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
            return api.unsendMessage(info.messageID);
          }, messageID);
        } else if (threadBanned.has(threadIDStr)) {
          const { reason, dateAdded } = threadBanned.get(threadIDStr) || {};
          return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadIDStr, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
            return api.unsendMessage(info.messageID);
          }, messageID);
        }
      }
    }

    // Xử lý lệnh không tồn tại
    if (commandName.startsWith(PREFIX)) {
      if (!command) {
        const allCommandNames = Array.from(commands.keys());
        const checker = stringSimilarity.findBestMatch(commandName, allCommandNames);
        if (checker.bestMatch.rating >= 0.5) {
          command = commands.get(checker.bestMatch.target);
        } else {
          return api.sendMessage(global.getText("handleCommand", "commandNotExist", checker.bestMatch.target), threadIDStr);
        }
      }
    }

    // Xử lý lệnh bị cấm
    if (command && command.config) {
      if (commandBanned.get(threadIDStr) || commandBanned.get(senderIDStr)) {
        if (!ADMINBOT.includes(senderIDStr)) {
          const banThreads = commandBanned.get(threadIDStr) || [];
          const banUsers = commandBanned.get(senderIDStr) || [];
          if (banThreads.includes(command.config.name)) {
            return api.sendMessage(global.getText("handleCommand", "commandThreadBanned", command.config.name), threadIDStr, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
          }
          if (banUsers.includes(command.config.name)) {
            return api.sendMessage(global.getText("handleCommand", "commandUserBanned", command.config.name), threadIDStr, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
          }
        }
      }
    }

    // Kiểm tra tiền tố và quyền sử dụng lệnh
    if (command && command.config) {
      if (command.config.usePrefix === false && commandName.toLowerCase() !== command.config.name.toLowerCase()) {
        api.sendMessage(global.getText("handleCommand", "notMatched", command.config.name), threadIDStr, messageID);
        return;
      }
      if (command.config.usePrefix === true && !body.startsWith(PREFIX)) {
        return;
      }
    } else if (command) {
      api.sendMessage(global.getText("handleCommand", "noPrefix", command.config.name), threadIDStr, messageID);
      return;
    }

    // Kiểm tra lệnh NSFW
    if (command && command.config && command.config.commandCategory && command.config.commandCategory.toLowerCase() === 'nsfw' && !global.data.threadAllowNSFW.includes(threadIDStr) && !ADMINBOT.includes(senderIDStr)) {
      return api.sendMessage(global.getText("handleCommand", "threadNotAllowNSFW"), threadIDStr, async (err, info) => {
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        return api.unsendMessage(info.messageID);
      }, messageID);
    }

    // Kiểm tra quyền hạn
    let permssion = 0;
    try {
      const threadInfo2 = threadInfo.get(threadIDStr) || await Threads.getInfo(threadIDStr);
      if (Object.keys(threadInfo2).length === 0) throw new Error();
      const find = threadInfo2.adminIDs.find(el => el.id === senderIDStr);
      if (ADMINBOT.includes(senderIDStr)) permssion = 2;
      else if (find) permssion = 1;
    } catch (err) {
      logger(global.getText("handleCommand", "cantGetInfoThread", "error"));
    }

    if (command && command.config && command.config.hasPermission && command.config.hasPermission > permssion) {
      return api.sendMessage(
        global.getText("handleCommand", "permissionNotEnough", command.config.name) || "Quyền hạn không đủ để sử dụng lệnh này.",
        threadIDStr,
        messageID
      );
    }

    // Xử lý cooldown
    if (command && command.config) {
      if (!client.cooldowns.has(command.config.name)) {
        client.cooldowns.set(command.config.name, new Map());
      }
      const timestamps = client.cooldowns.get(command.config.name);
      const expirationTime = (command.config.cooldowns || 1) * 1000;
      if (timestamps.has(senderIDStr) && dateNow < timestamps.get(senderIDStr) + expirationTime) {
        return api.setMessageReaction('⏳', messageID, err => (err) ? logger('An error occurred while executing setMessageReaction', 2) : '', true);
      }
      timestamps.set(senderIDStr, dateNow);
    }

    // Xử lý lệnh
    let getText2;
    if (command && command.languages && typeof command.languages === 'object' && command.languages.hasOwnProperty(global.config.language)) {
      getText2 = (...values) => {
        let lang = command.languages[global.config.language][values[0]] || '';
        for (let i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    } else {
      getText2 = () => { };
    }

    try {
      const Obj = {
        api: api,
        event: event,
        args: args,
        models: models,
        Users: Users,
        Threads: Threads,
        Currencies: Currencies,
        permssion: permssion,
        getText: getText2
      };

      if (command && typeof command.run === 'function') {
        command.run(Obj);

        if (DeveloperMode) {
          logger(global.getText("handleCommand", "executeCommand", time, commandName, senderIDStr, threadIDStr, args.join(" "), (Date.now()) - dateNow), "DEV MODE");
        }

        return;
      }
    } catch (e) {
      return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadIDStr);
    }
  };
};
