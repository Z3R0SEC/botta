const axios = require("axios");

module.exports = {
  name: "ai",
  role: 0,
  prefix: false,
  description: "Chat With GPT-4o"
};

module.exports.run = async ({ api, event, args }) => {
  const text = args.join(" ");
  const senderID = event.senderID;

     const url = `https://mota-dev.onrender.com/ai?id=${senderID}&prompt=${text}`;
     const req = await axios.get(url);
     const res = req.data;
     if (res.reply) {
        const resp = res.reply;
        return api.sendMessage(resp, event.threadID, event.messageID);
     }

     if (res.error) {
        const resp = res.error;
        console.info(error);
        return api.sendMessage(resp, event.threadID, event.messageID);
     }

};
