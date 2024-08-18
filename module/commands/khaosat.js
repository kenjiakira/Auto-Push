const fs = require('fs-extra');
const path = require('path');
const lockfile = require('lockfile');

const surveyQuestions = [
  "Bạn muốn thêm lệnh gì cho bot?",
  "Bạn cảm thấy giao diện của bot có cần cải tiến không? Nếu có, hãy cho biết điều gì cần thay đổi.",
  "Có tính năng nào mà bạn nghĩ rằng bot nên bổ sung để cải thiện trải nghiệm của bạn?",
  "Bạn có gặp phải khó khăn gì khi sử dụng bot không? Nếu có, vui lòng mô tả.",
  "Bạn có đề xuất gì để làm cho bot trở nên hữu ích hơn?"
];

const dataFilePath = path.resolve(__dirname, 'json', 'khaosat.json');
const rewardFilePath = path.resolve(__dirname, 'json', 'rewardks.json');
const lockPath = dataFilePath + '.lock';

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

module.exports.config = {
  name: "khaosat",
  version: "1.0.6",
  hasPermission: 2,
  credits: "HNT",
  description: "Khởi tạo khảo sát ý kiến người dùng",
  commandCategory: "utilities",
  usePrefix: true,
  usages: "khaosat start - Bắt đầu khảo sát",
  cooldowns: 10
};

module.exports.run = async ({ api, event, args, Currencies }) => {
  const { threadID, messageID, senderID } = event;

  let rewardsData = await fs.readJson(rewardFilePath, { default: {} });
  let userData = await readJsonFile();

  if (rewardsData[senderID]) {
    return api.sendMessage("Bạn đã hoàn tất khảo sát và nhận phần thưởng. Cảm ơn bạn!", threadID, messageID);
  }

  if (args[0] === "start") {
    try {
      if (!userData[senderID]) {
        userData[senderID] = {
          answers: Array(surveyQuestions.length).fill(null),
          startTime: Date.now(),  // Lưu thời gian bắt đầu khảo sát
          agreed: false,  // Trạng thái đồng ý nội quy
          currentQuestionID: null  // ID tin nhắn câu hỏi hiện tại
        };
        await writeJsonFile(userData);

        // Gửi nội quy khảo sát
        const rulesMessage = "📋 **Nội Quy Khảo Sát** 📋\n\n" +
                             "1. Vui lòng trả lời tất cả các câu hỏi một cách nghiêm túc và chi tiết.\n" +
                             "2. Nếu bạn không thể trả lời một câu hỏi, hãy chọn 'Không biết' hoặc bỏ qua.\n" +
                             "3. Không chọn câu trả lời chỉ để qua loa để nhận phần thưởng.\n" +
                             "4. Thời gian hoàn tất khảo sát tối thiểu là 1 phút.\n\n" +
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
        // Tiếp tục khảo sát
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

    // Kiểm tra ID tin nhắn câu hỏi hiện tại
    if (e.messageReply && e.messageReply.messageID !== userData[senderID].currentQuestionID) {
      return api.sendMessage("⚠️ Bạn đang trả lời sai câu hỏi hoặc không phải câu hỏi khảo sát hiện tại.", threadID, e.messageID);
    }

    const answer = e.body.trim().toLowerCase();
    const questionIndex = handleReply.questionIndex;

    if (answer.length < 5) { // Kiểm tra câu trả lời có ít nhất 5 ký tự
      return api.sendMessage("⚡ Vui lòng cung cấp câu trả lời chi tiết hơn.", threadID, e.messageID);
    }

    userData[senderID].answers[questionIndex] = answer;

    await writeJsonFile(userData);

    // Kiểm tra nếu người dùng đã hoàn tất khảo sát
    if (userData[senderID].answers.includes(null)) {
      const nextQuestionIndex = userData[senderID].answers.indexOf(null);
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
      const duration = (endTime - startTime) / 1000; // Thời gian khảo sát tính bằng giây

      if (duration < 60) { // Nếu thời gian khảo sát < 1 phút
        delete userData[senderID]; // Xóa dữ liệu khảo sát
        await writeJsonFile(userData);
        api.sendMessage("Khảo sát của bạn bị hủy vì thời gian hoàn tất quá nhanh. Vui lòng thử lại.", threadID, e.messageID);
      } else {
        await fs.writeJson(rewardFilePath, { ...rewardsData, [senderID]: true }, { spaces: 2 });
        await Currencies.increaseMoney(senderID, 50000);
        api.sendMessage("Bạn đã hoàn tất khảo sát và nhận được 50k xu. Cảm ơn bạn!", threadID, e.messageID);
      }
    }
  } catch (error) {
    console.error("Lỗi khi xử lý phản hồi khảo sát:", error);
    api.sendMessage("Đã xảy ra lỗi khi xử lý phản hồi của bạn. Vui lòng thử lại sau.", threadID, e.messageID);
  }
};
