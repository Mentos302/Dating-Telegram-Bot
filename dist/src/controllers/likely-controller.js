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
const Extra = require('telegraf/extra');
class LikelyContoroller {
    constructor() {
        this.choose = (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            const { from, session, callbackQuery } = ctx;
            if (session.likely_candidates) {
                const { chat_id } = session.likely_candidates[0];
                let like = (callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.data) === 'yes';
                yield relations_service_1.default.updateLikely(chat_id, from.id);
                session.relations.push(chat_id);
                if (like) {
                    yield this.matchHandler(ctx, session.likely_candidates[0]);
                }
                else {
                    session.likely_candidates.shift();
                    if (session.likely_candidates.length) {
                        display_controller_1.default.showCandidates(ctx, session.likely_candidates[0]);
                    }
                    else {
                        ctx.scene.enter('swiper_nav');
                    }
                }
            }
        });
        this.matchHandler = this.matchHandler.bind(this);
    }
    enter(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { scene, session } = ctx;
            session.likely_candidates = [];
            for (const like of scene.state.likes) {
                const profile = yield profile_service_1.default.getProfile(like.host_id);
                session.likely_candidates.push(profile);
            }
            if (session.likely_candidates)
                display_controller_1.default.showCandidates(ctx, session.likely_candidates[0]);
        });
    }
    report(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            if (ctx.session.likely_candidates) {
                const { chat_id } = ctx.session.likely_candidates[0];
                yield profile_service_1.default.reportProfile(ctx.session.likely_candidates[0]);
                yield relations_service_1.default.updateLikely(ctx.from.id, chat_id);
                ctx.session.likely_candidates.shift();
                display_controller_1.default.showCandidates(ctx, ctx.session.likely_candidates[0]);
            }
        });
    }
    matchHandler(ctx, liked) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from, i18n, telegram, replyWithHTML } = ctx;
            replyWithHTML(`${i18n.t('likely.climatch')} <a href="tg://user?id=${liked.chat_id}">${liked.name}</a>`, Extra.markup((m) => m.inlineKeyboard([
                [m.callbackButton(i18n.t('likely.continue'), 'continue')],
            ])));
            if (from) {
                try {
                    yield telegram.sendMessage(liked.chat_id, `${i18n.t('likely.hostmatch')} <a href="tg://user?id=${from.id}">${from.first_name}</a>`, Extra.HTML().markup((m) => m.inlineKeyboard([
                        [m.callbackButton(i18n.t('likely.continue'), 'continue')],
                    ])));
                }
                catch (e) {
                    if (e.response && e.response.error_code === 403) {
                        profile_service_1.default.deleteProfile(liked.chat_id);
                    }
                    else {
                        console.log(e);
                        throw new Error('Unexpected error with match handler');
                    }
                }
            }
        });
    }
    continue(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            const candidates = ctx.session.likely_candidates;
            candidates === null || candidates === void 0 ? void 0 : candidates.shift();
            ctx.scene.state.is_first = true;
            if (candidates === null || candidates === void 0 ? void 0 : candidates.length) {
                display_controller_1.default.showCandidates(ctx, candidates[0]);
            }
            else {
                ctx.scene.enter('swiper_main', ctx.scene.state);
            }
        });
    }
    toNavigation(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.scene.enter('swiper_menu');
        });
    }
}
exports.default = new LikelyContoroller();
