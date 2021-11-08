import path from 'path'
import ngrok from 'ngrok'
import db from './database'
import express from 'express'
import Telegraf from 'telegraf'
import I18n from 'telegraf-i18n'
import sceneInitialisation from './stage'
import { TelegrafContext } from 'telegraf/typings/context'
import updateMiddleware from './middlewares/update-middleware'
const rateLimit = require('telegraf-ratelimit')
const session = require('telegraf/session')

export default () => {
  const app = express()

  const bot: any = new Telegraf(process.env.BOT_TOKEN as string)

  const i18n = new I18n({
    directory: path.resolve(__dirname, 'locales'),
    defaultLanguage: 'ua',
    defaultLanguageOnMissing: true,
  })

  bot.use(i18n.middleware())

  bot.context.i18n = i18n

  bot.catch((error: Error) => {
    console.log(error)
  })

  bot.use(
    rateLimit({
      window: 1000,
      limit: 1,
      onLimitExceeded: (ctx: TelegrafContext) =>
        ctx.reply('Спокійніше, бо я не встигаю 😤'),
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

  bot.use(updateMiddleware)

  db.connection.once('open', async () => {
    console.log('Connected to MongoDB')
    app.use(bot.webhookCallback('/secreting'))
    bot.telegram.setWebhook(`${await ngrok.connect(8443)}/secreting`)

    app.listen(8443, () => {
      console.log('Bot has been started ...')
    })
  })
}
