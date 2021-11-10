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
const profile_service_1 = __importDefault(require("../services/profile-service"));
const display_controller_1 = __importDefault(require("./display-controller"));
const Extra = require('telegraf/extra');
class RegController {
    greeting(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.replyWithHTML(ctx.i18n.t('reg.greeting'), Extra.markup((m) => m.inlineKeyboard([m.callbackButton(ctx.i18n.t('yes'), 'okay')])));
        });
    }
    regStart(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.scene.enter('reg2');
        });
    }
    reqAge({ reply, i18n }) {
        reply(i18n.t('reg.age'), Extra.HTML());
    }
    resAge({ scene, i18n, message, replyWithHTML }) {
        const age = message.text;
        isNaN(parseInt(age === null || age === void 0 ? void 0 : age.trim()))
            ? replyWithHTML(i18n.t('reg.age_error'))
            : scene.enter(`reg3`, { age });
    }
    reqGender({ replyWithHTML, i18n }) {
        replyWithHTML(i18n.t('reg.sex'), Extra.markup((m) => m.inlineKeyboard([
            m.callbackButton(i18n.t('reg.sex_boy'), 'boy'),
            m.callbackButton(i18n.t('reg.sex_girl'), 'girl'),
        ])));
    }
    resGenderMale(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.scene.enter('reg4', Object.assign(Object.assign({}, ctx.scene.state), { gender: 1 }));
        });
    }
    resGenderFemale(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.scene.enter('reg4', Object.assign(Object.assign({}, ctx.scene.state), { gender: 0 }));
        });
    }
    reqSex({ replyWithHTML, i18n }) {
        replyWithHTML(i18n.t('reg.int'), Extra.markup((m) => m.inlineKeyboard([
            m.callbackButton(i18n.t('reg.int_boys'), 'boys'),
            m.callbackButton(i18n.t('reg.int_girls'), 'girls'),
            m.callbackButton(i18n.t('reg.int_both'), 'both'),
        ])));
    }
    resSex(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let sex;
            switch (ctx.callbackQuery.data) {
                case 'girls':
                    sex = 0;
                    break;
                case 'boys':
                    sex = 1;
                    break;
                case 'both':
                    sex = 2;
                    break;
            }
            ctx.scene.state.interest = sex;
            ctx.reply(ctx.i18n.t('reg.candidateage'), Extra.HTML());
        });
    }
    resCandidateAge(ctx) {
        var _a;
        const candidateAge = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
        candidateAge && !isNaN(parseInt(candidateAge))
            ? ctx.scene.enter('reg5', Object.assign(Object.assign({}, ctx.scene.state), { candidateAge }))
            : ctx.reply(ctx.i18n.t('reg.age_error'), Extra.HTML());
    }
    reqCity(ctx) {
        ctx.replyWithHTML(ctx.i18n.t('reg.city'));
    }
    resCity(ctx) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            ctx.scene.enter('reg6', Object.assign(Object.assign({}, ctx.scene.state), { city: (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text }));
            ctx.session = {
                profile: Object.assign(Object.assign({}, ctx.scene.state), { city: (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text }),
                city: (_c = ctx.message) === null || _c === void 0 ? void 0 : _c.text,
                citiesCache: [],
                relations: [],
            };
            yield display_controller_1.default.getCandidates(ctx.session);
        });
    }
    reqName({ replyWithHTML, i18n }) {
        replyWithHTML(i18n.t('reg.name'), Extra.markup((m) => m.inlineKeyboard([
            m.callbackButton(i18n.t('reg.name_btn'), 'first_name'),
        ])));
    }
    resName({ message, scene }) {
        scene.enter('reg7', Object.assign(Object.assign({}, scene.state), { name: message === null || message === void 0 ? void 0 : message.text }));
    }
    resNameDefault(ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            ctx.scene.enter('reg7', Object.assign(Object.assign({}, ctx.scene.state), { name: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.first_name }));
        });
    }
    reqDesc({ replyWithHTML, i18n }) {
        replyWithHTML(i18n.t('reg.desc'), Extra.markup((m) => m.inlineKeyboard([m.callbackButton(i18n.t('reg.desc_skip'), 'skip')])));
    }
    resDescSkip(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.scene.enter('reg8', Object.assign(Object.assign({}, ctx.scene.state), { descript: `` }));
        });
    }
    resDesc({ message, scene }) {
        let linkFilter = message === null || message === void 0 ? void 0 : message.text.replace(/\./g, ' ').replace(/@/g, ' ');
        scene.enter('reg8', Object.assign(Object.assign({}, scene.state), { descript: linkFilter }));
    }
    reqAvatar({ replyWithHTML, i18n }) {
        replyWithHTML(i18n.t('reg.avatar'));
    }
    resAvatarPhoto({ message, scene }) {
        scene.enter('reg9', Object.assign(Object.assign({}, scene.state), { avatar: {
                file_id: message === null || message === void 0 ? void 0 : message.photo[0].file_id,
            } }));
    }
    resAvatarVideo({ message, scene }) {
        scene.enter('reg9', Object.assign(Object.assign({}, scene.state), { avatar: {
                file_id: message === null || message === void 0 ? void 0 : message.video.file_id,
                is_video: true,
            } }));
    }
    reqConfirm({ scene, replyWithVideo, replyWithPhoto, replyWithHTML, i18n, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, age, city, descript, avatar } = scene.state;
            if (avatar.is_video) {
                yield replyWithVideo(`${avatar.file_id}`, Extra.markup((m) => {
                    m.resize();
                })
                    .caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`)
                    .HTML());
            }
            else {
                yield replyWithPhoto(`${avatar.file_id}`, Extra.markup((m) => {
                    m.resize();
                })
                    .caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`)
                    .HTML());
            }
            replyWithHTML(i18n.t('reg.conf'), Extra.markup((m) => m.inlineKeyboard([
                m.callbackButton(i18n.t('reg.well'), 'well'),
                m.callbackButton(i18n.t('reg.edit'), 'edit'),
            ])));
        });
    }
    resConfirm(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from, scene, session, callbackQuery } = ctx;
            const userProfile = Object.assign(Object.assign({}, scene.state), { chat_id: from === null || from === void 0 ? void 0 : from.id });
            session.profile = userProfile;
            profile_service_1.default.createProfile(userProfile);
            callbackQuery.data === 'well'
                ? scene.enter('swiper_main', { is_first: true })
                : scene.enter('profile_menu');
        });
    }
}
exports.default = new RegController();
