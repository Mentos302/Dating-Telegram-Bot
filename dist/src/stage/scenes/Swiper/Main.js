"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const swiper_controller_1 = __importDefault(require("../../../controllers/swiper-controller"));
module.exports = () => {
    const scene = new Scene('swiper_main');
    scene.enter(swiper_controller_1.default.enter);
    scene.action('yes', swiper_controller_1.default.choose);
    scene.action('no', swiper_controller_1.default.choose);
    scene.action('report', swiper_controller_1.default.report);
    scene.action('go_exit', swiper_controller_1.default.toNavigation);
    scene.action('toRefferal', swiper_controller_1.default.toRefferal);
    scene.on('message', swiper_controller_1.default.toNavigation);
    return scene;
};
