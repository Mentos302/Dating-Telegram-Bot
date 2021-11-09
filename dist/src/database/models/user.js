"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userScheme = new mongoose_1.default.Schema({
    chat_id: {
        type: Number,
        required: true,
        unique: true,
    },
    last_activity: { type: String, default: Math.floor(Date.now() / 1000) },
    daily_likes: { type: Number, default: 0 },
    refbonus: { type: Number, default: 0 },
}, { versionKey: false });
exports.default = userScheme;
