const axios = require("axios");
const logger = require("../../handle/logger");

module.exports = {
  name: "dalle",
  role: 0,
  prefix: false,
  description: "AI Generated Photos"
};

module.exports.run = async ({ api, event, args }) => {
  const info = args.join(" ");
  const threadID = event.threadID;

  if (!info) {
    await api.sendMessage("Usage: dalle <info>", threadID);
    return;
  }

  try {
    const app = `https://mota-dev.onrender.com/dalle?prompt=${info}`;
    const req = await axios.get(app);
    const res = req.data;
    if (res.image) {
      const imageStream = await axios({ url: res.image, responseType: 'stream' }).then(response => response.data);
      return await api.sendMessage({ body: `Generated: ${info}`, attachment: imageStream }, event.threadID, event.messageID);
    } else {
      await api.sendMessage("❌ No URL found in response.", threadID);
      return logger(res, "info");
    }
  } catch (error) {
    await api.sendMessage(`❌ Error: ${error.message}`, threadID);
    logger(error, "error");
  }
};
