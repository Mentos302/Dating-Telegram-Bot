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
const database_1 = __importDefault(require("../database"));
const error_notification_1 = __importDefault(require("../exceptions/error-notification"));
const { Relation } = database_1.default;
class RelationsService {
    newRelation(host_id, cli_id, host_like) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Relation.create({
                    host_id,
                    cli_id,
                    host_like,
                    cli_checked: false,
                });
            }
            catch (e) {
                throw new error_notification_1.default(`Unexprected error with creating new relation`, e);
            }
        });
    }
    checkNewLikes(cli_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const likedRelations = yield Relation.find({
                    cli_id,
                    cli_checked: false,
                });
                likedRelations.map((e) => {
                    e.host_id;
                });
                return likedRelations;
            }
            catch (e) {
                throw new error_notification_1.default(`Unexpected error with new likes checking`, e);
            }
        });
    }
    getUserRelations(cli_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let relations = yield Relation.find({ host_id: cli_id }, { cli_id: 1, _id: 0 });
                relations = relations
                    .concat(yield Relation.find({ cli_id, host_like: false }, { host_id: 1, _id: 0 }))
                    .concat(yield Relation.find({ cli_id, cli_checked: true }, { host_id: 1, _id: 0 }))
                    .concat(yield Relation.find({ cli_id, host_like: true, cli_checked: false }, { host_id: 1, _id: 0 }));
                relations = relations.map((e) => e.host_id == undefined ? (e = e.cli_id) : (e = e.host_id));
                return relations;
            }
            catch (e) {
                throw new error_notification_1.default(`Unexprected error with getting user relations`, e);
            }
        });
    }
    updateLikely(host_id, cli_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Relation.updateOne({ host_id, cli_id }, { cli_checked: true });
            }
            catch (e) {
                throw new error_notification_1.default(`Unexprected error with likely updating`, e);
            }
        });
    }
    deleteLikes(cli_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Relation.deleteMany({ cli_id });
            }
            catch (e) {
                throw new error_notification_1.default(`Unexpected error with likes deleting`, e);
            }
        });
    }
    deleteAllActivities(cli_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Relation.deleteMany({ host_id: cli_id });
                yield Relation.deleteMany({ cli_id });
            }
            catch (e) {
                throw new error_notification_1.default(`Unexpected error with activities deleting`, e);
            }
        });
    }
}
exports.default = new RelationsService();
