module.exports.config = {
    name: 'removebg',
    version: '1.6.0',
    hasPermission: 0,
    credits: 'HNT',
    description: 'Tách Background ảnh',
    commandCategory: 'Công cụ',
    usages: 'Reply ảnh hoặc gửi URL ảnh để tách Background',
    cooldowns: 5,
    usePrefix: true,
    dependencies: {
        'form-data': '',
        'image-downloader': '',
        'winston': ''
    }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');
const { promisify } = require('util');
const { exec } = require('child_process');
const execPromise = promisify(exec);
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'removebg.log' })
    ]
});

const apiKeys = [
    "t4Jf1ju4zEpiWbKWXxoSANn4",
    "CTWSe4CZ5AjNQgR8nvXKMZBd",
    "PtwV35qUq557yQ7ZNX1vUXED",
    "wGXThT64dV6qz3C6AhHuKAHV",
    "82odzR95h1nRp97Qy7bSRV5M",
    "4F1jQ7ZkPbkQ6wEQryokqTmo",
    "sBssYDZ8qZZ4NraJhq7ySySR",
    "NuZtiQ53S2F5CnaiYy4faMek",
    "f8fujcR1G43C1RmaT4ZSXpwW"
];

function generateUniqueFileName(extension) {
    return path.resolve(__dirname, 'cache', `photo_${Date.now()}.${extension}`);
}

async function processImage(imageUrl, format = 'png') {
    const inputPath = generateUniqueFileName('png');
    const outputPath = generateUniqueFileName(format);

    try {
    
        await image({ url: imageUrl, dest: inputPath });
        logger.info('Đã tải ảnh về', { inputPath });

        await removeBackground(inputPath, outputPath);
        logger.info('Đã xóa nền ảnh', { outputPath });

        fs.unlinkSync(inputPath);

        return outputPath;
    } catch (error) {
        logger.error('Lỗi khi xử lý ảnh', { error: error.message });
        throw new Error(`Lỗi khi xử lý ảnh: ${error.message}`);
    }
}

async function removeBackground(inputPath, outputPath) {
    try {
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

        const apiKey = await getApiKey();
        const response = await axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': apiKey,
            },
            encoding: null
        });

        if (response.status !== 200) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        fs.writeFileSync(outputPath, response.data);
    } catch (error) {
        throw new Error(`Lỗi khi xóa nền ảnh: ${error.message}`);
    }
}

async function getApiKey() {

    return apiKeys[Math.floor(Math.random() * apiKeys.length)];
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    try {
        let imageUrl;
        let format = 'png'; 

        if (args.length > 0) {
            format = args[0].toLowerCase();
        }

        if (event.type === 'message_reply') {
            if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) {
                return api.sendMessage("[❗]➜ Bạn cần reply ít nhất một ảnh.", threadID, messageID);
            }
            if (event.messageReply.attachments[0].type !== "photo") {
                return api.sendMessage("[❗]➜ Đối tượng reply không phải là ảnh.", threadID, messageID);
            }
            imageUrl = event.messageReply.attachments[0].url;
        } else if (event.messageReply && event.messageReply.body) {
            imageUrl = event.messageReply.body;
        } else {
            return api.sendMessage("[❗]➜ Vui lòng reply ảnh hoặc gửi URL ảnh để tách Background.", threadID, messageID);
        }

        const outputPath = await processImage(imageUrl, format);
        api.sendMessage({
            body: `📸[ TÁCH BACKGROUND ]📸\n━━━━━━━━━━━━━━━\n[✔️]➜ Tách Background thành công! Nền của ảnh bạn đã được loại bỏ.`,
            attachment: fs.createReadStream(outputPath)
        }, threadID, () => {
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        api.sendMessage(`[❗]➜ Đã xảy ra lỗi: ${error.message}. Vui lòng kiểm tra lại và thử lại sau.`, threadID, messageID);
    }
};
