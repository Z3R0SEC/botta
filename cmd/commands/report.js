const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  name: "report",
  role: 0,
  prefix: false,
  description: "Report Bot Errors"
};

module.exports.run = async ({ api, event, args }) => {
  const userID = event.userID;
  const time = moment().tz("Africa/Johannesburg").format("HH:mm");
  const error = args.join(" ");
  if (!error) {
      return api.sendMessage("Usage: report Dear Dev i want to report that ...", event.threadID);
  }

  const root = "https://mota-dev.onrender.com";
  const endpoint = `/report?id=${userID}&error=${error}`;

  try {
     const req = await axios.get(`${root}${endpoint}`);
     const res = req.data;
     if (res.success) {
        let resp = `[ ID ] ${userID}\n[ TIME ] ${time}\n[ STATUS ] ${res.message}`;
        api.sendMessage(resp, event.threadID);
        return;
     }

     if (res.error) {
        let resp = res.error;
        api.sendMessage(resp, event.threadID);
        return;
     }

  } catch (err) {
      logger(err, "error");
      api.sendMessage(`Catched Error: ${err}`, event.threadID);
      return;
  }
};
