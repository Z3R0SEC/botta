const db = require("../../handle/db");
const { botAdmins } = require("../../config.json");

module.exports = {
    name: 'admin',
    role: 2,
    prefix: true,
    description: 'Bot Manage command'
};

module.exports.run = async ({ api, event, args }) => {
    const threadID = event.threadID;
    const senderID = event.senderID;

    if (args.length < 2) {
        return api.sendMessage("[❌] Usage: admin add/remove @mention or userID, or admin mode only / off", threadID);
    }

    const action = args[0].toLowerCase();
    const target = args[1];
    const mentionedUsers = Object.keys(event.mentions);

    if (action === "mode") {
        const mode = args[1].toLowerCase();
        if (["only", "chat-mode", "on", "off"].includes(mode)) {
            await db.setMode(mode);
            api.sendMessage(`[✅] Bot mode set to ${mode}.`, threadID);
        } else {
            api.sendMessage("[❌] Invalid mode. Use 'admin-only', 'chat-mode on', or 'chat-mode off'.", threadID);
        }
        return;
    }

    let userID;
    if (mentionedUsers.length > 0) {
        userID = mentionedUsers[0];
    } else if (event.messageReply) {
        userID = event.messageReply.senderID;
    } else {
        userID = target;
    }

    if (!userID) {
        return api.sendMessage("[❌] Please provide a user to add or remove as admin.", threadID);
    }

    if (action === "add") {
        if (!botAdmins.includes(userID)) {
            botAdmins.push(userID);
            db.updateBotAdmins(botAdmins);
            return api.sendMessage(`[✅] User ${userID} has been added as bot admin.`, threadID);
        } else {
            return api.sendMessage(`[❌] User ${userID} is already a bot admin.`, threadID);
        }
    } else if (action === "remove" || action === "rm") {
        const index = botAdmins.indexOf(userID);
        if (index > -1) {
            botAdmins.splice(index, 1);
            db.updateBotAdmins(botAdmins);
            return api.sendMessage(`[✅] User ${userID} has been removed as bot admin.`, threadID);
        } else {
            return api.sendMessage(`[❌] User ${userID} is not a bot admin.`, threadID);
        }
    } else {
        return api.sendMessage("[❌] Invalid action. Use 'add' or 'remove'.", threadID);
    }
};
