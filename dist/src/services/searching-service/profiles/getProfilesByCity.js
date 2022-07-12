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
const botError_1 = __importDefault(require("../../../exceptions/botError"));
const { Profile } = database_1.default;
exports.default = (chat_id, candidateAge) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let profiles = yield Profile.find({
            candidateAge: { $gt: candidateAge - 1 },
            chat_id: { $ne: chat_id },
            is_active: true,
        });
        return profiles;
    }
    catch (e) {
        throw new botError_1.default(`Unexpected error with profiles getting by city`, e);
    }
});
