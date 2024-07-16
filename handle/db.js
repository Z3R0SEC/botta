const fs = require("fs");
const path = require("path");

let db = {
    botAdmins: [],
    mode: "off",
    blockedUsers: []
};

const dbPath = path.join(__dirname, "data", "db.json");

const saveDb = () => {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

const loadDb = () => {
    if (fs.existsSync(dbPath)) {
        db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    }
};

loadDb();

const swearWords = ["mao", "lerete", "maretao", "fool", "stupid bot", "dump bot", "nya mao", "leave", "tsek", "futsek"];

module.exports = {
    updateBotAdmins: (newBotAdmins) => {
        db.botAdmins = newBotAdmins;
        saveDb();
    },
    setMode: (newMode) => {
        db.mode = newMode;
        saveDb();
    },
    getMode: () => {
        return db.mode;
    },
    checkForSwearing: async (message) => {
        const words = message.split(' ');
        for (let word of words) {
            if (swearWords.includes(word.toLowerCase())) {
                return true;
            }
        }
        return false;
    },
    blockUser: async (userID) => {
        if (!db.blockedUsers.includes(userID)) {
            db.blockedUsers.push(userID);
            saveDb();
        }
    },
    isBlocked: async (userID) => {
        return db.blockedUsers.includes(userID);
    }
};
