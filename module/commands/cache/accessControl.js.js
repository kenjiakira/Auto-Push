const fs = require('fs');
const path = require('path');
const apiPath = path.join(__dirname, '..', '..', 'commands', 'json', 'cccd.json');

function readOrCreateData() {
    if (!fs.existsSync(apiPath)) {
        fs.writeFileSync(apiPath, JSON.stringify({}), 'utf8');
        return {}; 
    }
    let rawData;
    try {
        rawData = fs.readFileSync(apiPath, 'utf8');
        if (rawData.trim() === '') {
            return {};
        }
        return JSON.parse(rawData);
    } catch (error) {
        console.error('Lỗi khi phân tích tệp JSON:', error);
        return {}; 
    }
}

async function hasID(userID) {
    const data = readOrCreateData();
    return !!data[userID];
}

async function isBanned(userID) {
    const data = readOrCreateData();
    return data[userID] && data[userID].status === 'BAN';
}

module.exports = { hasID, isBanned };
