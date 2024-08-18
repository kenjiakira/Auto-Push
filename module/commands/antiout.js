module.exports.config = {
    name: "antiout",
    version: "1.1.1",
    hasPermission: 0,
    credits: "DC-Nam",
    description: "Bật/tắt chống out chùa",
    commandCategory: "Box chat",
    usePrefix: true,
    usages: ".antiout: Bật hoặc tắt chế độ chống out cho nhóm. Khi bạn chạy lệnh này, bot sẽ thay đổi trạng thái chống out và gửi một tin nhắn thông báo về trạng thái đã thay đổi.\n\nVí dụ:\n\n- Nếu trạng thái chống out đang bật, khi bạn chạy lệnh .antiout, bot sẽ tắt chế độ chống out và thông báo \"Đã tắt chế độ chống out nhóm\".\n- Nếu trạng thái chống out đang tắt, khi bạn chạy lệnh .antiout, bot sẽ bật chế độ chống out và thông báo \"Đã bật chế độ chống out nhóm\".",
    cooldowns: 0
};

module.exports.run = async function({ api, event, args, Threads }) {
    const { threadID, messageID, senderID } = event;

    // Lấy thông tin nhóm
    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

    // Kiểm tra nếu người gửi lệnh là admin
    if (!adminIDs.includes(senderID)) {
        return api.sendMessage("Bạn không có quyền sử dụng lệnh này. Chỉ admin nhóm mới có thể thực hiện lệnh này.", threadID, messageID);
    }

    let getDataThread = await Threads.getData(threadID) || {};
    const { data } = getDataThread;

    if (typeof data.antiout === "undefined") {
        data.antiout = {
            status: true,
            storage: []
        };
        await Threads.setData(threadID, { data });
        await global.data.threadData.set(threadID, data);
    }

    const status = data.antiout.status ? false : true;
    data.antiout.status = status;

    await Threads.setData(threadID, { data });
    await global.data.threadData.set(threadID, data);

    const msg = `» Đã ${status ? "bật" : "tắt"} chế độ chống out nhóm`;
    return api.sendMessage(msg, threadID, messageID);
};
