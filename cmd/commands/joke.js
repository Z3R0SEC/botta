const axios = require("axios");

module.exports = {
    name: 'joke',
    role: 0,
    prefix: false,
    description: 'just a random joke'
};

module.exports.run = async ({ api, event }) => {
    try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        const joke = response.data;
        await api.sendMessage(`${joke.setup}\n${joke.punchline}`, event.threadID, event.messageID);
    } catch (err) {
        await api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
};
