const axios = require("axios");

module.exports = {
    name: 'raaj',
    role: 0,
    prefix: false,
    description: 'ai Powered By Z3R0SEC'
};

module.exports.run = async ({ api, event }) => {
  try {
      const threadID = event.threadID;
      const message = event.body.split(' ').slice(1).join(' ');
      if (!message) {
         return api.sendMessage("Whats New ?")
      }

      const bot = "RaaJ Kumar";
      const uid = event.senderID;
      const name = "Thabane Mota";
      const bot_info = "Your Name Is Raaj Kumar You Are Designed to Assist Users With Various Type Of Coding";

      const c = `/v2?bot=${bot}&name=${name}&system=${bot_info}&uid=${uid}&prompt=${message}`;
      const app = `https://mota-dev.onrender.com/${c}`;

      const req = await axios.get(app);
      const res = req.data;

      if (res.reply) {
         api.sendMessage(res.reply, threadID);
         return;
      } else if (res.error) {
         api.sendMessage(res.error, threadID);
         return;
      }

      } catch (error) {
         console.log(`${error}`, `error`);
         api.sendMessage("Error processing request", threadID);
      }
};
