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
const display_controller_1 = __importDefault(require("./display-controller"));
const relations_service_1 = __importDefault(require("../services/relations-service"));
const profile_service_1 = __importDefault(require("../services/profile-service"));
const user_service_1 = __importDefault(require("../services/user-service"));
const Extra = require('telegraf/extra');
class SwiperController {
    constructor() {
        this.choose = (ctx) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            ctx.answerCbQuery();
            const { from, session, callbackQuery } = ctx;
            const { candidates } = session;
            if (candidates) {
                const { chat_id } = candidates[0];
                let like = (callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.data) === 'yes';
                if (like && session.daily_likes >= 15) {
                    yield ctx.reply(ctx.i18n.t('action.limit'), Extra.HTML().markup((m) => m.inlineKeyboard([
                        [m.callbackButton('📋 Запросити друзів', 'toRefferal')],
                        [m.callbackButton('↩️ Повернутись в меню', 'go_exit')],
                    ])));
                }
                else {
                    if (like) {
                        let likes = session.daily_likes ? session.daily_likes : 0;
                        likes++;
                        if (!(likes % 5) && ctx.from) {
                            yield user_service_1.default.updateDailyLikes((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id, likes);
                        }
                        yield this.sendLike(ctx, chat_id);
                    }
                    yield relations_service_1.default.newRelation(from.id, chat_id, like);
                    if (candidates.length) {
                        candidates.shift();
                    }
                    if (candidates.length) {
                        session.relations = session.relations || [];
                        display_controller_1.default.showCandidates(ctx, candidates[0]);
                    }
                    else {
                        yield ctx.reply(ctx.i18n.t('action.over'), Extra.HTML());
                        ctx.scene.enter('swiper_nav');
                    }
                }
            }
        });
        this.sendLike = this.sendLike.bind(this);
    }
    enter(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidates = ctx.session.candidates;
            if (candidates && candidates[0]) {
                const isOver = yield display_controller_1.default.showCandidates(ctx, candidates[0]);
                if (ctx.scene.state.is_first) {
                    ctx.scene.state.is_first = false;
                }
                if (isOver) {
                    yield ctx.reply(ctx.i18n.t('action.over'), Extra.HTML());
                    ctx.scene.enter('swiper_nav');
                }
            }
            else {
                ctx.reply(ctx.i18n.t('action.delay'), Extra.HTML());
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if ((_a = ctx.session.candidates) === null || _a === void 0 ? void 0 : _a.length) {
                        ctx.scene.state.is_first = true;
                        ctx.scene.reenter();
                    }
                    else {
                        yield ctx.reply(ctx.i18n.t('action.over'), Extra.HTML());
                        ctx.scene.enter('swiper_nav');
                    }
                }), 10000);
            }
        });
    }
    report(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            if (ctx.session.candidates) {
                const { chat_id } = ctx.session.candidates[0];
                yield profile_service_1.default.reportProfile(ctx.session.candidates[0]);
                yield relations_service_1.default.newRelation(ctx.from.id, chat_id, false);
                ctx.session.candidates.shift();
                display_controller_1.default.showCandidates(ctx, ctx.session.candidates[0]);
            }
        });
    }
    sendLike({ telegram, i18n }, chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const likes = yield profile_service_1.default.updateProfileLikes(chat_id);
            if (likes && likes % 3 === 0) {
                try {
                    yield telegram.sendMessage(chat_id, `${i18n.t('likely.alert1')} <b>${likes} ${i18n.t('likely.alert2')}</b>\n\n${i18n.t('likely.alert3')}`, Extra.HTML().markup((m) => m.inlineKeyboard([
                        m.callbackButton(i18n.t('likely.alertbtn'), 'rndmsht'),
                    ])));
                }
                catch (e) {
                    if (e.response && e.response.error_code === 403) {
                        profile_service_1.default.deleteProfile(chat_id);
                    }
                    else {
                        throw new Error(`Unexpected error with like sending`);
                    }
                }
            }
        });
    }
    toRefferal(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.scene.enter('refferal');
        });
    }
    toNavigation(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.scene.enter('swiper_nav');
        });
    }
}
exports.default = new SwiperController();
