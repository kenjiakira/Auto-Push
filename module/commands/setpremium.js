        const fs = require("fs-extra");
        const path = require("path");

        const usageFilePath = path.resolve(__dirname, 'json', 'premium.json');

        const readUsageData = async () => {
        try {
            if (await fs.pathExists(usageFilePath)) {
            return await fs.readJson(usageFilePath);
            } else {
            return {};
            }
        } catch (error) {
            console.error("Lỗi khi đọc tệp dữ liệu sử dụng:", error);
            return {};
        }
        };

        const saveUsageData = async (data) => {
        try {
            await fs.writeJson(usageFilePath, data, { spaces: 2 });
        } catch (error) {
            console.error("Lỗi khi ghi tệp dữ liệu sử dụng:", error);
        }
        };

        module.exports = {
        config: {
            name: "setpremium",
            version: "1.0.0",
            hasPermission: 0,
            credits: "HNT",
            description: "Thay đổi trạng thái Premium của người dùng.",
            usePrefix: true,
            commandCategory: "admin",
            usages: "setpremium [UID] [true/false]",
            cooldowns: 0,
            dependencies: {
            "fs-extra": ""
            }
        },

        run: async function({ api, event, args }) {
            const { threadID, messageID } = event;
            const [uid, premiumStatus] = args;

            if (!uid || (premiumStatus !== 'true' && premiumStatus !== 'false')) {
            return api.sendMessage("Vui lòng nhập cú pháp đúng: `setpremium [UID] [true/false]`", threadID, messageID);
            }

            try {
            const usageData = await readUsageData();
            const isPremium = premiumStatus === 'true';

            if (!usageData[uid]) {
                usageData[uid] = { lastUsedDate: null, count: 0, isPremium: isPremium };
            } else {
                usageData[uid].isPremium = isPremium;
            }

            await saveUsageData(usageData);

            return api.sendMessage(`Trạng thái Premium của người dùng ${uid} đã được cập nhật thành ${premiumStatus}.`, threadID, messageID);
            } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái Premium:", error);
            return api.sendMessage("Đã xảy ra lỗi khi cập nhật trạng thái Premium. Vui lòng thử lại sau.", threadID, messageID);
            }
        }
        };
