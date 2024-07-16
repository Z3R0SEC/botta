const logger = require("./logger");

module.exports = ({ api, event }) => {
    const messageText = event.body.toLowerCase();
    const threadID = event.threadID;
    const messageID = event.messageID;

    const reactions = [
        { text: ["hi", "hey", "hello","Thanks","unjani","good","well","ok"], reaction: "😚", body: "" },
        { text: ["fuck","lerete","mao","nya mao","stupid"], reaction: "💩", body: "Your Mouth Stinks" }
    ];

    for (const { text, reaction, body } of reactions) {
        if (text.some(t => messageText.includes(t))) {
            api.setMessageReaction(reaction, messageID, (err) => {
                if (err) {
                    logger(`Error React: ${err}`, "error");
                } else {
                    logger(`Reacted with "${reaction}" | "${text.join(", ")}"`, "info");
                }
            });

            if (body) {
                api.sendMessage(body, threadID, (err) => {
                    if (err) {
                        logger(`Error sending message: ${err}`, "error");
                    } else {
                        logger(`Sent message: "${body}" in response to "${text.join(", ")}"`, "info");
                    }
                });
            }

            break;
        }
    }
};
