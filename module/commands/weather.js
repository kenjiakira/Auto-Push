const axios = require('axios');
const translate = require('translate-google');
const fs = require('fs').promises;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEYS = [
  "AIzaSyDMp6YNWYUw_wQBdv4DjkAOvZXJv7ITRy0",  
  "AIzaSyDysChx19Lu3hAFpE2knZwkoCWGTN2gfy0",
  "AIzaSyCTvL29weT4BIn7WtFtTvsaQ5Jt6Dm4mBE",
  "AIzaSyDoCGS2-hagw5zWVMfL5iqAVRFNivtbam4",
  "AIzaSyASuW0stXR61_xJ3s0XP3Qw0RoudGCjQRQ",
  "AIzaSyC78Dqs1rdEfj4JcmlSFEBhJZLOJzWmt_Y",
  "AIzaSyDpqfVtdyGLfipEdRNFfUQbCH-prn1sHEs",
  "AIzaSyArI6Ww02Ill7b6Bx5itiKlHD62siAFLIc",
  "AIzaSyBgYVR81UeL7kYouxcwzUL75YOBafgNphU" 
];

module.exports.config = {
  name: "weather",
  version: "1.3.0", 
  hasPermission: 0,
  credits: "Akira, HNT",
  description: "Tra cứu thông tin thời tiết và thông báo tự động với mô tả từ AI",
  usePrefix: true,
  commandCategory: "utilities",
  usages: "weather [tên thành phố]",
  cooldowns: 5,
  dependencies: {
    "@google/generative-ai": ""
  }
};

const apiKey = "1230a8fdc6457603234c68ead5f3f967";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

async function getWeather(cityName) {
  const params = {
    q: cityName,
    appid: apiKey,
    units: "metric"
  };

  try {
    const response = await axios.get(apiUrl, { params });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi gọi API thời tiết: ${error.response ? error.response.data.message : error.message}`);
    throw new Error("Không tìm thấy thông tin thời tiết cho thành phố/khu vực này.");
  }
}

async function guessCityName(cityName) {
  let guessedCityName = cityName;

  for (let i = 0; i < API_KEYS.length; i++) {
    const genAI = new GoogleGenerativeAI(API_KEYS[i]);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Đoán tên thành phố hoặc khu vực chính xác dựa trên đầu vào: "${cityName}".
      Đề xuất tên chính xác hoặc gần đúng.
    `;

    try {
      const result = await model.generateContent([{ text: prompt }]);
      guessedCityName = result.response.text().trim();
      break; 
    } catch (error) {
      console.error(`Lỗi khi sử dụng API Gemini với API key thứ ${i + 1}:`, error);
      if (i === API_KEYS.length - 1) {
        console.warn("Tất cả API keys đã chết, quay lại sử dụng API gốc.");
        return null;
      }
    }
  }

  return guessedCityName;
}

async function generateWeatherDescription(weatherData) {
  let description = '';

  for (let i = 0; i < API_KEYS.length; i++) {
    const genAI = new GoogleGenerativeAI(API_KEYS[i]);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const shortPrompt = `
      Hãy tạo một đoạn mô tả ngắn gọn và hấp dẫn về thời tiết hiện tại tại ${weatherData.name}, với các thông tin:
      - Mô tả thời tiết: ${weatherData.weather[0]?.description || "Không có mô tả"}
      - Nhiệt độ: ${weatherData.main?.temp}°C
      - Độ ẩm: ${weatherData.main?.humidity}%
      - Tốc độ gió: ${weatherData.wind?.speed} m/s
      
      Dùng phong cách vui vẻ, thêm emoji và viết như một người dẫn chương trình thời tiết.
    `;

    try {
      const result = await model.generateContent([{ text: shortPrompt }]);
      description = result.response.text();
      break;
    } catch (error) {
      console.error(`Lỗi khi sử dụng API Gemini với API key thứ ${i + 1}:`, error);
      if (i === API_KEYS.length - 1) {
        console.warn("Tất cả API keys đã chết, quay lại sử dụng API gốc.");
        return `Thời tiết tại ${weatherData.name} hiện tại không thể mô tả chính xác bằng AI, xin vui lòng thử lại sau.`;
      }
    }
  }

  return description;
}

module.exports.run = async function({ api, event, args }) {
  const cityName = args.join(" ");
  if (!cityName) {
    return api.sendMessage("🌍 Bạn chưa nhập tên thành phố/khu vực cần tra cứu thời tiết.", event.threadID);
  }

  try {
    let translatedCityName = cityName;
    if (!/^[a-zA-Z\s]+$/.test(cityName)) { 
      try {
        translatedCityName = await translate(cityName, { to: "en" });
        if (typeof translatedCityName === 'object' && translatedCityName.text) {
          translatedCityName = translatedCityName.text;
        }
      } catch (error) {
        return api.sendMessage("Có lỗi xảy ra khi dịch tên thành phố. Vui lòng kiểm tra lại.", event.threadID);
      }
    }

    let weatherData;
    try {
      weatherData = await getWeather(translatedCityName);
    } catch (error) {
      console.warn("Không tìm thấy thành phố, đang đoán lại tên...");
      const guessedCityName = await guessCityName(translatedCityName);
      if (guessedCityName) {
        weatherData = await getWeather(guessedCityName);
      } else {
        throw new Error("Không thể đoán được tên thành phố, quay lại API gốc.");
      }
    }

    if (!weatherData || !weatherData.weather || !weatherData.main || !weatherData.wind) {
      return api.sendMessage("❗ Không thể lấy dữ liệu thời tiết. Vui lòng thử lại sau.", event.threadID);
    }

    const weatherDescription = await generateWeatherDescription(weatherData);

    api.sendMessage(weatherDescription, event.threadID);
  } catch (error) {
    api.sendMessage("⚠️ Có lỗi xảy ra khi lấy thông tin thời tiết. Vui lòng thử lại sau.", event.threadID);
  }
};

module.exports.onLoad = function({ api }) {
  const now = new Date();
  const vietnamTimezoneOffset = 7 * 60 * 60 * 1000;
  const localTime = new Date(now.getTime() + vietnamTimezoneOffset);
  
  const minutesUntilNextHour = 60 - localTime.getMinutes();
  const msUntilNextHour = (minutesUntilNextHour * 360 + (360 - localTime.getSeconds())) * 1000; 

  console.log(`Đang chờ ${msUntilNextHour} ms để thông báo vào giờ tiếp theo.`);

  setTimeout(() => {
      console.log('Gửi thông báo thời tiết đầu tiên.');
      notifyWeather(api); 
      setInterval(() => {
          console.log('Gửi thông báo thời tiết mỗi giờ.');
          notifyWeather(api); 
      }, 360 * 60 * 1000);
  }, msUntilNextHour);
};