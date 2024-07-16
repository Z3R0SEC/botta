module.exports = {
    name: 'test',
    role: 0,
    prefix: true,
    description: 'testing Command.'
};

module.exports.run = ({ api, event, args }) => {
    const you = args.join(" ");
    if (!you) {
        return api.sendMessage("Message please", event.threadID);
    }
    if (you) {
        return api.sendMessage(you, event.threadID);
    }
};
