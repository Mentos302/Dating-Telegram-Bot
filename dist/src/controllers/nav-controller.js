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
const relations_service_1 = __importDefault(require("../services/relations-service"));
const Extra = require('telegraf/extra');
class NavigationController {
    showMenu(ctx) {
        ctx.replyWithHTML(ctx.i18n.t('action.menu'), Extra.markup((m) => m.inlineKeyboard([
            [
                m.callbackButton(ctx.i18n.t('action.first'), 'profile'),
                m.callbackButton(ctx.i18n.t('action.second'), 'close'),
            ],
            [m.callbackButton(ctx.i18n.t('action.third'), 'continue')],
        ])));
    }
    closeConfirmation(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.replyWithHTML(ctx.i18n.t('close.main'), Extra.markup((m) => m.inlineKeyboard([
                m.callbackButton(ctx.i18n.t('close.confirm'), 'close_confirm'),
                m.callbackButton(ctx.i18n.t('close.reject'), 'go_back'),
            ])));
        });
    }
    closeProfile(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            yield profile_service_1.default.deleteProfile(ctx.from.id);
            yield relations_service_1.default.deleteAllActivities(ctx.from.id);
            ctx.replyWithHTML(ctx.i18n.t('close.bye'), Extra.markup((m) => m.inlineKeyboard([
                m.callbackButton(ctx.i18n.t('close.regagain'), 'rndmsht'),
            ])));
            ctx.scene.leave();
        });
    }
    toMainScene(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.scene.enter('swiper_main', { is_first: true });
        });
    }
    toProfileScene(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.answerCbQuery();
            ctx.scene.enter('profile_menu');
        });
    }
}
exports.default = new NavigationController();
