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
const user_service_1 = __importDefault(require("../services/user-service"));
const Extra = require('telegraf/extra');
class RefferalController {
    enter(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            const refferals = yield user_service_1.default.getUserRefBonus(ctx.from.id);
            const quantity = refferals == 1 ? 'single' : 'multiple';
            const msg = ctx.i18n.t(`refferal.${quantity}`, { refferals });
            ctx.replyWithHTML(ctx.i18n.t('refferal.enter', {
                msg,
                likesq: refferals + 15,
            }), Extra.markup((m) => m.inlineKeyboard([
                [
                    m.urlButton('Відправити посилання 🥳', `https://t.me/share/url?url=t.me/ukrdatingbot?start=${ctx.from.id}`),
                ],
                [m.callbackButton('↩️ Повернутись назад', 'go_exit')],
            ])));
        });
    }
    toNavigation(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.scene.enter('swiper_nav');
        });
    }
}
exports.default = new RefferalController();
