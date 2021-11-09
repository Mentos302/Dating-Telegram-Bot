"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const city_1 = __importDefault(require("./city"));
const profile_1 = __importDefault(require("./profile"));
const relations_1 = __importDefault(require("./relations"));
exports.default = {
    User: user_1.default,
    City: city_1.default,
    Profile: profile_1.default,
    Relation: relations_1.default,
};
