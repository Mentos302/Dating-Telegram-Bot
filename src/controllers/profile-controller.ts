import Telegraf, { Markup } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import BotError from '../exceptions/error-notification'
import IProfile from '../interfaces/IProfile'
import ProfileService from '../services/profile-service'
import RelationsService from '../services/relations-service'
const Extra = require('telegraf/extra')

class ProfileController {
  async sendProfile(ctx: TelegrafContext) {
    try {
      const { name, age, city, descript, avatar } = ctx.session.profile

      if (avatar.is_video) {
        await ctx.replyWithVideo(
          `${avatar.file_id}`,
          Extra.HTML()
            .caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`)
            .markup((m: Markup<any>) => {
              m.resize()
            })
        )
      } else {
        await ctx.replyWithPhoto(
          `${avatar.file_id}`,
          Extra.HTML()
            .caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`)
            .markup((m: Markup<any>) => {
              m.resize()
            })
        )
      }

      ctx.replyWithHTML(
        ctx.i18n.t('profile.main'),
        Extra.HTML().markup((m: Markup<any>) =>
          m.inlineKeyboard([
            [
              m.callbackButton('📋', 'prof_menu1'),
              m.callbackButton('📸 ', 'prof_menu2'),
              m.callbackButton('📝', 'prof_menu3'),
            ],
            [m.callbackButton(ctx.i18n.t('profile.goon'), 'prof_menu4')],
          ])
        )
      )
    } catch (e: any) {
      throw new BotError(`Unexpected error with profile sending`, e)
    }
  }

  async regAgain(ctx: TelegrafContext) {
    if (ctx.from) await ProfileService.deleteProfile(ctx.from.id)

    ctx.scene.enter('reg2')
  }

  async changeDesc(ctx: TelegrafContext) {
    const description = ctx.message!.text.replace(/\./g, ' ').replace(/@/g, ' ')

    if (ctx.from) {
      await ProfileService.changeDesc(ctx.from?.id, description)

      ctx.session.profile.descript = description
      ctx.scene.enter('profile_menu')
    }
  }

  async changePhoto(ctx: TelegrafContext) {
    const avatar = {
      is_video: false,
      file_id: ctx.message!.photo[0].file_id,
    }

    await ProfileService.changeAvatar(ctx.from!.id, avatar)

    await RelationsService.deleteLikes(ctx.from!.id)

    ctx.session.profile.avatar = avatar

    ctx.scene.enter('profile_menu')
  }

  async changeVideo(ctx: TelegrafContext) {
    const avatar = {
      is_video: true,
      file_id: ctx.message!.video.file_id,
    }

    await ProfileService.changeAvatar(ctx.from!.id, avatar)

    await RelationsService.deleteLikes(ctx.from!.id)

    ctx.session.profile.avatar = avatar

    ctx.scene.enter('profile_menu')
  }

  async toRegAgain(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

    ctx.scene.enter(`reg2`)
  }

  async toChangeAvatar(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

    ctx.scene.enter(`editavatar`)
  }

  async toChangeDescript(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

    ctx.scene.enter(`editdescript`)
  }

  async toSwiper(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

    ctx.scene.enter('swiper_main', { is_first: true })
  }

  messageHandler(ctx: TelegrafContext) {
    ctx.scene.reenter()
  }
}

export default new ProfileController()
