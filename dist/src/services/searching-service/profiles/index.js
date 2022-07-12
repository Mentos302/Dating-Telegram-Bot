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
const getProfilesByCity_1 = __importDefault(require("./getProfilesByCity"));
const relationsFilter_1 = __importDefault(require("./relationsFilter"));
const compatibilityValidation_1 = __importDefault(require("./compatibilityValidation"));
exports.default = (liker, relations) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let profiles = yield (0, getProfilesByCity_1.default)(liker.chat_id, liker.candidateAge);
        if (relations === null || relations === void 0 ? void 0 : relations.length) {
            profiles = yield (0, relationsFilter_1.default)(profiles, relations);
        }
        const candidates = profiles.filter((e) => (0, compatibilityValidation_1.default)(liker, e));
        return candidates;
    }
    catch (e) {
        throw e;
    }
});
