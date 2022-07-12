"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scene = require('telegraf/scenes/base');
const admin_controller_1 = __importDefault(require("../../../controllers/admin-controller"));
module.exports = () => {
    const scene = new Scene('admin_spam');
    scene.enter(admin_controller_1.default.enter);
    scene.on('message', admin_controller_1.default.sendMessage);
    return scene;
};
