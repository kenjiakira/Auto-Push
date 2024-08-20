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
  version: "1.0.1",
  hasPermission: 2,
  credits: "HNT",
  description: "Thống kê kết quả khảo sát với kết quả chi tiết và trực quan",
  commandCategory: "utilities",
  usePrefix: true,
  usages: "thongkekhaosat - Thống kê kết quả khảo sát chi tiết và trực quan",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  try {

    const data = await fs.readJson(dataFilePath, { default: {} });
    const surveyQuestions = await readSurveyQuestions();

    const questionStats = surveyQuestions.map(() => ({
      count: {},
      total: 0
    }));


    Object.values(data).forEach(userData => {
      if (userData.answers && Array.isArray(userData.answers)) {
        userData.answers.forEach((answer, index) => {
          if (answer) {
            const answerText = answer.trim().toLowerCase();
            if (!questionStats[index].count[answerText]) {
              questionStats[index].count[answerText] = 0;
            }
            questionStats[index].count[answerText]++;
            questionStats[index].total++;
          }
        });
      } else {
        console.warn(`Dữ liệu không hợp lệ cho người dùng: ${JSON.stringify(userData)}`);
      }
    });


    let resultMessage = "===📊 THỐNG KÊ KẾT QUẢ KHẢO SÁT ===\n\n";
    surveyQuestions.forEach((question, index) => {
      resultMessage += `\n🔹 ${question}\n`;

      const stats = questionStats[index];
      for (const [answerText, count] of Object.entries(stats.count)) {
        const percentage = stats.total ? ((count / stats.total) * 100).toFixed(2) : 0;
        resultMessage += `  "${answerText}": ${count} (${percentage}%)\n`;
      }

      resultMessage += "---------------------------------------";
    });

    api.sendMessage(resultMessage || "Không có dữ liệu để thống kê.", threadID, messageID);
  } catch (error) {
    console.error("Lỗi khi thống kê kết quả khảo sát:", error);
    api.sendMessage("Đã xảy ra lỗi khi thống kê kết quả khảo sát.", threadID, messageID);
  }
};
