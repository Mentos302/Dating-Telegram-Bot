"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const reg_controller_1 = __importDefault(require("../../../controllers/reg-controller"));
module.exports = () => {
    const scene = new Scene('reg8');
    scene.enter(reg_controller_1.default.reqAvatar);
    scene.on('photo', reg_controller_1.default.resAvatarPhoto);
    scene.on('video', reg_controller_1.default.resAvatarVideo);
    scene.on('message', (ctx) => ctx.scene.reenter('reg8'));
    return scene;
};
