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
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./database"));
const telegraf_1 = __importDefault(require("telegraf"));
const telegraf_i18n_1 = __importDefault(require("telegraf-i18n"));
const stage_1 = __importDefault(require("./stage"));
const update_middleware_1 = __importDefault(require("./middlewares/update-middleware"));
const error_notification_1 = __importDefault(require("./exceptions/error-notification"));
const rateLimit = require('telegraf-ratelimit');
const session = require('telegraf/session');
exports.default = () => {
    const bot = new telegraf_1.default(process.env.BOT_TOKEN);
    const i18n = new telegraf_i18n_1.default({
        directory: path_1.default.resolve(__dirname, 'locales'),
        defaultLanguage: 'ua',
        defaultLanguageOnMissing: true,
    });
    bot.use(i18n.middleware());
    bot.context.i18n = i18n;
    bot.use(rateLimit({
        window: 1000,
        limit: 1,
        onLimitExceeded: (ctx) => {
            // try {
            //   ctx.reply('Спокійніше, бо я не встигаю 😤')
            // } catch (error) {
            //   console.log(error)
            // }
        },
    }));
    bot.use(session({
        getSessionKey: (ctx) => ctx.from &&
            `${ctx.from.id}:${(ctx.chat && ctx.chat.id) || ctx.from.id}`,
    }));
    (0, stage_1.default)(bot);
    bot.command('sub_spam', (ctx) => ctx.scene.enter('admin_spam'));
    bot.use(update_middleware_1.default);
    bot.catch(error_notification_1.default);
    database_1.default.connection.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Connected to MongoDB');
        bot.launch();
        console.log(`Bot has been started`);
    }));
    return bot;
};
