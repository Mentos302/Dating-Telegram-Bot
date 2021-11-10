"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cyrillic_to_translit_js_1 = __importDefault(require("cyrillic-to-translit-js"));
const database_1 = __importDefault(require("../../../database"));
const botError_1 = __importDefault(require("../../../exceptions/botError"));
const fetch = require('node-fetch');
const { City } = database_1.default;
exports.default = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let city = yield City.findOne({ name });
        if (city) {
            return city;
        }
        else {
            let adress = new cyrillic_to_translit_js_1.default({ preset: 'uk' }).transform(name, ' ');
            let nameURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
                adress +
                `&key=${process.env.GOOGLE_MAPS_KEY}`;
            let response = yield fetch(nameURL);
            let commits = yield response.json();
            if (commits.results[0]) {
                const { lat, lng } = commits.results[0].geometry.location;
                const city = {
                    name,
                    lat,
                    lng,
                };
                yield City.create(city);
                return city;
            }
            else {
                throw new Error('City not found');
            }
        }
    }
    catch (e) {
        throw new botError_1.default(`Unexpected error with city coords getting`, e);
    }
});
