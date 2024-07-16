const sendButtonMessage = (api, threadID, text, buttons) => {
    const buttonTemplate = {
        attachment: {
            type: "template",
            payload: {
                template_type: "button",
                text: text,
                buttons: buttons
            }
        }
    };

    api.sendMessage(buttonTemplate, threadID, (err) => {
        if (err) console.error(`[ Button ] ${err.message}`);
    });
};

module.exports = sendButtonMessage;
