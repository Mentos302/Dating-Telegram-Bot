"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (profiles, relations) => {
    const filteredProfiles = profiles
        .filter((e) => !relations.some((el) => e.chat_id === el))
        .sort((a, b) => {
        return b.attraction - a.attraction;
    });
    return filteredProfiles;
};
