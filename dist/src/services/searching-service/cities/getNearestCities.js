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
const getDistance_1 = __importDefault(require("./getDistance"));
const database_1 = __importDefault(require("../../../database"));
const error_notification_1 = __importDefault(require("../../../exceptions/error-notification"));
const { City } = database_1.default;
exports.default = (host_city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cities = yield City.find({
            name: { $ne: host_city.name },
            profiles: { $ne: 0 },
        });
        cities = yield Promise.all(cities.map((e) => __awaiter(void 0, void 0, void 0, function* () {
            e.distance = yield (0, getDistance_1.default)(host_city, e);
            return e;
        })));
        cities = cities
            .sort((a, b) => {
            if (a.distance && b.distance) {
                return a.distance - b.distance;
            }
        })
            .map((e) => e.name);
        return cities;
    }
    catch (e) {
        throw new error_notification_1.default(`Unexpected error with nearest cities getting`, e);
    }
});
