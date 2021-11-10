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
const relations_service_1 = __importDefault(require("../services/relations-service"));
const profile_service_1 = __importDefault(require("../services/profile-service"));
const user_service_1 = __importDefault(require("../services/user-service"));
const display_controller_1 = __importDefault(require("../controllers/display-controller"));
const error_notification_1 = __importDefault(require("../exceptions/error-notification"));
exports.default = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (ctx.from) {
            const user = yield user_service_1.default.getUser(ctx.from.id);
            if (user) {
                if (user.daily_likes &&
                    Math.floor(Date.now() / 1000) - user.last_activity > 86400) {
                    user.daily_likes = 0;
                    yield user_service_1.default.updateDailyLikes(ctx.from.id, 0);
                    yield user_service_1.default.activityUpdate(ctx.from.id);
                }
                const profile = yield profile_service_1.default.getProfile(ctx.from.id);
                if (profile) {
                    ctx.session = {
                        profile,
                        city: profile.city,
                        citiesCache: [],
                        relations: (yield relations_service_1.default.getUserRelations(ctx.from.id)) || [],
                        daily_likes: user.daily_likes,
                    };
                    display_controller_1.default.getCandidates(ctx.session).catch((e) => (0, error_notification_1.default)(e));
                    const likes = yield relations_service_1.default.checkNewLikes(ctx.from.id);
                    likes && likes.length
                        ? ctx.scene.enter('likely', { is_first: true, likes })
                        : ctx.scene.enter('profile_menu');
                }
                else {
                    ctx.scene.enter('reg1');
                }
            }
            else {
                if (ctx.message) {
                    const rFriend = ctx.message.text.split(' ')[1];
                    if (rFriend) {
                        yield user_service_1.default.updateUserRefBonus(rFriend);
                    }
                }
                yield user_service_1.default.createUser(ctx.from.id);
                ctx.scene.enter('reg1');
            }
        }
    }
    catch (e) {
        ctx.reply('⚙️ Щось пішло не так, спробуй ще раз трохи пізніше');
        throw e;
    }
});
