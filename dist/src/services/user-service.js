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
const moment_1 = __importDefault(require("moment"));
const database_1 = __importDefault(require("../database"));
const { User } = database_1.default;
const relations_service_1 = __importDefault(require("./relations-service"));
const profile_service_1 = __importDefault(require("./profile-service"));
const error_notification_1 = __importDefault(require("../exceptions/error-notification"));
class UserService {
    getUser(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User.findOne({ chat_id });
                return user;
            }
            catch (e) {
                throw new error_notification_1.default(`Unexpected error with user getting`, e);
            }
        });
    }
    createUser(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User.create({
                    chat_id,
                    last_activity: (0, moment_1.default)().format('DD.MM.YYYY'),
                });
            }
            catch (e) {
                throw new error_notification_1.default(`Unexprected error with user creating`, e);
            }
        });
    }
    activityUpdate(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User.updateOne({ chat_id }, { last_activity: Math.floor(Date.now() / 1000) });
            }
            catch (e) {
                throw new error_notification_1.default(`Unexprected error with activity update`, e);
            }
        });
    }
    deleteUser(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User.deleteOne({ chat_id });
                relations_service_1.default.deleteAllActivities(chat_id);
                profile_service_1.default.deleteProfile(chat_id);
            }
            catch (e) {
                throw new error_notification_1.default(`Unexprected error with user removing`, e);
            }
        });
    }
    updateDailyLikes(chat_id, daily_likes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User.updateOne({ chat_id }, { daily_likes });
            }
            catch (e) {
                throw new error_notification_1.default(`Unexprected error with likes updating`, e);
            }
        });
    }
    getUserRefBonus(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refBonus = yield User.findOne({ chat_id }, { refbonus: 1, _id: 0 });
                return refBonus.refbonus;
            }
            catch (e) {
                throw new error_notification_1.default(`Unexprected error with ref bonus getting`, e);
            }
        });
    }
    updateUserRefBonus(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User.updateOne({ chat_id }, { $inc: { refbonus: 1 } });
            }
            catch (e) {
                throw new error_notification_1.default(`Unexprected error with ref bonus increasing`, e);
            }
        });
    }
}
exports.default = new UserService();
