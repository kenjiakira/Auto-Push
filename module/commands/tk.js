const fs = require('fs-extra');
const path = require('path');

const dataFilePath = path.resolve(__dirname, 'json', 'khaosat.json');
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

module.exports.config = {
  name: "tk",
  version: "1.0.2",
  hasPermission: 2,
  credits: "HNT",
  description: "Thống kê kết quả khảo sát với kết quả chi tiết và trực quan, bao gồm cả lý do.",
  commandCategory: "utilities",
  usePrefix: true,
  usages: "thongkekhaosat - Thống kê kết quả khảo sát chi tiết và trực quan, bao gồm cả lý do.",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  try {
    const data = await fs.readJson(dataFilePath, { default: {} });
    const surveyQuestions = await readSurveyQuestions();

    if (surveyQuestions.length === 0) {
      return api.sendMessage("Không có câu hỏi khảo sát nào để thống kê.", threadID, messageID);
    }

    let resultMessage = "===📊 THỐNG KÊ KẾT QUẢ KHẢO SÁT ===\n\n";

    surveyQuestions.forEach((question, questionIndex) => {
      const stats = {
        count: {},
        total: 0,
        reasons: {}
      };

      Object.values(data).forEach(userData => {
        if (userData.answers && Array.isArray(userData.answers)) {
          const answer = userData.answers[questionIndex];
          if (answer && answer.rating !== undefined) {
            const rating = answer.rating;
            if (!stats.count[rating]) {
              stats.count[rating] = 0;
              stats.reasons[rating] = [];
            }
            stats.count[rating]++;
            stats.total++;

            if (answer.reason) {
              stats.reasons[rating].push(answer.reason);
            }
          }
        }
      });

      resultMessage += `\n🔹 ${question}\n`;

      for (const [rating, count] of Object.entries(stats.count)) {
        const percentage = stats.total ? ((count / stats.total) * 100).toFixed(2) : 0;
        resultMessage += `  "${rating}": ${count} (${percentage}%)\n`;

        if (stats.reasons[rating].length > 0) {
          resultMessage += `    Lý do:\n`;
          stats.reasons[rating].forEach((reason, index) => {
            resultMessage += `      ${index + 1}. ${reason}\n`;
          });
        }
      }

      if (stats.total === 0) {
        resultMessage += "  Không có dữ liệu cho câu hỏi này.\n";
      }

      resultMessage += "---------------------------------------";
    });

    api.sendMessage(resultMessage || "Không có dữ liệu để thống kê.", threadID, messageID);
  } catch (error) {
    console.error("Lỗi khi thống kê kết quả khảo sát:", error);
    api.sendMessage("Đã xảy ra lỗi khi thống kê kết quả khảo sát.", threadID, messageID);
  }
};
