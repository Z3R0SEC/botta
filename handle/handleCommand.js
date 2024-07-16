const { botAdmins, prefix } = require("../config.json");
const logger = require("./logger");
const db = require("./db");

const getGroupAdmins = async (api, threadID) => {
    return new Promise((resolve, reject) => {
        api.getThreadInfo(threadID, (err, info) => {
            if (err) return reject(err);
            resolve(info.adminIDs.map(admin => admin.id));
        });
    });
};

module.exports = async ({ api, event, commands, config }) => {
    const messageText = event.body;
    const threadID = event.threadID;
    const senderID = event.senderID;

    const containsSwearing = await db.checkForSwearing(messageText);
    if (containsSwearing) {
        api.sendMessage("You have been blocked for using inappropriate language.\n\n'This is a serious action.'\n\nTo request a review and potentially regain access, please visit: https://mota-dev.onrender.com/appeal\n\n>> Type ? Ignore All", threadID);
        db.blockUser(senderID);
        logger(`User ${senderID} Blocked.`, "warn");
        return;
    }

    const isBlocked = await db.isBlocked(senderID);
    if (isBlocked) {
        logger(`Ignored: ${senderID}.`, "msg");
        return;
    }

    const lowerCaseMessageText = messageText.toLowerCase();

    let commandName, args;
    if (lowerCaseMessageText.startsWith(prefix)) {
        commandName = lowerCaseMessageText.slice(prefix.length).split(' ')[0];
        args = lowerCaseMessageText.slice(prefix.length + commandName.length).trim().split(' ');
    } else {
        commandName = lowerCaseMessageText.split(' ')[0];
        args = lowerCaseMessageText.slice(commandName.length).trim().split(' ');
    }

    const command = commands[commandName];
    if (!command) {
        return;
    }

    if (command.prefix && !lowerCaseMessageText.startsWith(prefix)) {
        logger(`EXEC: ${commandName} without prefix`, "warn");
        api.sendMessage("[❌] This command requires a prefix.", threadID);
        return;
    }

    if (!command.prefix && lowerCaseMessageText.startsWith(prefix)) {
        logger(`EXEC: ${commandName} No Prefix Cmd`, "warn");
        api.sendMessage("[❌] This command does not use a prefix.", threadID);
        return;
    }
    logger(command.name, "msg");
    logger(senderID, "msg");
    console.log("────────────────────────────────");
    const botMode = db.getMode();
    if (botMode === "only" || botMode === "on" && !botAdmins.includes(senderID)) {
        api.sendMessage("[❌] The bot is in admin-only mode.", threadID);
        return;
    } else if (botMode === "off") {
        const name = "";
    }

    if (command.role > 0) {
        const groupAdmins = await getGroupAdmins(api, threadID);
        if (command.role === 1 && !groupAdmins.includes(senderID) && !botAdmins.includes(senderID)) {
            api.sendMessage("[❌] This command can only be used by group admins.", threadID);
            return;
        }
        if (command.role === 2 && !botAdmins.includes(senderID)) {
            api.sendMessage("[❌] This command can only be used by bot admins.", threadID);
            return;
        }
    }

    api.markAsRead(threadID, (err) => {
        if (err) logger(err, "error");
    });

    (async () => {
        try {
            await command.run({ api, event, args, commands });
        } catch (error) {
            logger(error, "error");
            api.sendMessage("[❌] Error processing request", threadID);
        }
    })();
};
