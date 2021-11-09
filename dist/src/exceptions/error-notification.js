"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const index_1 = __importDefault(require("../../index"));
class BotError {
    constructor(msg, error) {
        this.msg = msg;
        this.error = error;
    }
    notificate() {
        console.log(this.error);
        index_1.default.telegram.sendMessage(process.env.ADMIN_ID, `<b>🚨 Увага нова помилка:</b>\n\n<code>${this.msg}\n\n${this.error}</code>`, telegraf_1.Extra.HTML());
    }
}
exports.default = BotError;
