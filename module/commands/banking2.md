const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

const formatCurrency = (amount) => {
    amount = parseFloat(amount).toFixed(2);
    let [integerPart, decimalPart] = amount.split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${integerPart},${decimalPart}`;
};

module.exports.config = {
    name: "banking",
    version: "1.0.0",
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
            "- `info`: Xem thông tin tài khoản ngân hàng của bạn.\n\n" +
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
        const data = await fs.promises.readFile(bankDataPath);
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
};

const writeBankData = async (data) => {
    try {
        await fs.promises.writeFile(bankDataPath, JSON.stringify(data, null, 2));
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

const calculateInterest = (amount, hours) => {
    const interestRate = 0.001; 
    return amount * (interestRate * hours);
};

module.exports.run = async ({ api, event, args, Currencies }) => {
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

        return api.sendMessage(
            `Thông tin tài khoản ngân hàng của bạn:\n\n` +
            `UID: ${userBankData.uid}\n` +
            `Số dư: ${formatCurrency(userBankData.amount + interest)} xu`,
            threadID,
            messageID
        );
    }

    if (args[0].toLowerCase() === "info") {
        if (!bankData[senderID]) {
            return api.sendMessage("Bạn chưa đăng ký tài khoản ngân hàng. Vui lòng đăng ký bằng lệnh '.banking register' trước.", threadID, messageID);
        }

        const userBankData = bankData[senderID];

        return api.sendMessage(
            `Thông tin ngân hàng của bạn:\n\n` +
            `UID: ${userBankData.uid}\n` +
            `Số dư: ${formatCurrency(userBankData.amount)} xu`,
            threadID,
            messageID
        );
    }

    const action = args[0].toLowerCase();

    if (action === "register") {
        if (bankData[senderID]) {
            return api.sendMessage("Bạn đã có tài khoản ngân hàng.", threadID, messageID);
        }

        const uid = generateUID(16);
        bankData[senderID] = { uid, amount: 0, lastUpdate: currentTime };
        await writeBankData(bankData);

        return api.sendMessage(
            "Bạn đã đăng ký tài khoản ngân hàng thành công.\n" +
            "Sử dụng lệnh:\n" +
            "- `banking gửi <số tiền>` để gửi tiền\n" +
            "- `banking rút <số tiền>` để rút tiền\n" +
            "- `banking info` để xem thông tin ngân hàng",
            threadID,
            messageID
        );
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
