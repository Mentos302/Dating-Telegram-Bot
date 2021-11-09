"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Stage = require('telegraf/stage');
exports.default = (bot) => {
    const GreetingScene = require('./scenes/Registration/Greeting')();
    const AgeScene = require('./scenes/Registration/Age')();
    const GenderScene = require('./scenes/Registration/Gender')();
    const CandidateScene = require('./scenes/Registration/Candidate')();
    const CityScene = require('./scenes/Registration/City')();
    const NameScene = require('./scenes/Registration/Name')();
    const DescScene = require('./scenes/Registration/Desc')();
    const AvatarScene = require('./scenes/Registration/Avatar')();
    const ConfirmScene = require('./scenes/Registration/Confirmation')();
    const ProfileNavScene = require('./scenes/Profile/Nav')();
    const EditAvatarScene = require('./scenes/Profile/EditAvatar')();
    const EditDescScene = require('./scenes/Profile/EditDesc')();
    const ActionMain = require('./scenes/Swiper/Main')();
    const ActionMenu = require('./scenes/Swiper/Menu')();
    const LikelyMain = require('./scenes/Likely/Display')();
    const Refferal = require('./scenes/Profile/Refferal')();
    const stage = new Stage([
        GreetingScene,
        AgeScene,
        GenderScene,
        CandidateScene,
        CityScene,
        NameScene,
        DescScene,
        AvatarScene,
        ConfirmScene,
        ProfileNavScene,
        EditAvatarScene,
        EditDescScene,
        ActionMain,
        ActionMenu,
        LikelyMain,
        Refferal,
    ], {
        ttl: 120,
    });
    bot.use(stage.middleware());
};
