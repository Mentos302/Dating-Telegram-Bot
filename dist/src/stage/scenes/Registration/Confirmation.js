"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const reg_controller_1 = __importDefault(require("../../../controllers/reg-controller"));
module.exports = () => {
    const scene = new Scene('reg9');
    scene.enter(reg_controller_1.default.reqConfirm);
    scene.action('well', reg_controller_1.default.resConfirm);
    scene.action('edit', reg_controller_1.default.resConfirm);
    scene.on('message', (ctx) => ctx.scene.reenter('reg9'));
    return scene;
};
