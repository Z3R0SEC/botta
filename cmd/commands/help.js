module.exports = {
    name: 'cmd',
    role: 0,
    prefix: false,
    description: 'List Of Available CMDs'
};

module.exports.run = ({ api, event, commands }) => {
    let helpMessage = "•———— [ HI THERE ] ————•\n\n";
    Object.keys(commands).forEach(commandName => {
        const command = commands[commandName];
        helpMessage += `𝄆⥱${command.name}\n𝄆⥱${command.description}\n═════════════════\n`;
    });

    api.sendMessage(helpMessage, event.threadID);
};
