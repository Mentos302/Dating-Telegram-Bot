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
const error_notification_1 = __importDefault(require("../exceptions/error-notification"));
const profile_service_1 = __importDefault(require("../services/profile-service"));
const relations_service_1 = __importDefault(require("../services/relations-service"));
const Extra = require('telegraf/extra');
class ProfileController {
    sendProfile(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, age, city, descript, avatar } = ctx.session.profile;
                if (avatar.is_video) {
                    yield ctx.replyWithVideo(`${avatar.file_id}`, Extra.HTML()
                        .caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`)
                        .markup((m) => {
                        m.resize();
                    }));
                }
                else {
                    yield ctx.replyWithPhoto(`${avatar.file_id}`, Extra.HTML()
                        .caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`)
                        .markup((m) => {
                        m.resize();
                    }));
                }
                ctx.replyWithHTML(ctx.i18n.t('profile.main'), Extra.HTML().markup((m) => m.inlineKeyboard([
                    [
                        m.callbackButton('📋', 'prof_menu1'),
                        m.callbackButton('📸 ', 'prof_menu2'),
                        m.callbackButton('📝', 'prof_menu3'),
                    ],
                    [m.callbackButton(ctx.i18n.t('profile.goon'), 'prof_menu4')],
                ])));
            }
            catch (e) {
                throw new error_notification_1.default(`Unexpected error with profile sending`, e);
            }
        });
    }
    regAgain(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ctx.from)
                yield profile_service_1.default.deleteProfile(ctx.from.id);
            ctx.scene.enter('reg2');
        });
    }
    changeDesc(ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const description = ctx.message.text.replace(/\./g, ' ').replace(/@/g, ' ');
            if (ctx.from) {
                yield profile_service_1.default.changeDesc((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id, description);
                ctx.session.profile.descript = description;
                ctx.scene.enter('profile_menu');
            }
        });
    }
    changePhoto(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatar = {
                is_video: false,
                file_id: ctx.message.photo[0].file_id,
            };
            yield profile_service_1.default.changeAvatar(ctx.from.id, avatar);
            yield relations_service_1.default.deleteLikes(ctx.from.id);
            ctx.session.profile.avatar = avatar;
            ctx.scene.enter('profile_menu');
        });
    }
    changeVideo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatar = {
                is_video: true,
                file_id: ctx.message.video.file_id,
            };
            yield profile_service_1.default.changeAvatar(ctx.from.id, avatar);
            yield relations_service_1.default.deleteLikes(ctx.from.id);
            ctx.session.profile.avatar = avatar;
            ctx.scene.enter('profile_menu');
        });
    }
    toRegAgain(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.scene.enter(`reg2`);
        });
    }
    toChangeAvatar(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.scene.enter(`editavatar`);
        });
    }
    toChangeDescript(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.scene.enter(`editdescript`);
        });
    }
    toSwiper(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.scene.enter('swiper_main', { is_first: true });
        });
    }
    messageHandler(ctx) {
        ctx.scene.reenter();
    }
}
exports.default = new ProfileController();
