"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const reg_controller_1 = __importDefault(require("../../../controllers/reg-controller"));
module.exports = () => {
    const scene = new Scene('reg4');
    scene.enter(reg_controller_1.default.reqSex);
    scene.on('callback_query', reg_controller_1.default.resSex);
    scene.on('message', reg_controller_1.default.resCandidateAge);
    return scene;
};
