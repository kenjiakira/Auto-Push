const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "tt",
  version: "1.0.0",
  hasPermission: 0,
  credits: "HNT",
  description: "Thông tin vui nhộn.",
  commandCategory: "Mini Game",
  usePrefix: true,
  usages: "tt [@tag (tùy chọn)]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, Users }) {
  const { threadID, messageID, senderID, mentions } = event;

  let targetID = senderID;
  if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }

  try {
    const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
    const avatarPath = path.join(__dirname, 'cache', 'profilefun', `${targetID}_avatar.png`);

    if (!fs.existsSync(path.dirname(avatarPath))) {
      fs.mkdirSync(path.dirname(avatarPath), { recursive: true });
    }

    fs.writeFileSync(avatarPath, avatarResponse.data);

    const name = (await Users.getData(targetID)).name || "Người dùng";

    const fakeData = {
      gender: ["Nam", "Nữ", "Không xác định", "Khác"][Math.floor(Math.random() * 4)],
      age: Math.floor(Math.random() * (25 - 14 + 1)) + 14,
      height: `${Math.floor(Math.random() * (200 - 150 + 1)) + 150} cm`,
      weight: `${Math.floor(Math.random() * (100 - 40 + 1)) + 40} kg`,
      personality: ["Lạc quan", "Trầm lặng", "Thân thiện", "Hướng nội", "Cả quyết", "Nhút nhát", "Sáng tạo", "Thực tế", "Lí trí", "Cảm xúc", "Hoà đồng", "Tự tin", "Hơi xấu tính", "Vui vẻ", "Độc lập", "Dễ tính", "Khéo léo", "Nhạy cảm", "Thận trọng", "Sôi nổi"][Math.floor(Math.random() * 20)],
      job: ["Kỹ sư", "Nhà thiết kế", "Giáo viên", "Lập trình viên", "Y tá", "Nhà báo", "Nghệ sĩ", "Nhà văn", "Nhạc sĩ", "Nhân viên bán hàng", "Luật sư", "Nhà quản lý", "Kế toán", "Chuyên gia marketing", "Bác sĩ", "Phát thanh viên", "Thợ xây", "Hướng dẫn viên du lịch", "Nhà khoa học", "Chuyên gia IT"][Math.floor(Math.random() * 20)],
      hobbies: ["Đọc sách", "Xem phim", "Chơi thể thao", "Đi du lịch", "Nấu ăn", "Vẽ tranh", "Chơi game", "Chơi nhạc cụ", "Sưu tập đồ cổ", "Chăm sóc thú cưng", "Chạy bộ", "Yoga", "Làm vườn", "Thể dục thẩm mỹ", "Cắm hoa", "Làm thủ công", "Đi bộ đường dài", "Làm bánh", "Chơi bóng đá", "Lướt web"],
      favoriteColor: ["Đỏ", "Xanh", "Vàng", "Tím", "Xám", "Nâu", "Hồng", "Cam", "Xanh lá cây", "Trắng", "Đen", "Xanh dương", "Be", "Vàng sáng", "Xanh nhạt", "Đỏ tươi", "Đỏ đậm", "Tím nhạt", "Xanh lục", "Xanh biển"][Math.floor(Math.random() * 20)],
      favoriteFood: ["Pizza", "Burger", "Sushi", "Bánh mì", "Phở", "Bún chả", "Cơ   m tấm", "Hủ tiếu", "Mỳ Ý", "Sườn nướng", "Xôi", "Bánh bao", "Gỏi cuốn", "Chả giò", "Cá hồi", "Salad", "Tacos", "Sườn cốt lết", "Bánh kem", "Bánh xèo"][Math.floor(Math.random() * 20)],
      favoriteSeason: ["Xuân", "Hạ", "Thu", "Đông"][Math.floor(Math.random() * 4)],
      favoriteAnimal: ["Chó", "Mèo", "Gà", "Ngựa", "Cá", "Hươu", "Sư tử", "Hổ", "Voi", "Khỉ", "Gấu", "Hải cẩu", "Cá mập", "Rồng", "Cừu", "Bò", "Lừa", "Công", "Chồn", "Nhím", "Dê"][Math.floor(Math.random() * 20)],
      dreamTravel: ["Paris", "Tokyo", "New York", "Sydney", "Rome", "London", "Dubai", "Singapore", "Barcelona", "Istanbul", "Bangkok", "Los Angeles", "Amsterdam", "Prague", "Vienna", "San Francisco", "Hong Kong", "Seoul", "Buenos Aires", "Rio de Janeiro"][Math.floor(Math.random() * 20)],
      favoriteBook: ["Harry Potter", "To Kill a Mockingbird", "1984", "The Great Gatsby", "Moby Dick", "War and Peace", "Pride and Prejudice", "The Catcher in the Rye", "The Hobbit", "The Da Vinci Code", "The Alchemist", "The Shining", "The Lord of the Rings", "The Chronicles of Narnia", "Brave New World", "The Book Thief", "Gone with the Wind", "A Tale of Two Cities", "The Hunger Games", "Little Women"][Math.floor(Math.random() * 20)],
      favoriteMusic: ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "Electronic", "Country", "Blues", "Reggae", "R&B", "Soul", "Metal", "Folk", "Punk", "Opera", "Rap", "Dance", "Trance", "Techno", "Indie"][Math.floor(Math.random() * 20)],
      favoriteMovie: ["Inception", "The Matrix", "Avatar", "Titanic", "The Shawshank Redemption", "Forrest Gump", "The Godfather", "Star Wars", "Jurassic Park", "The Avengers", "Gladiator", "The Dark Knight", "Pulp Fiction", "The Silence of the Lambs", "Schindler's List", "Fight Club", "The Departed", "The Lion King", "The Lord of the Rings", "Inglourious Basterds"][Math.floor(Math.random() * 20)]
    };

    // Select one random hobby
    const hobby = fakeData.hobbies[Math.floor(Math.random() * fakeData.hobbies.length)];

    const profileMessage = `
      📋 Thông tin hồ sơ:
      - Tên: ${name}
      - Giới tính: ${fakeData.gender}
      - Tuổi: ${fakeData.age}
      - Chiều cao: ${fakeData.height}
      - Cân nặng: ${fakeData.weight}
      - Tính cách: ${fakeData.personality}
      - Công việc: ${fakeData.job}
      - Sở thích: ${hobby}
      - Màu sắc yêu thích: ${fakeData.favoriteColor}
      - Món ăn yêu thích: ${fakeData.favoriteFood}
      - Mùa yêu thích: ${fakeData.favoriteSeason}
      - Động vật yêu thích: ${fakeData.favoriteAnimal}
      - Điểm đến mơ ước: ${fakeData.dreamTravel}
      - Sách yêu thích: ${fakeData.favoriteBook}
      - Nhạc yêu thích: ${fakeData.favoriteMusic}
      - Phim yêu thích: ${fakeData.favoriteMovie}
      
      📷 Ảnh đại diện:
    `;

    return api.sendMessage({
      body: profileMessage,
      attachment: fs.createReadStream(avatarPath)
    }, threadID, async () => {
      fs.unlinkSync(avatarPath);
    });

  } catch (error) {
    console.error("Lỗi khi lấy thông tin hồ sơ:", error);
    return api.sendMessage("Đã xảy ra lỗi khi lấy thông tin hồ sơ.", threadID, messageID);
  }
};