const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fse = require('fs-extra');
const diacritics = require('diacritics');

registerFont(path.join(__dirname, 'cache', 'Be_Vietnam_Pro', 'BeVietnamPro-Bold.ttf'), { family: 'Be Vietnam Pro' });

const formatCurrency = (amount) => {
    amount = parseFloat(amount).toFixed(2);
    let [integerPart, decimalPart] = amount.split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${integerPart},${decimalPart}`;
};

module.exports.config = {
    name: "banking",
    version: "1.1.0",
    hasPermission: 0,
    credits: "Hoàng Ngọc Từ",
    description: "Quản lý ngân hàng của bạn",
    commandCategory: "Tài chính",
    usePrefix: true,
    usages: "[register | gửi [số xu] | rút [số xu] | info]\n\n" +
            "Hướng dẫn sử dụng:\n" +
            "- `register`: Đăng ký tài khoản ngân hàng mới.\n" +
            "- `gửi [số xu]`: Gửi số tiền vào ngân hàng. Số tiền gửi phải lớn hơn 100 xu.\n" +
            "- `rút [số xu]`: Rút số tiền từ ngân hàng. Bạn có thể rút tiền nếu số dư trong ngân hàng đủ.\n" +
            "- `info`: Xem thông tin tài khoản ngân hàng của bạn và xem thẻ ngân hàng.\n\n" +
            "Ví dụ:\n" +
            "- Đăng ký tài khoản ngân hàng: `.banking register`\n" +
            "- Gửi tiền vào ngân hàng: `.banking gửi 200`\n" +
            "- Rút tiền từ ngân hàng: `.banking rút 50`\n" +
            "- Xem thông tin tài khoản: `.banking info`",
    cooldowns: 5
};

const bankDataPath = path.join(__dirname, '../../module/commands/json/banking.json');

const readBankData = async () => {
    try {
        const data = await fse.readJson(bankDataPath);
        return data;
    } catch (error) {
        return {};
    }
};

const writeBankData = async (data) => {
    try {
        await fse.writeJson(bankDataPath, data, { spaces: 2 });
    } catch (error) {
        console.error("Lỗi khi ghi dữ liệu vào file JSON:", error);
    }
};

const generateUID = (length) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const formatUID = (uid) => {
    return uid.match(/.{1,4}/g).join(' ');
};

const createBankCard = async (userName, uid) => {
    const width = 800;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const cacheDir = path.join(__dirname, 'cache', 'banking');
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }

    const backgroundPath = path.join(cacheDir, 'bank_card_background.png');
    if (!fs.existsSync(backgroundPath)) {
        throw new Error('Ảnh nền thẻ ngân hàng không tồn tại');
    }

    const background = await loadImage(backgroundPath);
    ctx.drawImage(background, 0, 0, width, height);

    ctx.font = 'bold 50px Arial';
    ctx.fillStyle = '#f52409';
    ctx.fillText('BANK CARD', 50, 100);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '50px Arial';
    ctx.fillText(formatUID(uid), 120, 320);

    const nameWithoutAccents = diacritics.remove(userName);
    ctx.font = 'bold 40px Arial';
    ctx.fillText(nameWithoutAccents.toUpperCase(), 50, 450);

    const expiryDate = moment().add(5, 'years').format('MM/YY');
    ctx.font = '40px Arial';
    ctx.fillText(`${expiryDate}`, 280, 400);

    const imagePath = path.join(cacheDir, 'bank_card.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);

    return imagePath;
};

const createBankInfoImage = async (userName, uid, amount) => {
    const width = 720;
    const height = 1280;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const cacheDir = path.join(__dirname, 'cache', 'banking');
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }

    const backgroundImagePath = path.join(__dirname, 'cache', 'banking', 'banking.png');
    if (!fs.existsSync(backgroundImagePath)) {
        throw new Error('Ảnh nền không tồn tại');
    }

    const backgroundImage = await loadImage(backgroundImagePath);
    ctx.drawImage(backgroundImage, 0, 0, width, height);

    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('', width / 2, 20);

    const formattedUserName = userName.toUpperCase();

    ctx.font = 'bold 57px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${formattedUserName}`, width / 2, 268);

    ctx.textAlign = 'left'; 
    ctx.textBaseline = 'top'; 
    ctx.fillStyle = '#e20814';
    ctx.font = '26px Arial';
    ctx.fillText(`${formatUID(uid)}`, 277, 699);
    ctx.font = 'bold 48px Arial';
    ctx.fillText(`${formatCurrency(amount)} xu`, 60, 730);  
    const imagePath = path.join(cacheDir, 'bank_info.png');
    const buffer = canvas.toBuffer('image/png', { compressionLevel: 0 }); 
    fs.writeFileSync(imagePath, buffer);

    return imagePath;
};

const calculateInterest = (amount, hours) => {
    const interestRate = 0.001; 
    return amount * (interestRate * hours);
};

module.exports.run = async ({ api, event, args, Currencies, Users }) => {
    const { threadID, messageID, senderID } = event;
    const currentTime = moment().unix();

    const bankData = await readBankData();

    if (args.length === 0) {
        if (!bankData[senderID]) {
            return api.sendMessage("Bạn chưa đăng ký tài khoản ngân hàng. Vui lòng đăng ký bằng lệnh '.banking register' trước.", threadID, messageID);
        }

        const userBankData = bankData[senderID];
        const hoursElapsed = (currentTime - userBankData.lastUpdate) / 3600;
        const interest = calculateInterest(userBankData.amount, hoursElapsed);

        const userName = await Users.getNameUser(senderID);
        const imagePath = await createBankInfoImage(userName, userBankData.uid, userBankData.amount + interest);

        return api.sendMessage({
            body: "Thông tin tài khoản ngân hàng của bạn:",
            attachment: fs.createReadStream(imagePath)
        }, threadID, messageID);
    }

    if (args[0].toLowerCase() === "info") {
        if (!bankData[senderID]) {
            return api.sendMessage("Bạn chưa đăng ký tài khoản ngân hàng. Vui lòng đăng ký bằng lệnh '.banking register' trước.", threadID, messageID);
        }

        const userBankData = bankData[senderID];
        const userName = await Users.getNameUser(senderID);
        const imagePath = await createBankCard(userName, userBankData.uid);

        return api.sendMessage({
            body: "Thông tin ngân hàng của bạn:",
            attachment: fs.createReadStream(imagePath)
        }, threadID, messageID);
    }

    const action = args[0].toLowerCase();

    if (action === "register") {
        if (bankData[senderID]) {
            return api.sendMessage("Bạn đã có tài khoản ngân hàng.", threadID, messageID);
        }

        const uid = generateUID(16);
        bankData[senderID] = { uid, amount: 0, lastUpdate: currentTime };
        await writeBankData(bankData);

        try {
            const userName = await Users.getNameUser(senderID);
            const imagePath = await createBankCard(userName, uid);

            return api.sendMessage({
                body: "Bạn đã đăng ký tài khoản ngân hàng thành công. Bây giờ hãy nhập cú pháp:\n" +
                      "banking gửi <số tiền>\n" +
                      "banking rút <số tiền>\n" +
                      "banking info để xem thẻ ATM",
                attachment: fs.createReadStream(imagePath)
            }, threadID, messageID);
        } catch (error) {
            return api.sendMessage("Đã xảy ra lỗi khi tạo thẻ ngân hàng.", threadID, messageID);
        }
    }

    if (action === "gửi") {
        const amount = parseInt(args[1]);

        if (isNaN(amount) || amount <= 0) {
            return api.sendMessage("Vui lòng nhập số tiền hợp lệ để gửi.", threadID, messageID);
        }

        if (amount < 100) {
            return api.sendMessage("Số tiền gửi tối thiểu là 100 xu.", threadID, messageID);
        }

        const userMoney = (await Currencies.getData(senderID)).money;

        if (userMoney < amount) {
            return api.sendMessage("Bạn không có đủ tiền để gửi.", threadID, messageID);
        }

        if (!bankData[senderID]) {
            return api.sendMessage("Bạn chưa có tài khoản ngân hàng. Vui lòng đăng ký bằng lệnh '.banking register' trước.", threadID, messageID);
        }

        bankData[senderID].amount += amount;
        bankData[senderID].lastUpdate = currentTime;
        await writeBankData(bankData);

        await Currencies.decreaseMoney(senderID, amount);

        return api.sendMessage(`Bạn đã gửi ${formatCurrency(amount)} xu vào tài khoản ngân hàng.`, threadID, messageID);
    }

    if (action === "rút") {
        const amount = parseInt(args[1]);

        if (isNaN(amount) || amount <= 0) {
            return api.sendMessage("Vui lòng nhập số tiền hợp lệ để rút.", threadID, messageID);
        }

        if (!bankData[senderID]) {
            return api.sendMessage("Bạn chưa có tài khoản ngân hàng. Vui lòng đăng ký bằng lệnh '.banking register' trước.", threadID, messageID);
        }

        const userBankData = bankData[senderID];

        if (userBankData.amount < amount) {
            return api.sendMessage("Số dư trong ngân hàng không đủ để rút.", threadID, messageID);
        }

        userBankData.amount -= amount;
        userBankData.lastUpdate = currentTime;
        await writeBankData(bankData);

        await Currencies.increaseMoney(senderID, amount);

        return api.sendMessage(`Bạn đã rút ${formatCurrency(amount)} xu từ tài khoản ngân hàng.`, threadID, messageID);
    }
};
