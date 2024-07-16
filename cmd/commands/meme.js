const axios = require("axios");

module.exports = {
    name: 'meme',
    role: 0,
    prefix: false,
    description: 'Get random meme'
};

module.exports.run = async ({ api, event }) => {
    try {
        const response = await axios.get("https://meme-api.herokuapp.com/gimme");
        const meme = response.data;

        await api.sendMessage({
            body: meme.title,
            attachment: await axios({
                url: meme.url,
                responseType: 'stream'
            }).then(response => response.data)
        }, event.threadID, event.messageID);
    } catch (err) {
        await api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
};
