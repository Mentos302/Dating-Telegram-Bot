import { Extra } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'

export default (bot: TelegrafContext, error: Error) => {
  console.log(error)

  bot.telegram.sendMessage(
    process.env.ADMIN_ID as string,
    `<b>🚨 Увага нова помилка:</b>\n\n<code>${error}</code>`,
    Extra.HTML()
  )
}
