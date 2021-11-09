"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profileScheme = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    chat_id: {
        type: Number,
        required: true,
    },
    gender: {
        type: Number,
        required: true,
    },
    interest: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    candidateAge: {
        type: Number,
        required: true,
    },
    descript: {
        type: String,
    },
    avatar: {
        type: Object,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    strikes: {
        type: Number,
        default: 0,
    },
    activities_block: {
        type: Boolean,
        default: false,
    },
    likes: {
        type: Number,
        default: 0,
    },
    attraction: {
        type: Number,
        default: 0,
    },
}, { versionKey: false });
exports.default = profileScheme;
