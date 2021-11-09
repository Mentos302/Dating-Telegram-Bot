"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const profile_controller_1 = __importDefault(require("../../../controllers/profile-controller"));
module.exports = () => {
    const scene = new Scene('editdescript');
    scene.enter((ctx) => ctx.replyWithHTML(ctx.i18n.t('reg.desc')));
    scene.on('text', profile_controller_1.default.changeDesc);
    scene.on('message', (ctx) => {
        ctx.replyWithHTML(ctx.i18n.t('reg.desc'));
    });
    return scene;
};
