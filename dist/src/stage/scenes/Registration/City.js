"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const reg_controller_1 = __importDefault(require("../../../controllers/reg-controller"));
module.exports = () => {
    const scene = new Scene('reg5');
    scene.enter(reg_controller_1.default.reqCity);
    scene.on('text', reg_controller_1.default.resCity);
    scene.on('message', (ctx) => ctx.scene.reenter('reg5'));
    return scene;
};
