const colors = require("colors");
const moment = require("moment-timezone");

module.exports = (message, type, error = null) => {
    const timestamp = moment().tz("Africa/Johannesburg").format("HH:mm");
    const types = {
        info: colors.blue,
        success: colors.green,
        warn: colors.yellow,
        error: colors.red,
        credits: colors.orange,
        msg: colors.blue,
        load: colors.yellow
    };

    console.log(`[${timestamp}] [ ${type.toUpperCase().yellow} ] ${types[type](message)}`);
    if (error) {
        console.error(error);
    }
};
