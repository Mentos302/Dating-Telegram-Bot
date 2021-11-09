import { Extra } from 'telegraf'
import bot from '../../index'
import BotError from './botError'

export default async (e: any) => {
  if (e instanceof BotError) {
    e.notificate()
  } else {
    console.log(e)

    bot.telegram.sendMessage(
      process.env.ADMIN_ID as string,
      `<b>🚨 Увага нова помилка:</b>\n\n<code>${e}</code>`,
      Extra.HTML()
    )
  }
}
