import { Extra } from 'telegraf'
import bot from '../../index'

class BotError {
  msg: string
  error: Error

  constructor(msg: string, error: Error) {
    this.msg = msg
    this.error = error
  }

  notificate() {
    // console.log(this.error)

    console.log(`pnes`)

    bot.telegram.sendMessage(
      process.env.ADMIN_ID as string,
      `<b>🚨 Увага нова помилка:</b>\n\n<code>${this.msg}\n\n${this.error}</code>`,
      Extra.HTML()
    )
  }
}

export default BotError
