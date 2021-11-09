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
const cities_1 = __importDefault(require("./cities"));
const profiles_1 = __importDefault(require("./profiles"));
const searchCandidates = ({ profile, citiesCache, relations, city, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (city) {
            const candidates = yield (0, profiles_1.default)(profile, city, relations);
            if (candidates.length) {
                if (citiesCache)
                    citiesCache.shift();
                return { candidates, citiesCache };
            }
            if (citiesCache.length > 1) {
                citiesCache.shift();
                const result = yield searchCandidates({
                    profile,
                    citiesCache,
                    relations,
                    city: citiesCache[0],
                });
                return result;
            }
            else if (citiesCache.length === 1) {
                citiesCache.shift();
                return undefined;
            }
            else {
                const result = yield searchCandidates({
                    profile,
                    citiesCache,
                    relations,
                });
                return result;
            }
        }
        else {
            citiesCache = (yield (0, cities_1.default)(profile.city)) || [];
            const result = yield searchCandidates({
                profile,
                citiesCache,
                relations,
                city: citiesCache[0],
            });
            return result;
        }
    }
    catch (e) {
        throw e;
    }
});
exports.default = searchCandidates;
