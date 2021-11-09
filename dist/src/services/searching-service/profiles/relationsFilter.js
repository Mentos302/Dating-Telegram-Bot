"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_notification_1 = __importDefault(require("../../../exceptions/error-notification"));
exports.default = (profiles, relations) => {
    try {
        const filteredProfiles = profiles
            .filter((e) => !relations.some((el) => e.chat_id === el))
            .sort((a, b) => {
            return b.attraction - a.attraction;
        });
        return filteredProfiles;
    }
    catch (e) {
        throw new error_notification_1.default(`Unexpected error with relations filter`, e);
    }
};
