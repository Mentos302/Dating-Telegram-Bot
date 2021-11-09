"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cityScheme = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    profiles: {
        type: Number,
        default: 0,
    },
    lat: {
        type: String,
        required: true,
    },
    lng: {
        type: String,
        required: true,
    },
    distance: {
        type: Number,
    },
    cached_distances: {
        type: Array,
    },
}, { versionKey: false });
exports.default = cityScheme;
