"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const likely_controller_1 = __importDefault(require("../../../controllers/likely-controller"));
module.exports = () => {
    const scene = new Scene('likely');
    scene.enter(likely_controller_1.default.enter);
    scene.action('yes', likely_controller_1.default.choose);
    scene.action('no', likely_controller_1.default.choose);
    scene.action('report', likely_controller_1.default.report);
    scene.action('go_exit', likely_controller_1.default.toNavigation);
    scene.action('continue', likely_controller_1.default.continue);
    scene.on('message', likely_controller_1.default.toNavigation);
    return scene;
};
