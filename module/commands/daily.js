module.exports.config = {
    name: "daily",
    version: "1.0.5",
    hasPermission: 0,
    credits: "Hoàng Ngọc Từ",
    description: "Nhận xu mỗi ngày",
    commandCategory: "Tài Chính",
    usePrefix: true,
    usages: "Nhận xu ngẫu nhiên mỗi ngày",
    cooldowns: 0
};

const moment = require('moment-timezone');
const fs = require('fs');
const request = require('request');
const path = require('path');

const rewardMin = 20000;
const rewardMax = 70000;
const PREMIUM_FILE_PATH = path.resolve(__dirname, 'json', 'premium.json');

const getLastDailyClaim = async (userID, Currencies) => {
    try {
        const userData = await Currencies.getData(userID);
        return userData?.lastDailyClaim || 0;
    } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu người dùng: ${error.message}`);
        return 0;
    }
};

const setLastDailyClaim = async (userID, Currencies) => {
    try {
        await Currencies.setData(userID, { lastDailyClaim: Date.now() });
    } catch (error) {
        console.error(`Lỗi khi thiết lập dữ liệu người dùng: ${error.message}`);
    }
};

const getRandomReward = () => Math.floor(Math.random() * (rewardMax - rewardMin + 1)) + rewardMin;

const readPremiumData = async () => {
    try {
        if (fs.existsSync(PREMIUM_FILE_PATH)) {
            return await fs.promises.readFile(PREMIUM_FILE_PATH, 'utf-8').then(JSON.parse);
        } else {
            return {};
        }
    } catch (error) {
        console.error(`Lỗi khi đọc tệp dữ liệu Premium: ${error.message}`);
        return {};
    }
};

module.exports.run = async ({ api, event, Currencies, Users }) => {
    const { senderID, threadID } = event;

    const lastClaim = await getLastDailyClaim(senderID, Currencies);
    const now = moment().tz('Asia/Ho_Chi_Minh').startOf('day').valueOf();

    if (lastClaim >= now) {
        return api.sendMessage("Bạn đã nhận thưởng hôm nay rồi. Vui lòng quay lại vào ngày mai.", threadID, event.messageID);
    }

    let reward = getRandomReward();

    let userData = await Currencies.getData(senderID);
    if (!userData || typeof userData.money === 'undefined') {
        await Currencies.setData(senderID, { money: 0 });
        userData = await Currencies.getData(senderID);
    }

    const premiumData = await readPremiumData();
    const isPremium = premiumData[senderID]?.isPremium || false;

    if (isPremium) {
        reward *= 3;
    }

    try {
        await Currencies.increaseMoney(senderID, reward);
    } catch (error) {
        console.error(`Lỗi khi tăng tiền cho người dùng: ${error.message}`);
        return api.sendMessage("Có lỗi xảy ra khi nhận thưởng, vui lòng thử lại sau.", threadID, event.messageID);
    }

    await setLastDailyClaim(senderID, Currencies);

    const userName = (await Users.getData(senderID))?.name || "Người dùng";

    const gifUrl = 'https://imgur.com/L3o6ZyM.gif';
    const gifPath = path.join(__dirname, 'cache', 'daily_reward.gif');

    if (!fs.existsSync(gifPath)) {
        request(gifUrl).pipe(fs.createWriteStream(gifPath)).on('close', () => {
            sendRewardMessage(api, threadID, userName, reward, gifPath, event.messageID);
        });
    } else {
        sendRewardMessage(api, threadID, userName, reward, gifPath, event.messageID);
    }
};

const sendRewardMessage = (api, threadID, userName, reward, gifPath, messageID) => {
    api.sendMessage({
        body: `🎉 Chúc mừng ${userName}! Bạn đã nhận được ${reward} xu hôm nay.\nHãy quay lại vào ngày mai để nhận thưởng tiếp nhé!`,
        attachment: fs.createReadStream(gifPath)
    }, threadID, () => {
    }, messageID);
};
