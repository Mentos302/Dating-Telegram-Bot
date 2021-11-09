import { Extra } from 'telegraf'
import IProfile from '../interfaces/IProfile'
import bot from '../../index'
import BotError from './error-notification'

export default async (profile: IProfile) => {
  try {
    const { name, age, city, descript, avatar } = profile

    await bot.telegram.sendMessage(
      process.env.ADMIN_ID as string,
      `<b>🚨 Увага профіль відключено через скарги: </b>ID <code>${profile.chat_id}</code>`,
      Extra.HTML()
    )

    avatar.is_video
      ? bot.telegram.sendVideo(
          process.env.ADMIN_ID as string,
          `${profile.avatar.file_id}`,
          Extra.caption(
            `<b>${name}, ${age}</b>. ${city} \n\n${descript}`
          ).HTML() as any
        )
      : bot.telegram.sendPhoto(
          process.env.ADMIN_ID as string,
          `${profile.avatar.file_id}`,
          Extra.caption(
            `<b>${name}, ${age}</b>. ${city} \n\n${descript}`
          ).HTML() as any
        )
  } catch (e: any) {
    throw new BotError(`Unexpected error with report baned sending`, e)
  }
}
