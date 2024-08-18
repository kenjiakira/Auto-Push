module.exports.config = {
    name: "reload",
    version: "1.0.0",
    hasPermission: 2, // Quyền admin hoặc cao hơn
    credits: "HNT",
    description: "Tải lại dữ liệu từ threadData.",
    commandCategory: "admin",
    usePrefix: true,
    usages: ".reload: Tải lại dữ liệu từ threadData.",
    cooldowns: 0
};

module.exports.run = async function({ api, event, Threads }) {
    const { threadID, messageID, senderID } = event;

    // Kiểm tra quyền của người gửi lệnh
    if (!global.config.ADMINBOT.includes(senderID)) {
        return api.sendMessage("Bạn không có quyền sử dụng lệnh này.", threadID, messageID);
    }

    try {
        // Tải lại dữ liệu từ Threads và threadData
        global.data.threadData = await Threads.getAll();

        return api.sendMessage("Đã tải lại dữ liệu thành công.", threadID, messageID);
    } catch (error) {
        console.error("Lỗi khi tải lại dữ liệu:", error);
        return api.sendMessage("Đã xảy ra lỗi khi tải lại dữ liệu. Vui lòng thử lại sau.", threadID, messageID);
    }
};
