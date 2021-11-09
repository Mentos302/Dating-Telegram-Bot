"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const nav_controller_1 = __importDefault(require("../../../controllers/nav-controller"));
module.exports = () => {
    const scene = new Scene('swiper_nav');
    scene.enter(nav_controller_1.default.showMenu);
    scene.action('continue', nav_controller_1.default.toMainScene);
    scene.action('profile', nav_controller_1.default.toProfileScene);
    scene.action('close', nav_controller_1.default.closeConfirmation);
    scene.action('close_confirm', nav_controller_1.default.closeProfile);
    scene.action('go_back', nav_controller_1.default.showMenu);
    return scene;
};
