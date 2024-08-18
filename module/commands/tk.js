const fs = require('fs-extra');
const path = require('path');

const dataFilePath = path.resolve(__dirname, 'json', 'khaosat.json');
const surveyQuestions = [
  "Bạn muốn thêm lệnh gì cho bot?",
  "Bạn cảm thấy giao diện của bot có cần cải tiến không? Nếu có, hãy cho biết điều gì cần thay đổi.",
  "Có tính năng nào mà bạn nghĩ rằng bot nên bổ sung để cải thiện trải nghiệm của bạn?",
  "Bạn có gặp phải khó khăn gì khi sử dụng bot không? Nếu có, vui lòng mô tả.",
  "Bạn có đề xuất gì để làm cho bot trở nên hữu ích hơn?"
];

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
    // Đọc dữ liệu khảo sát
    const data = await fs.readJson(dataFilePath, { default: {} });

    // Cấu trúc để lưu trữ thống kê cho từng câu hỏi
    const questionStats = surveyQuestions.map(() => ({
      count: {},
      total: 0
    }));

    // Xử lý dữ liệu để đếm số lượng câu trả lời
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

    // Tạo thông điệp thống kê
    let resultMessage = "===📊 THỐNG KÊ KẾT QUẢ KHẢO SÁT ===\n\n";
    surveyQuestions.forEach((question, index) => {
      resultMessage += `\n🔹 ${question}\n`;

      const stats = questionStats[index];
      for (const [answerText, count] of Object.entries(stats.count)) {
        const percentage = stats.total ? ((count / stats.total) * 100).toFixed(2) : 0;
        resultMessage += `  "${answerText}"\n`;
      }

      resultMessage += "---------------------------------------";
    });

    // Gửi thông điệp thống kê
    api.sendMessage(resultMessage || "Không có dữ liệu để thống kê.", threadID, messageID);
  } catch (error) {
    console.error("Lỗi khi thống kê kết quả khảo sát:", error);
    api.sendMessage("Đã xảy ra lỗi khi thống kê kết quả khảo sát.", threadID, messageID);
  }
};
