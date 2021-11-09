"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const relationScheme = new mongoose_1.default.Schema({
    host_id: {
        type: Number,
        required: true,
    },
    cli_id: {
        type: Number,
        required: true,
    },
    host_like: {
        type: Boolean,
        required: true,
    },
    cli_checked: {
        type: Boolean,
        required: true,
    },
    msg_text: {
        type: String,
    },
}, { versionKey: false });
exports.default = relationScheme;
