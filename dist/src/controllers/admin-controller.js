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
const admin_service_1 = __importDefault(require("../services/admin-service"));
class AdminController {
    enter(ctx) {
        if (`${ctx.from.id}` == process.env.ADMIN_ID) {
            return ctx.reply('Надішліть повідомлення для розсилки користувачам боту.');
        }
        return ctx.scene.leave();
    }
    sendMessage(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield admin_service_1.default.getUsers();
                if (users) {
                    let blocked = 0;
                    ctx.telegram.sendMessage(process.env.ADMIN_ID, `Розпочинаю розсилку по ${users.length} користувчах`);
                    yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            try {
                                yield ctx.telegram.sendMessage(user.chat_id, (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text);
                            }
                            catch (e) {
                                if (e.code === 403) {
                                    admin_service_1.default.removeUser(user.chat_id);
                                    blocked++;
                                }
                                else {
                                    console.log(e);
                                }
                            }
                        }), 50);
                    })));
                    ctx.scene.leave();
                }
            }
            catch (e) {
                ctx.telegram.sendMessage(process.env.ADMIN_ID, 'При розсилці повідомлення, щось пішло не так: ' + `${e}`);
            }
        });
    }
}
exports.default = new AdminController();
