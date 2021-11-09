"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const index_1 = __importDefault(require("../../index"));
const error_notification_1 = __importDefault(require("./error-notification"));
exports.default = (profile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, age, city, descript, avatar } = profile;
        yield index_1.default.telegram.sendMessage(process.env.ADMIN_ID, `<b>🚨 Увага профіль відключено через скарги: </b>ID <code>${profile.chat_id}</code>`, telegraf_1.Extra.HTML());
        avatar.is_video
            ? index_1.default.telegram.sendVideo(process.env.ADMIN_ID, `${profile.avatar.file_id}`, telegraf_1.Extra.caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`).HTML())
            : index_1.default.telegram.sendPhoto(process.env.ADMIN_ID, `${profile.avatar.file_id}`, telegraf_1.Extra.caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`).HTML());
    }
    catch (e) {
        throw new error_notification_1.default(`Unexpected error with report baned sending`, e);
    }
});
