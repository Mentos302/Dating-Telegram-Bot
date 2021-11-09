"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const botError_1 = __importDefault(require("../../../exceptions/botError"));
exports.default = (liker, liked) => {
    try {
        if (interestValidation(liker, liked) && ageValidation(liker, liked)) {
            return liked;
        }
        else {
            return false;
        }
    }
    catch (e) {
        throw new botError_1.default(`Unexpected error with compatibility validation`, e);
    }
};
const interestValidation = (liker, liked) => {
    if (liker.interest !== liked.gender && liker.interest !== 2) {
        return false;
    }
    if (liker.gender !== liked.interest && liked.interest !== 2) {
        return false;
    }
    return true;
};
const ageValidation = (liker, liked) => {
    let limit;
    liker.age < 18 ? (limit = 3) : (limit = 5);
    if (liked.age < liker.candidateAge || liked.age - liker.candidateAge > limit)
        return false;
    return true;
};
