"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const refferal_controller_1 = __importDefault(require("../../../controllers/refferal-controller"));
module.exports = () => {
    const scene = new Scene('refferal');
    scene.enter(refferal_controller_1.default.enter);
    scene.action('go_exit', refferal_controller_1.default.toNavigation);
    return scene;
};
