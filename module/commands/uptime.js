const botStartTime = Date.now();
const os = require('os');
const moment = require('moment');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

let commandCount = 0;

module.exports.config = {
    name: "uptime",
    version: "1.4.0",
    hasPermission: 0,
    credits: "HNT",
    description: "Xem thời gian bot đã online và thông tin hệ thống.",
    commandCategory: "Hệ thống",
    usages: "uptime",
    usePrefix: false,
    cooldowns: 5
};

function createProgressBar(total, current, length = 17) {
    const filledLength = Math.round((current / total) * length);
    const bar = "█".repeat(filledLength) + "░".repeat(length - filledLength);
    return `[${bar}] ${(current / total * 100).toFixed(2)}%`;
}

async function getPing() {
    try {
        const isWindows = os.platform() === 'win32';
        const pingCommand = isWindows ? 'ping -n 1 google.com' : 'ping -c 1 google.com';
        const { stdout } = await execPromise(pingCommand);
        const match = stdout.match(isWindows ? /time=(\d+)ms/ : /time=(\d+\.\d+) ms/);
        return match ? `${match[1]} ms` : 'N/A';
    } catch {
        return 'N/A';
    }
}

async function getDiskUsage() {
    try {
        const { stdout } = await execPromise('df -h');
        const lines = stdout.split('\n');
        const diskInfo = lines.find(line => line.includes('/'));
        if (diskInfo) {
            const parts = diskInfo.split(/\s+/);
            return {
                totalDisk: parts[1],
                usedDisk: parts[2],
                availableDisk: parts[3],
                usagePercentage: parts[4]
            };
        } else {
            return {
                totalDisk: 'N/A',
                usedDisk: 'N/A',
                availableDisk: 'N/A',
                usagePercentage: 'N/A'
            };
        }
    } catch {
        return {
            totalDisk: 'N/A',
            usedDisk: 'N/A',
            availableDisk: 'N/A',
            usagePercentage: 'N/A'
        };
    }
}

async function getSystemInfo() {
    try {
        const platform = os.platform();
        const release = os.release();
        const arch = os.arch();
        const hostname = os.hostname();
        const cpuModel = os.cpus()[0].model;
        const coreCount = os.cpus().length;
        const cpuSpeed = os.cpus()[0].speed;
        const loadAverage = os.loadavg();
        const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2); // GB
        const freeMemory = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2); // GB
        const usedMemory = (totalMemory - freeMemory).toFixed(2);
        const uptime = os.uptime();
        const networkInterfaces = os.networkInterfaces();
        const diskUsage = await getDiskUsage();

        return {
            platform,
            release,
            arch,
            hostname,
            cpuModel,
            coreCount,
            cpuSpeed,
            loadAverage,
            totalMemory,
            freeMemory,
            usedMemory,
            uptime,
            networkInterfaces,
            diskUsage
        };
    } catch (error) {
        return {
            platform: 'N/A',
            release: 'N/A',
            arch: 'N/A',
            hostname: 'N/A',
            cpuModel: 'N/A',
            coreCount: 'N/A',
            cpuSpeed: 'N/A',
            loadAverage: 'N/A',
            totalMemory: 'N/A',
            freeMemory: 'N/A',
            usedMemory: 'N/A',
            uptime: 'N/A',
            networkInterfaces: 'N/A',
            diskUsage: {
                totalDisk: 'N/A',
                usedDisk: 'N/A',
                availableDisk: 'N/A',
                usagePercentage: 'N/A'
            }
        };
    }
}

async function getDockerInfo() {
    try {
        const { stdout } = await execPromise('docker stats --no-stream --format "{{.Name}}: CPU {{.CPUPerc}}, MEM {{.MemUsage}}"');
        return stdout || 'N/A';
    } catch {
        return 'N/A';
    }
}

async function getNodeVersion() {
    try {
        const { stdout } = await execPromise('node -v');
        return stdout.trim();
    } catch {
        return 'N/A';
    }
}

async function getSystemUptime() {
    const sysUptimeDays = Math.floor(os.uptime() / (60 * 60 * 24));
    const sysUptimeHours = Math.floor((os.uptime() % (60 * 60 * 24)) / (60 * 60));
    const sysUptimeMinutes = Math.floor((os.uptime() % (60 * 60)) / 60);
    const sysUptimeSeconds = Math.floor(os.uptime() % 60);
    return `${sysUptimeDays} ngày, ${sysUptimeHours} giờ, ${sysUptimeMinutes} phút, ${sysUptimeSeconds} giây`;
}

async function getNetworkSpeed() {
    try {
        const { stdout } = await execPromise('speedtest-cli --simple');
        const lines = stdout.trim().split('\n');
        return {
            ping: lines[0]?.split(': ')[1] || 'N/A',
            download: lines[1]?.split(': ')[1] || 'N/A',
            upload: lines[2]?.split(': ')[1] || 'N/A'
        };
    } catch {
        return {
            ping: 'N/A',
            download: 'N/A',
            upload: 'N/A'
        };
    }
}

async function getTemperature() {
    try {
        const { stdout } = await execPromise('sensors');
        const tempMatch = stdout.match(/temp1:\s+\+([\d\.]+)°C/);
        return tempMatch ? `${tempMatch[1]}°C` : 'N/A';
    } catch {
        return 'N/A';
    }
}

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;

    let currentTime = Date.now();
    let uptime = currentTime - botStartTime;
    let seconds = Math.floor((uptime / 1000) % 60);
    let minutes = Math.floor((uptime / (1000 * 60)) % 60);
    let hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    let days = Math.floor(uptime / (1000 * 60 * 60 * 24));

    let memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; 
    let cpuLoad = os.loadavg()[0].toFixed(2); 
    
    const ping = await getPing();
    const diskUsage = await getDiskUsage();
    const systemInfo = await getSystemInfo();
    const networkSpeed = await getNetworkSpeed();
    const temperature = await getTemperature();
    const dockerInfo = await getDockerInfo();
    const nodeVersion = await getNodeVersion();
    const systemUptime = await getSystemUptime();

    let uptimeMessage = `⏱️ BOT UPTIME\n`;
    uptimeMessage += `=======================\n`;
    uptimeMessage += `🕒 Thời gian online: ${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây\n`;
    uptimeMessage += `🖥️ Thời gian hệ điều hành đã hoạt động: ${systemUptime}\n`;
    uptimeMessage += `=======================\n`;
    uptimeMessage += `📊 Số lệnh đã thực thi: ${commandCount}\n`;
    uptimeMessage += `💾 Bộ nhớ sử dụng: ${memoryUsage.toFixed(2)} MB\n`;
    uptimeMessage += `⚙️ CPU Load: ${cpuLoad}%\n`;
    uptimeMessage += `=======================\n`;
    uptimeMessage += `🖥️ Hệ điều hành: ${systemInfo.platform} (${systemInfo.arch})\n`;
    uptimeMessage += `- Phiên bản: ${systemInfo.release}\n`;
    uptimeMessage += `- Tên máy: ${systemInfo.hostname}\n`;
    uptimeMessage += `- CPU Model: ${systemInfo.cpuModel} (${systemInfo.coreCount} core(s), ${systemInfo.cpuSpeed} MHz)\n`;
    uptimeMessage += `- Tải CPU: ${systemInfo.loadAverage.join(', ')}\n`;
    uptimeMessage += `- Dung lượng bộ nhớ: ${systemInfo.totalMemory} GB (Trên tổng ${systemInfo.totalMemory} GB)\n`;
    uptimeMessage += `- Bộ nhớ còn lại: ${systemInfo.freeMemory} GB\n`;
    uptimeMessage += `- Bộ nhớ đã sử dụng: ${systemInfo.usedMemory} GB\n`;
    uptimeMessage += `=======================\n`;
    uptimeMessage += `💽 Disk Usage:\n`;
    uptimeMessage += `- Total Disk: ${diskUsage.totalDisk}\n`;
    uptimeMessage += `- Used Disk: ${diskUsage.usedDisk}\n`;
    uptimeMessage += `- Available Disk: ${diskUsage.availableDisk}\n`;
    uptimeMessage += `- Usage Percentage: ${diskUsage.usagePercentage}\n`;
    uptimeMessage += `=======================\n`;
    uptimeMessage += `🌐 Network Speed:\n`;
    uptimeMessage += `- Ping: ${networkSpeed.ping}\n`;
    uptimeMessage += `- Download: ${networkSpeed.download}\n`;
    uptimeMessage += `- Upload: ${networkSpeed.upload}\n`;
    uptimeMessage += `=======================\n`;
    uptimeMessage += `🔥 Nhiệt độ hệ thống: ${temperature}\n`;
    uptimeMessage += `=======================\n`;
    uptimeMessage += `🐳 Docker Info:\n${dockerInfo}\n`;
    uptimeMessage += `=======================\n`;
    uptimeMessage += `🔢 Node.js Version: ${nodeVersion}\n`;

    const maxUptime = 86400000; 
    const uptimeBar = createProgressBar(maxUptime, uptime);
    uptimeMessage += `=======================\n📅 Progress đến 24h: ${uptimeBar}\n`;

    return api.sendMessage(uptimeMessage, threadID, messageID);
};

module.exports.handleCommand = function() {
    commandCount++;
};
