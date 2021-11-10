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
const searching_service_1 = __importDefault(require("../services/searching-service"));
const error_notification_1 = __importDefault(require("../exceptions/error-notification"));
const Extra = require('telegraf/extra');
class DisplayController {
    constructor() {
        this.getCandidates = this.getCandidates;
        this.controlKeyboard = this.controlKeyboard;
    }
    showCandidates(ctx, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const { scene, session, replyWithPhoto, replyWithVideo } = ctx;
            let { is_first, likes } = scene.state;
            const candidates = session.candidates || [];
            if (!likes && candidates.length < 10 && !session.searchingNow) {
                this.getCandidates(session).catch((e) => (0, error_notification_1.default)(e));
            }
            if (profile && is_first) {
                profile.avatar.is_video
                    ? replyWithVideo(`${profile.avatar.file_id}`, this.controlKeyboard(ctx, profile))
                    : replyWithPhoto(`${profile.avatar.file_id}`, this.controlKeyboard(ctx, profile));
                scene.state = {};
            }
            else if (profile) {
                this.editMessage(ctx, profile);
            }
            else {
                return true;
            }
        });
    }
    getCandidates(session) {
        return __awaiter(this, void 0, void 0, function* () {
            session.searchingNow = true;
            const searching = yield (0, searching_service_1.default)(session);
            if (searching) {
                session.searchingNow = false;
                let { candidates, citiesCache } = searching;
                if (!citiesCache.length)
                    citiesCache = [];
                session.city = citiesCache[0];
                session.candidates = session.candidates
                    ? session.candidates.concat(candidates)
                    : candidates;
                session.citiesCache = citiesCache;
                candidates.forEach((e) => {
                    session.relations.push(e.chat_id);
                });
                if (session.candidates.length < 10) {
                    this.getCandidates(session).catch((e) => (0, error_notification_1.default)(e));
                }
            }
        });
    }
    controlKeyboard({ i18n }, profile) {
        const { name, age, city, descript } = profile;
        return Extra.markup((m) => {
            m.resize();
        })
            .caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`)
            .HTML()
            .markup((m) => m.inlineKeyboard([
            [
                m.callbackButton(i18n.t('action.like'), 'yes'),
                m.callbackButton(i18n.t('action.dislike'), 'no'),
            ],
            [
                m.callbackButton(i18n.t('action.report'), 'report'),
                m.callbackButton(i18n.t('action.exit'), 'go_exit'),
            ],
        ]));
    }
    editMessage({ i18n, editMessageMedia, editMessageCaption }, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, age, city, descript, avatar } = profile;
            const media = avatar.file_id;
            yield editMessageMedia(avatar.is_video ? { type: 'video', media } : { type: 'photo', media });
            editMessageCaption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`, Extra.markup((m) => {
                m.resize();
            })
                .HTML()
                .markup((m) => m.inlineKeyboard([
                [
                    m.callbackButton(i18n.t('action.like'), 'yes'),
                    m.callbackButton(i18n.t('action.dislike'), 'no'),
                ],
                [
                    m.callbackButton(i18n.t('action.report'), 'report'),
                    m.callbackButton(i18n.t('action.exit'), 'go_exit'),
                ],
            ])));
        });
    }
}
exports.default = new DisplayController();
