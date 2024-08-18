const fs = require('fs');
const path = require('path');

const bankFilePath = path.join(__dirname, 'json', 'bankData.json');
const rankingFilePath = path.join(__dirname, 'json', 'ranking.json');
const equipmentFilePath = path.join(__dirname, 'json', 'equipment.json');
const skillsFilePath = path.join(__dirname, 'json', 'skills.json');

let bankData = {};
let rankingData = {};
let equipmentData = {};
let skillsData = {};

try {
  if (fs.existsSync(bankFilePath)) {
    bankData = JSON.parse(fs.readFileSync(bankFilePath, 'utf8'));
  }
  if (fs.existsSync(rankingFilePath)) {
    rankingData = JSON.parse(fs.readFileSync(rankingFilePath, 'utf8'));
  }
  if (fs.existsSync(equipmentFilePath)) {
    equipmentData = JSON.parse(fs.readFileSync(equipmentFilePath, 'utf8'));
  }
  if (fs.existsSync(skillsFilePath)) {
    skillsData = JSON.parse(fs.readFileSync(skillsFilePath, 'utf8'));
  }
} catch (error) {
  console.error("Error reading JSON files:", error);
}

const cooldowns = new Map();
const MAX_ATTEMPTS = 3;
const EVENT_START_HOUR = 15; 
const EVENT_END_HOUR = 22;   

module.exports.config = {
  name: "trombank",
  version: "1.1.0",
  hasPermission: 2,
  credits: "HNT",
  description: "Thực hiện trộm ngân hàng với nhiều tính năng và thử thách mỗi Chủ Nhật.",
  commandCategory: "game",
  usePrefix: true,
  usages: "trombank [nhiệm vụ] [trang bị] [kỹ năng]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args, Currencies }) => {
  const { senderID, threadID, messageID } = event;
  const currentTime = Date.now();
  const now = new Date();
  
  const eventStartTime = new Date();
  eventStartTime.setHours(EVENT_START_HOUR, 0, 0, 0);
  const eventEndTime = new Date();
  eventEndTime.setHours(EVENT_END_HOUR, 0, 0, 0);

  if (now.getDay() !== 0) { 
    return api.sendMessage("❌ Sự kiện chỉ diễn ra vào Chủ Nhật. Hãy quay lại vào thời gian sự kiện.", threadID, messageID);
  }

  if (currentTime < eventStartTime.getTime() || currentTime > eventEndTime.getTime()) {
    return api.sendMessage("❌ Sự kiện chỉ diễn ra từ 15:00 đến 22:00 mỗi Chủ Nhật.", threadID, messageID);
  }

  api.sendMessage("🎭 Chọn nhiệm vụ của bạn: \n1. Ngân Hàng HCB(2ChanBank)\n2. Ngân Hàng VCL(ViCongLy)\n3. Ngân Hàng AkiBank", threadID, (error, info) => {
    if (error) console.log(error);
    
    global.client.handleReply.push({
      type: "missionSelection",
      name: "bankheist",
      author: senderID,
      messageID: info.messageID,
      data: { senderID, threadID }
    });
  });
};

module.exports.handleReply = async function({ api, event, handleReply, Currencies }) {
  const { senderID, threadID, messageID, body } = event;
  
  switch (handleReply.type) {
    case "missionSelection":
      const missionChoice = body.trim();
      if (!["1", "2", "3"].includes(missionChoice)) {
        return api.sendMessage("❌ Lựa chọn không hợp lệ. Vui lòng chọn lại: \n1. Ngân Hàng HCB(2ChanBank)\n2. Ngân Hàng VCL(ViCongLy)\n3. Ngân Hàng AkiBank", threadID, messageID);
      }
      const missionType = getMissionType(missionChoice);
      api.sendMessage(`🔧 Bạn đã chọn ${missionType.name}. Chọn trang bị của bạn: \n1. Máy phá mã\n2. Thiết bị dò camera\n3. Bộ dụng cụ mở khóa`, threadID, (error, info) => {
        if (error) console.log(error);
        
        global.client.handleReply.push({
          type: "equipmentSelection",
          name: "bankheist",
          author: senderID,
          messageID: info.messageID,
          data: { mission: missionType, senderID, threadID }
        });
      });
      break;
      
    case "equipmentSelection":
      const equipmentChoice = body.trim();
      if (!["1", "2", "3"].includes(equipmentChoice)) {
        return api.sendMessage("❌ Lựa chọn không hợp lệ. Vui lòng chọn lại: \n1. Máy phá mã\n2. Thiết bị dò camera\n3. Bộ dụng cụ mở khóa", threadID, messageID);
      }
      const equipmentType = getEquipment(equipmentChoice);
      api.sendMessage(`🛠️ Bạn đã chọn ${equipmentType}. Chọn kỹ năng của bạn: \n1. Hacker\n2. Lén lút\n3. Sức mạnh`, threadID, (error, info) => {
        if (error) console.log(error);
        
        global.client.handleReply.push({
          type: "skillSelection",
          name: "bankheist",
          author: senderID,
          messageID: info.messageID,
          data: { mission: handleReply.data.mission, equipment: equipmentType, senderID, threadID }
        });
      });
      break;
      
    case "skillSelection":
      const skillChoice = body.trim();
      if (!["1", "2", "3"].includes(skillChoice)) {
        return api.sendMessage("❌ Lựa chọn không hợp lệ. Vui lòng chọn lại: \n1. Hacker\n2. Lén lút\n3. Sức mạnh", threadID, messageID);
      }
      const skillType = getSkill(skillChoice);
      const { mission, equipment } = handleReply.data;
      await performHeist(api, event, mission, equipment, skillType, Currencies); // Truyền Currencies vào đây
      break;
  }
};

function getMissionType(selection) {
  const missions = {
    "1": { name: "Ngân Hàng HCB (2ChanBank)", successRate: 0.3, amount: 10000, penalty: 1000, cooldown: 10 * 60 * 1000 },
    "2": { name: "Ngân Hàng VCL (Vì Công Lý)", successRate: 0.2, amount: 50000, penalty: 5000, cooldown: 20 * 60 * 1000 },
    "3": { name: "Ngân Hàng AkiBank", successRate: 0.1, amount: 100000, penalty: 10000, cooldown: 30 * 60 * 1000 }
  };
  return missions[selection];
}

function getEquipment(selection) {
  const equipments = {
    "1": "Máy phá mã",
    "2": "Thiết bị dò camera",
    "3": "Bộ dụng cụ mở khóa"
  };
  return equipments[selection];
}

function getSkill(selection) {
  const skills = {
    "1": "Hacker",
    "2": "Lén lút",
    "3": "Sức mạnh"
  };
  return skills[selection];
}
async function performHeist(api, event, mission, equipment, skill, Currencies) {
  const { senderID, threadID, messageID } = event;
  const currentTime = Date.now();
  const attempts = bankData[senderID]?.attempts || 0;

  if (attempts >= MAX_ATTEMPTS) {
    // Gửi thông báo khi người chơi đã hết lượt thử
    return api.sendMessage("❌ Bạn đã đạt số lần thử tối đa. Vui lòng thử lại sau.", threadID, messageID);
  }

  // Lấy thông tin người dùng từ API
  const userInfo = await api.getUserInfo(senderID);
  const userName = userInfo[senderID]?.name || 'Người chơi';

  const successRate = mission.successRate + getSkillBonus(skill) - getEquipmentPenalty(equipment);
  const success = Math.random() < successRate;
  const amount = mission.amount;

  if (success) {
    await Currencies.increaseMoney(senderID, amount);
    bankData[senderID] = { ...bankData[senderID], attempts: 0 };
    fs.writeFileSync(bankFilePath, JSON.stringify(bankData, null, 2), 'utf8');
    
    updateRanking(senderID, amount);

    api.sendMessage(`✅ ${userName} đã thành công trong việc trộm ${amount} xu từ ngân hàng ${mission.name}.`, threadID, messageID);
  } else {
    const penalty = mission.penalty;
    await Currencies.decreaseMoney(senderID, penalty);
    bankData[senderID] = { ...bankData[senderID], attempts: (attempts || 0) + 1 };
    fs.writeFileSync(bankFilePath, JSON.stringify(bankData, null, 2), 'utf8');

    if (attempts + 1 >= MAX_ATTEMPTS) {
      // Gửi thông báo khi người chơi đã hết lượt thử
      api.sendMessage(`❌ ${userName} đã bị bắt và bị phạt ${penalty} xu. Bạn đã đạt số lần thử tối đa. Vui lòng thử lại sau.`, threadID, messageID);
    } else {
      api.sendMessage(`❌ ${userName} đã bị bắt và bị phạt ${penalty} xu. Số lần thử còn lại: ${MAX_ATTEMPTS - (attempts || 0) - 1}.`, threadID, messageID);
    }
  }
}


function getSkillBonus(skill) {
  const bonuses = {
    "Hacker": 0.05,
    "Lén lút": 0.1,
    "Sức mạnh": 0.15
  };
  return bonuses[skill] || 0;
}

function getEquipmentPenalty(equipment) {
  const penalties = {
    "Máy phá mã": 0.05,
    "Thiết bị dò camera": 0.1,
    "Bộ dụng cụ mở khóa": 0.1
  };
  return penalties[equipment] || 0;
}

function updateRanking(senderID, amount) {
  if (!rankingData[senderID]) {
    rankingData[senderID] = { totalAmount: 0 };
  }
  rankingData[senderID].totalAmount += amount;
  fs.writeFileSync(rankingFilePath, JSON.stringify(rankingData, null, 2), 'utf8');
}
