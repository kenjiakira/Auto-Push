const fs = require('fs-extra');
const path = require('path');
const lockfile = require('lockfile');

const dataFilePath = path.resolve(__dirname, 'json', 'khaosat.json');
const rewardFilePath = path.resolve(__dirname, 'json', 'rewardks.json');
const lockPath = dataFilePath + '.lock';

const surveyQuestionsPath = path.resolve(__dirname, 'json', 'surveyQuestions.json');

async function readSurveyQuestions() {
  try {
    const data = await fs.readJson(surveyQuestionsPath);
    return data.questions;
  } catch (err) {
    console.error("Lỗi khi đọc câu hỏi khảo sát:", err);
    return [];
  }
}

function readJsonFile() {
  return new Promise((resolve, reject) => {
    lockfile.lock(lockPath, { wait: 5000 }, (err) => {
      if (err) return reject(err);

      fs.readJson(dataFilePath, (err, data) => {
        lockfile.unlock(lockPath, () => {});
        if (err) return reject(err);
        resolve(data);
      });
    });
  });
}

function writeJsonFile(data) {
  return new Promise((resolve, reject) => {
    lockfile.lock(lockPath, { wait: 5000 }, (err) => {
      if (err) return reject(err);

      fs.writeJson(dataFilePath, data, { spaces: 2 }, (err) => {
        lockfile.unlock(lockPath, () => {});
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

const { hasID, isBanned } = require(path.join(__dirname, '..', '..', 'module', 'commands', 'cache', 'accessControl.js'));

module.exports.config = {
  name: "khaosat",
  version: "1.0.6",
  hasPermission: 0,
  credits: "HNT",
  description: "Khởi tạo khảo sát ý kiến người dùng",
  commandCategory: "utilities",
  usePrefix: true,
  usages: "khaosat start - Bắt đầu khảo sát",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args, Currencies }) => {
  const { threadID, messageID, senderID } = event;

  if (!(await hasID(senderID))) {
    return api.sendMessage("⚡ Bạn cần có ID để thực hiện khảo sát này!\nGõ .id để tạo ID", threadID, messageID);
  }

  if (await isBanned(senderID)) {
    return api.sendMessage("⚡ Bạn đã bị cấm và không thể thực hiện khảo sát này!", threadID, messageID);
  }

  let rewardsData = await fs.readJson(rewardFilePath, { default: {} });
  let userData = await readJsonFile();
  const surveyQuestions = await readSurveyQuestions();

  if (rewardsData[senderID]) {
    return api.sendMessage("Bạn đã hoàn tất khảo sát và nhận phần thưởng. Cảm ơn bạn!", threadID, messageID);
  }

  if (args[0] === "start") {
    try {
      if (!userData[senderID]) {
        userData[senderID] = {
          answers: Array(surveyQuestions.length).fill(null),
          startTime: Date.now(),
          agreed: false,
          currentQuestionID: null
        };
        await writeJsonFile(userData);

        // Gửi nội quy khảo sát
        const rulesMessage = "📋 **Nội Quy Khảo Sát** 📋\n\n" +
                             "1. Vui lòng trả lời tất cả các câu hỏi một cách nghiêm túc và chi tiết.\n" +
                             "2. Nếu bạn không thể trả lời một câu hỏi, hãy chọn 'Không biết' hoặc bỏ qua.\n" +
                             "3. Không chọn câu trả lời chỉ để qua loa để nhận phần thưởng.\n\n" +
                             "💬 Nhập 'Đồng ý' để tiếp tục khảo sát hoặc 'Hủy' để kết thúc.";
        return api.sendMessage(rulesMessage, threadID, async (error, info) => {
          if (error) {
            console.error("Lỗi khi gửi nội quy khảo sát:", error);
          }
          global.client.handleReply.push({
            type: "survey-agreement",
            name: this.config.name,
            author: senderID,
            messageID: info.messageID
          });
        });
      }

      api.sendMessage("Bạn đã hoàn tất khảo sát. Cảm ơn bạn!", threadID, messageID);
    } catch (error) {
      console.error("Lỗi khi xử lý khảo sát:", error);
      api.sendMessage("Đã xảy ra lỗi khi bắt đầu khảo sát. Vui lòng thử lại sau.", threadID, messageID);
    }
  } else {
    api.sendMessage("⚠️ Vui lòng sử dụng cú pháp: khaosat start để bắt đầu khảo sát.", threadID, messageID);
  }
};

module.exports.handleReply = async ({ event: e, api, handleReply, Currencies }) => {
  const { threadID, senderID } = e;

  try {
    let userData = await readJsonFile();
    let rewardsData = await fs.readJson(rewardFilePath, { default: {} });
    const surveyQuestions = await readSurveyQuestions();

    if (!userData[senderID]) {
      return api.sendMessage("Bạn không thể trả lời câu hỏi này vì chưa bắt đầu khảo sát.", threadID, e.messageID);
    }

    if (rewardsData[senderID]) {
      return api.sendMessage("Bạn đã hoàn tất khảo sát và nhận phần thưởng. Cảm ơn bạn!", threadID, e.messageID);
    }

    if (handleReply.type === "survey-agreement") {
      if (e.body.trim().toLowerCase() === "đồng ý") {
        userData[senderID].agreed = true;
        await writeJsonFile(userData);

        const questionIndex = userData[senderID].answers.indexOf(null);
        if (questionIndex !== -1) {
          const question = surveyQuestions[questionIndex];
          api.sendMessage(question, threadID, async (error, info) => {
            if (error) {
              console.error("Lỗi khi gửi câu hỏi khảo sát:", error);
            }
            userData[senderID].currentQuestionID = info.messageID;
            await writeJsonFile(userData);
            global.client.handleReply.push({
              type: "survey",
              name: this.config.name,
              author: senderID,
              questionIndex: questionIndex,
              messageID: info.messageID
            });
          });
        } else {
          api.sendMessage("Bạn đã hoàn tất khảo sát. Cảm ơn bạn!", threadID, e.messageID);
        }
      } else if (e.body.trim().toLowerCase() === "hủy") {
        delete userData[senderID];
        await writeJsonFile(userData);
        api.sendMessage("Khảo sát đã bị hủy.", threadID, e.messageID);
      } else {
        api.sendMessage("⚠️ Vui lòng nhập 'Đồng ý' để tiếp tục hoặc 'Hủy' để kết thúc.", threadID, e.messageID);
      }
      return;
    }

    if (!userData[senderID].agreed) {
      return api.sendMessage("Bạn cần đồng ý nội quy trước khi trả lời khảo sát.", threadID, e.messageID);
    }

    if (userData[senderID].answers[handleReply.questionIndex]?.reasonPending) {
      // Xử lý lý do
      if (e.messageReply && e.messageReply.messageID === userData[senderID].currentQuestionID) {
        const reason = e.body.trim();
        if (reason.length < 15) {
          return api.sendMessage("⚠️ Lý do phải có ít nhất 15 ký tự.", threadID, e.messageID);
        }

        // Xóa các ký tự không cần thiết
        const cleanedReason = reason.replace(/[^a-zA-Z0-9\s]/g, '');

        if (cleanedReason.length === 0) {
          return api.sendMessage("⚠️ Lý do phải có ít nhất 15 ký tự và không được chứa ký tự vô nghĩa.", threadID, e.messageID);
        }

        // Lưu lý do
        userData[senderID].answers[handleReply.questionIndex] = { rating: userData[senderID].answers[handleReply.questionIndex].rating, reason: cleanedReason };
        delete userData[senderID].answers[handleReply.questionIndex].reasonPending;
        userData[senderID].currentQuestionID = null;
        await writeJsonFile(userData);

        // Gửi câu hỏi tiếp theo nếu có
        const nextQuestionIndex = userData[senderID].answers.indexOf(null);
        if (nextQuestionIndex !== -1) {
          const nextQuestion = surveyQuestions[nextQuestionIndex];
          api.sendMessage(nextQuestion, threadID, async (error, info) => {
            if (error) {
              console.error("Lỗi khi gửi câu hỏi khảo sát:", error);
            }
            userData[senderID].currentQuestionID = info.messageID;
            await writeJsonFile(userData);
            global.client.handleReply.push({
              type: "survey",
              name: this.config.name,
              author: senderID,
              questionIndex: nextQuestionIndex,
              messageID: info.messageID
            });
          });
        } else {
          const startTime = userData[senderID].startTime;
          const endTime = Date.now();
          const duration = (endTime - startTime) / 1000;

          if (duration < 1) {
            delete userData[senderID];
            await writeJsonFile(userData);
            api.sendMessage("Khảo sát của bạn bị hủy vì thời gian hoàn tất quá nhanh. Vui lòng thử lại.", threadID, e.messageID);
          } else {
            await fs.writeJson(rewardFilePath, { ...rewardsData, [senderID]: true }, { spaces: 2 });
            await Currencies.increaseMoney(senderID, 50000);
            api.sendMessage("Bạn đã hoàn tất khảo sát và nhận được 50k xu. Cảm ơn bạn!", threadID, e.messageID);
          }
        }
      } else {
        return api.sendMessage("⚠️ Bạn đang trả lời sai câu hỏi hoặc không phải câu hỏi khảo sát hiện tại.", threadID, e.messageID);
      }
    } else {
      // Xử lý điểm số
      const rating = parseInt(e.body.trim(), 10);
      if (isNaN(rating) || rating < 1 || rating > 10) {
        return api.sendMessage("⚠️ Điểm số phải từ 1 đến 10.", threadID, e.messageID);
      }

      if (rating < 5) {
        // Yêu cầu lý do
        userData[senderID].answers[handleReply.questionIndex] = { rating, reasonPending: true };
        await writeJsonFile(userData);

        const reasonMessage = "📝 Vui lòng cung cấp lý do (ít nhất 15 ký tự) cho điểm số thấp này:";
        api.sendMessage(reasonMessage, threadID, async (error, info) => {
          if (error) {
            console.error("Lỗi khi gửi yêu cầu lý do:", error);
          }
          userData[senderID].currentQuestionID = info.messageID;
          await writeJsonFile(userData);
          global.client.handleReply.push({
            type: "reason",
            name: this.config.name,
            author: senderID,
            questionIndex: handleReply.questionIndex,
            messageID: info.messageID
          });
        });
      } else {
        // Lưu câu trả lời nếu điểm số từ 5 trở lên
        userData[senderID].answers[handleReply.questionIndex] = { rating };
        await writeJsonFile(userData);

        const nextQuestionIndex = userData[senderID].answers.indexOf(null);
        if (nextQuestionIndex !== -1) {
          const nextQuestion = surveyQuestions[nextQuestionIndex];
          api.sendMessage(nextQuestion, threadID, async (error, info) => {
            if (error) {
              console.error("Lỗi khi gửi câu hỏi khảo sát:", error);
            }
            userData[senderID].currentQuestionID = info.messageID;
            await writeJsonFile(userData);
            global.client.handleReply.push({
              type: "survey",
              name: this.config.name,
              author: senderID,
              questionIndex: nextQuestionIndex,
              messageID: info.messageID
            });
          });
        } else {
          const startTime = userData[senderID].startTime;
          const endTime = Date.now();
          const duration = (endTime - startTime) / 1000;

          if (duration < 1) {
            delete userData[senderID];
            await writeJsonFile(userData);
            api.sendMessage("Khảo sát của bạn bị hủy vì thời gian hoàn tất quá nhanh. Vui lòng thử lại.", threadID, e.messageID);
          } else {
            await fs.writeJson(rewardFilePath, { ...rewardsData, [senderID]: true }, { spaces: 2 });
            await Currencies.increaseMoney(senderID, 100000);
            api.sendMessage("Bạn đã hoàn tất khảo sát và nhận được 100k xu. Cảm ơn bạn!", threadID, e.messageID);
          }
        }
      }
    }
  } catch (error) {
    console.error("Lỗi khi xử lý phản hồi khảo sát:", error);
    api.sendMessage("Đã xảy ra lỗi khi xử lý phản hồi của bạn. Vui lòng thử lại sau.", threadID, e.messageID);
  }
};

// Xử lý lý do
module.exports.handleReason = async ({ event: e, api, handleReply }) => {
  const { threadID, senderID } = e;

  try {
    let userData = await readJsonFile();
    const surveyQuestions = await readSurveyQuestions();

    if (!userData[senderID]) {
      return api.sendMessage("Bạn không thể trả lời lý do này vì chưa bắt đầu khảo sát.", threadID, e.messageID);
    }

    if (e.messageReply && e.messageReply.messageID !== userData[senderID].currentQuestionID) {
      return api.sendMessage("⚠️ Bạn đang trả lời sai câu hỏi hoặc không phải câu hỏi khảo sát hiện tại.", threadID, e.messageID);
    }

    const reason = e.body.trim();
    if (reason.length < 15) {
      return api.sendMessage("⚠️ Lý do phải có ít nhất 15 ký tự.", threadID, e.messageID);
    }

    // Xóa các ký tự không cần thiết
    const cleanedReason = reason.replace(/[^a-zA-Z0-9\s]/g, '');

    if (cleanedReason.length === 0) {
      return api.sendMessage("⚠️ Lý do phải có ít nhất 15 ký tự và không được chứa ký tự vô nghĩa.", threadID, e.messageID);
    }

    // Lưu lý do
    userData[senderID].answers[handleReply.questionIndex] = { rating: userData[senderID].answers[handleReply.questionIndex].rating, reason: cleanedReason };
    delete userData[senderID].answers[handleReply.questionIndex].reasonPending;
    userData[senderID].currentQuestionID = null;
    await writeJsonFile(userData);

    // Gửi câu hỏi tiếp theo nếu có
    const nextQuestionIndex = userData[senderID].answers.indexOf(null);
    if (nextQuestionIndex !== -1) {
      const nextQuestion = surveyQuestions[nextQuestionIndex];
      api.sendMessage(nextQuestion, threadID, async (error, info) => {
        if (error) {
          console.error("Lỗi khi gửi câu hỏi khảo sát:", error);
        }
        userData[senderID].currentQuestionID = info.messageID;
        await writeJsonFile(userData);
        global.client.handleReply.push({
          type: "survey",
          name: this.config.name,
          author: senderID,
          questionIndex: nextQuestionIndex,
          messageID: info.messageID
        });
      });
    } else {
      const startTime = userData[senderID].startTime;
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      if (duration < 1) {
        delete userData[senderID];
        await writeJsonFile(userData);
        api.sendMessage("Khảo sát của bạn bị hủy vì thời gian hoàn tất quá nhanh. Vui lòng thử lại.", threadID, e.messageID);
      } else {
        await fs.writeJson(rewardFilePath, { ...rewardsData, [senderID]: true }, { spaces: 2 });
        await Currencies.increaseMoney(senderID, 50000);
        api.sendMessage("Bạn đã hoàn tất khảo sát và nhận được 50k xu. Cảm ơn bạn!", threadID, e.messageID);
      }
    }
  } catch (error) {
    console.error("Lỗi khi xử lý lý do khảo sát:", error);
    api.sendMessage("Đã xảy ra lỗi khi xử lý lý do của bạn. Vui lòng thử lại sau.", threadID, e.messageID);
  }
};
