"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("./models"));
const connection_1 = __importDefault(require("./connection"));
const db = {
    connection: connection_1.default,
};
Object.keys(models_1.default).forEach((collectionName) => {
    db[collectionName] = connection_1.default.model(collectionName, models_1.default[collectionName]);
});
exports.default = db;
