
module.exports = {
  name: 'uid',
  role: 0,
  prefix: false,
  description: "Get User UID"
};

module.exports.run = async ({ api, event, args }) => {
   const uid = args[0];

   if (event.messageReply) {
      const userID = event.messageReply.senderID;
   } else if (!event.messageReply) {
      const userID = event.senderID;
   } else {
      const userID = "Couldn't Get user ID";
   }
   api.sendMessage(`[UID] ${userID}`, event.messageID, event.threadID);
};
