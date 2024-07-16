const axios = require("axios");

module.exports = {
    name: 'fact',
    role: 0,
    prefix: false,
    description: 'Get Random Fact'
};

module.exports.run = async ({ api, event }) => {
    try {
        const response = await axios.get("https://randomuselessfact.appspot.com/random.json?language=en");
        const fact = response.data;
        if (fact.text) {
           await api.sendMessage(fact.text, event.threadID, event.messageID);
           return;
        }

    } catch (err) {
        await api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
        return;
    }
};
