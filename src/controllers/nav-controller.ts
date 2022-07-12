import { Markup } from 'telegraf'
import { ITelegrafContext } from '../interfaces/ITelegrafContext'
import ProfileService from '../services/profile-service'
import RelationsService from '../services/relations-service'
const Extra = require('telegraf/extra')

class NavigationController {
  showMenu(ctx: ITelegrafContext) {
    ctx.replyWithHTML(
      ctx.i18n.t('action.menu'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([
          [
            m.callbackButton(ctx.i18n.t('action.first'), 'profile'),
            m.callbackButton(ctx.i18n.t('action.second'), 'close'),
          ],
          [m.callbackButton(ctx.i18n.t('action.third'), 'continue')],
        ])
      )
    )
  }

  async closeConfirmation(ctx: ITelegrafContext) {
    ctx.replyWithHTML(
      ctx.i18n.t('close.main'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([
          m.callbackButton(ctx.i18n.t('close.confirm'), 'close_confirm'),
          m.callbackButton(ctx.i18n.t('close.reject'), 'go_back'),
        ])
      )
    )
  }

  async closeProfile(ctx: ITelegrafContext) {
    await ProfileService.deleteProfile(ctx.from!.id)
    await RelationsService.deleteAllActivities(ctx.from!.id)

    ctx.replyWithHTML(
      ctx.i18n.t('close.bye'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([
          m.callbackButton(ctx.i18n.t('close.regagain'), 'rndmsht'),
        ])
      )
    )

    ctx.scene.leave()
  }

  async toMainScene(ctx: ITelegrafContext) {
    ctx.scene.enter('swiper_main', { is_first: true })
  }

  async toProfileScene(ctx: ITelegrafContext) {
    ctx.scene.enter('profile_menu')
  }
}

export default new NavigationController()
