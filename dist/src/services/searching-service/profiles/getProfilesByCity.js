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
const database_1 = __importDefault(require("../../../database"));
const error_notification_1 = __importDefault(require("../../../exceptions/error-notification"));
const { Profile } = database_1.default;
exports.default = (chat_id, city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cityProfiles = yield Profile.find({
            city,
            chat_id: { $ne: chat_id },
            is_active: true,
        });
        return cityProfiles;
    }
    catch (e) {
        throw new error_notification_1.default(`Unexpected error with profiles getting by city`, e);
    }
});
