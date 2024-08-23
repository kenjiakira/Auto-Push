const axios = require('axios');
const translate = require('translate-google');
const fs = require('fs').promises;

module.exports.config = {
  name: "weather",
  version: "1.0.3",
  hasPermission: 0,
  credits: "Akira",
  description: "Tra cứu thông tin thời tiết và thông báo tự động",
  usePrefix: true,
  commandCategory: "utilities",
  usages: "weather [tên thành phố]",
  cooldowns: 5,
  dependencies: {}
};

const apiKey = "1230a8fdc6457603234c68ead5f3f967";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const cities = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Huế", "Nha Trang", "Thái Nguyên"
];

function getRandomCities(num = 1) {
    const shuffled = cities.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

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

async function notifyWeather(api) {
    if (!api || !api.sendMessage) {
        console.error('Đối tượng api không hợp lệ hoặc không có phương thức sendMessage.');
        return;
    }

    console.log('Bắt đầu thông báo thời tiết...');
    const randomCities = getRandomCities(1);
    
    let threadIDs = [];
    try {
        const data = await fs.readFile('module/commands/noti/groups.json', 'utf8');
        const jsonData = JSON.parse(data);
        threadIDs = jsonData.map(entry => entry.threadID);
    } catch (error) {
        console.error("Lỗi khi đọc tệp groups.json:", error.message);
        return;
    }
    
    for (const city of randomCities) {
        try {
            console.log(`Dịch tên thành phố: ${city}`);
            let translatedCityName = await translate(city, { to: "en" });
            if (typeof translatedCityName === 'object' && translatedCityName.text) {
                translatedCityName = translatedCityName.text;
            }
            console.log(`Tên thành phố đã dịch: ${translatedCityName}`);
            const weatherData = await getWeather(translatedCityName);

            if (!weatherData || !weatherData.weather || !weatherData.main || !weatherData.wind) {
                console.log('Dữ liệu thời tiết không đầy đủ.');
                continue;
            }

            const weatherDescription = weatherData.weather[0]?.description || "Không có mô tả";
            const temp = weatherData.main?.temp || "Không có dữ liệu";
            const tempMin = weatherData.main?.temp_min || "Không có dữ liệu";
            const tempMax = weatherData.main?.temp_max || "Không có dữ liệu";
            const humidity = weatherData.main?.humidity || "Không có dữ liệu";
            const windSpeed = weatherData.wind?.speed || "Không có dữ liệu";

            const message = `Thời tiết tại ${weatherData.name}:\n🌤️ Mô tả: ${weatherDescription}\n🌡️ Nhiệt độ: ${temp}°C\n🔽 Nhiệt độ tối thiểu: ${tempMin}°C\n🔼 Nhiệt độ tối đa: ${tempMax}°C\n💧 Độ ẩm: ${humidity}%\n💨 Tốc độ gió: ${windSpeed} m/s`;

            if (threadIDs.length === 0) {
                console.log('Danh sách Thread ID không hợp lệ hoặc trống.');
                continue;
            }

            console.log(`Gửi thông báo đến các Thread ID: ${threadIDs}`);
            threadIDs.forEach(threadID => {
                if (threadID) {
                    try {
                        api.sendMessage(message, threadID);
                    } catch (sendError) {
                        console.error(`Lỗi khi gửi thông báo đến Thread ID ${threadID}:`, sendError.message);
                    }
                } else {
                    console.log('Thread ID không hợp lệ:', threadID);
                }
            });

        } catch (error) {
            console.error(`Lỗi khi lấy thông tin thời tiết cho ${city}:`, error.message);
        }
    }
}

module.exports.run = async function({ api, event, args }) {
  const cityName = args.join(" ");
  if (!cityName) {
    return api.sendMessage("Bạn chưa nhập tên thành phố/khu vực cần tra cứu thời tiết.", event.threadID);
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

    if (typeof translatedCityName !== 'string') {
      return api.sendMessage("Tên thành phố không thể dịch được. Vui lòng kiểm tra lại.", event.threadID);
    }

    const weatherData = await getWeather(translatedCityName);

    if (!weatherData || !weatherData.weather || !weatherData.main || !weatherData.wind) {
      return api.sendMessage("Không thể lấy dữ liệu thời tiết. Vui lòng thử lại sau.", event.threadID);
    }

    const weatherDescription = weatherData.weather[0]?.description || "Không có mô tả";
    const temp = weatherData.main?.temp || "Không có dữ liệu";
    const tempMin = weatherData.main?.temp_min || "Không có dữ liệu";
    const tempMax = weatherData.main?.temp_max || "Không có dữ liệu";
    const humidity = weatherData.main?.humidity || "Không có dữ liệu";
    const windSpeed = weatherData.wind?.speed || "Không có dữ liệu";

    const message = `Thời tiết tại ${weatherData.name}:\n🌤️ Mô tả: ${weatherDescription}\n🌡️ Nhiệt độ: ${temp}°C\n🔽 Nhiệt độ tối thiểu: ${tempMin}°C\n🔼 Nhiệt độ tối đa: ${tempMax}°C\n💧 Độ ẩm: ${humidity}%\n💨 Tốc độ gió: ${windSpeed} m/s`;

    api.sendMessage(message, event.threadID);
  } catch (error) {
    api.sendMessage("Có lỗi xảy ra khi lấy thông tin thời tiết. Vui lòng thử lại sau.", event.threadID);
  }
};

module.exports.onLoad = function({ api }) {
  const now = new Date();
  const vietnamTimezoneOffset = 7 * 60 * 60 * 1000;
  const localTime = new Date(now.getTime() + vietnamTimezoneOffset);
  
  const minutesUntilNextHour = 60 - localTime.getMinutes();
  const msUntilNextHour = (minutesUntilNextHour * 60 + (60 - localTime.getSeconds())) * 1000; 

  console.log(`Đang chờ ${msUntilNextHour} ms để thông báo vào giờ tiếp theo.`);

  setTimeout(() => {
      console.log('Gửi thông báo thời tiết đầu tiên.');
      notifyWeather(api); 
      setInterval(() => {
          console.log('Gửi thông báo thời tiết mỗi giờ.');
          notifyWeather(api); 
      }, 60 * 60 * 1000);
  }, msUntilNextHour);
};
