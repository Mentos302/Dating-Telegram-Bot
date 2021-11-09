import { Extra } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'

export default (bot: TelegrafContext, error: Error) => {
  console.log(error)

  const errorMsg: string = JSON.stringify(error)

  bot.telegram.sendMessage(
    process.env.ADMIN_ID as string,
    `<b>🚨 Увага нова помилка:</b>\n\n<code>${errorMsg}</code>`,
    Extra.HTML()
  )
}
