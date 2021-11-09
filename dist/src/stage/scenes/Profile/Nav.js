"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const profile_controller_1 = __importDefault(require("../../../controllers/profile-controller"));
module.exports = () => {
    const scene = new Scene('profile_menu');
    scene.enter(profile_controller_1.default.sendProfile);
    scene.action('prof_menu1', profile_controller_1.default.regAgain);
    scene.action('prof_menu2', profile_controller_1.default.toChangeAvatar);
    scene.action('prof_menu3', profile_controller_1.default.toChangeDescript);
    scene.action('prof_menu4', profile_controller_1.default.toSwiper);
    scene.on('message', profile_controller_1.default.messageHandler);
    return scene;
};
