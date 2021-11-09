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
const database_1 = __importDefault(require("../database"));
const botError_1 = __importDefault(require("../exceptions/botError"));
const newProfile_notification_1 = __importDefault(require("../exceptions/newProfile-notification"));
const report_notification_1 = __importDefault(require("../exceptions/report-notification"));
const { Profile, City } = database_1.default;
class ProfileService {
    getProfile(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = Profile.findOne({ chat_id });
                return profile;
            }
            catch (e) {
                throw new botError_1.default(`Unexpected error with profile getting`, e);
            }
        });
    }
    createProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Profile.create(data);
                yield City.updateOne({ city_name: data.city }, { $inc: { profiles: 1 } });
                yield (0, newProfile_notification_1.default)(data);
            }
            catch (e) {
                throw new botError_1.default(`Profile creating error`, e);
            }
        });
    }
    deleteProfile(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Profile.deleteOne({ chat_id });
            }
            catch (e) {
                throw new botError_1.default(`Unexpected error with profile deleting`, e);
            }
        });
    }
    changeAvatar(chat_id, avatar) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Profile.updateOne({ chat_id }, { avatar });
            }
            catch (e) {
                throw new botError_1.default(`Unexprected error with avatar changing`, e);
            }
        });
    }
    changeDesc(chat_id, decsript) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Profile.updateOne({ chat_id }, { decsript });
            }
            catch (e) {
                throw new botError_1.default(`Unexprected error with desc changing`, e);
            }
        });
    }
    updateProfileLikes(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield Profile.findOneAndUpdate({ chat_id }, { $inc: { likes: 1 } }, { new: true, useFindAndModify: false });
                yield Profile.updateOne({ chat_id }, { $inc: { attraction: 1 } });
                return profile.likes;
            }
            catch (e) {
                throw new botError_1.default(`Unexprected error with user likes updating`, e);
            }
        });
    }
    reportProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            let { chat_id, strikes } = profile;
            try {
                if (strikes > 2) {
                    yield Profile.updateOne({ chat_id }, { is_active: false });
                    (0, report_notification_1.default)(profile);
                }
                else {
                    strikes++;
                    yield Profile.updateOne({ chat_id }, { strikes });
                }
            }
            catch (e) {
                throw new botError_1.default(`Unexpected error with profile reporting`, e);
            }
        });
    }
}
exports.default = new ProfileService();
