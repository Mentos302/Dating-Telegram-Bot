"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
exports.default = (bot, error) => {
    console.log(error);
    const errorMsg = JSON.stringify(error);
    bot.telegram.sendMessage(process.env.ADMIN_ID, `<b>🚨 Увага нова помилка:</b>\n\n<code>${errorMsg}</code>`, telegraf_1.Extra.HTML());
};
