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
const geolib_1 = require("geolib");
const database_1 = __importDefault(require("../../../database"));
const { City } = database_1.default;
exports.default = (from, to) => __awaiter(void 0, void 0, void 0, function* () {
    const { cached_distances } = from;
    if (cached_distances === null || cached_distances === void 0 ? void 0 : cached_distances.length) {
        const data = cached_distances.find((e) => e.pointName === to.name);
        if (data)
            return data.distance;
    }
    const distance = yield calculateDistance(from, to);
    return distance;
});
const calculateDistance = (from, to) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lat, lng, profiles } = from;
    const distance = Math.round((0, geolib_1.getDistance)({ latitude: lat, longitude: lng }, { latitude: to.lat, longitude: to.lng }, 1) / 1000);
    if (profiles && profiles > 10) {
        City.updateOne({ name }, { $push: { cached_distances: { pointName: to.name, distance } } }).catch((e) => console.log(e));
        City.updateOne({ name: to.name }, { $push: { cached_distances: { pointName: name, distance } } }).catch((e) => console.log(e));
    }
    return distance;
});
