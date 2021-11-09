"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const reg_controller_1 = __importDefault(require("../../../controllers/reg-controller"));
module.exports = () => {
    const scene = new Scene('reg6');
    scene.enter(reg_controller_1.default.reqName);
    scene.action('first_name', reg_controller_1.default.resNameDefault);
    scene.on('text', reg_controller_1.default.resName);
    scene.on('message', (ctx) => ctx.scene.reenter('reg6'));
    return scene;
};
