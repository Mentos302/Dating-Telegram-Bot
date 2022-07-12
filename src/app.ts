import path from 'path'
import db from './database'
import Telegraf from 'telegraf'
import I18n from 'telegraf-i18n'
import sceneInitialisation from './stage'
import { TelegrafContext } from 'telegraf/typings/context'
import updateMiddleware from './middlewares/update-middleware'
import errorNotification from './exceptions/error-notification'
import { ITelegrafContext } from './interfaces/ITelegrafContext'
const rateLimit = require('telegraf-ratelimit')
const session = require('telegraf/session')

export default () => {
  const bot: any = new Telegraf(process.env.BOT_TOKEN as string)

  const i18n = new I18n({
    directory: path.resolve(__dirname, 'locales'),
    defaultLanguage: 'ua',
    defaultLanguageOnMissing: true,
  })

  bot.use(i18n.middleware())

  bot.context.i18n = i18n

  bot.use(
    rateLimit({
      window: 1000,
      limit: 1,
      onLimitExceeded: (ctx: TelegrafContext) => {
        // try {
        //   ctx.reply('Спокійніше, бо я не встигаю 😤')
        // } catch (error) {
        //   console.log(error)
        // }
      },
    })
  )

  bot.use(
    session({
      getSessionKey: (ctx: TelegrafContext) =>
        ctx.from &&
        `${ctx.from.id}:${(ctx.chat && ctx.chat.id) || ctx.from.id}`,
    })
  )

  sceneInitialisation(bot)

  bot.command('sub_spam', (ctx: ITelegrafContext) =>
    ctx.scene.enter('admin_spam')
  )

  bot.use(updateMiddleware)

  bot.catch(errorNotification)

  db.connection.once('open', async () => {
    console.log('Connected to MongoDB')
    bot.launch()
    console.log(`Bot has been started`)
  })

  return bot
}
