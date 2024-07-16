const fs = require("fs");
const login = require("fca-unofficial");
const path = require("path");
const express = require("express");
const colors = require("colors");

const config = require("./config.json");
const handleCommand = require("./handle/handleCommand");
const handleReaction = require("./handle/handleReaction");
const logger = require("./handle/logger");

const swapper = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

console.clear();
const commands = {};
const { prefix, botName, botAdminName } = config;

const inf = "════ 〘 IMPORTANT 〙 ════";
console.log(`\n${inf.red}`);
logger("Get Updates On Our Page", "info");
logger("https://facebook.com/Mothalicious", "info");

console.log("\n════ 〘 COMMANDS 〙 ════");
fs.readdirSync(path.join(__dirname, 'cmd/commands')).forEach(file => {
    if (path.extname(file) === ".js") {
        try {
            const command = require(`./cmd/commands/${file}`);
            if (command.name && command.run) {
                commands[command.name.toLowerCase()] = command;
                logger(`${command.name}`, "load");
            } else if (!command.prefix) {
                logger(`${file} Doesnt Have Prefix property`, "error");
            } else {
                logger(`${file} Doesnt Have Name Or Run Func`, "error");
            }
        } catch (error) {
            logger(`${file} ${error.message}`, "error");
        }
    }
});

console.log("\n════ 〘 STARTING BOT 〙 ════");
login({ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) }, (err, api) => {
    if (err) {
        logger("Couldn't Find Bot AppState", "error");
        return;
    }

    logger("Found Bot AppState", "load");
    logger("Started BOT Server...", "info");

    api.getCurrentUserID((err, botID) => {
        if (err) {
            logger("Error retrieving bot ID", "error");
        } else {
            api.getUserInfo(botID, (err, userInfo) => {
                if (err) {
                    logger("Error retrieving bot info", "error");
                } else {
                    const botName = userInfo[botID].name;
                    const botInfo = `Bot Name: ${botName}\nBot ID: ${botID}\nPrefix: ${prefix}\nAdmin: ${botAdminName}`;
                    logger(`\n════ 〘 BOT INFO 〙 ════\n${botInfo}`, "info");
                }
            });
        }
    });

    api.setOptions({ listenEvents: true });

    const listenEmitter = api.listen((err, event) => {
        if (err) return logger(err.error, "error");

        if (event.type === "message") {
            handleCommand({ api, event, commands, config });
            handleReaction({ api, event }); // Call handleReaction for message events
        } else if (event.type === "event") {
            const eventFile = path.join(__dirname, 'cmd/events', `${event.logMessageType}.js`);
            if (fs.existsSync(eventFile)) {
                const eventHandler = require(eventFile);
                eventHandler.run({ api, event, config });
            }
        }
    });

    console.log("───────────────────────────────────");
    setInterval(() => {
        api.getCurrentUserID((err, userID) => {
            if (err) {
                logger("Error with keep-alive", "error");
            } else {
                logger(`Keep-alive check for user: ${userID}`, "info");
            }
        });
    }, 10 * 60 * 1000);
});

process.noDeprecation = true;
process.traceDeprecation = true;
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning') {
        return;
    }
});

const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./handle/data/index.html"));
});

app.listen(5635, () => {
    return;
});
