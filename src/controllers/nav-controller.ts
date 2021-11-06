import Telegraf, { Markup } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import ProfileService from '../services/profile-service'
import RelationsService from '../services/relations-service'
const Extra = require('telegraf/extra')

class NavigationController {
  showMenu(ctx: TelegrafContext) {
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

  closeConfirmation(ctx: TelegrafContext) {
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

  closeProfile(ctx: TelegrafContext) {
    ProfileService.deleteProfile(ctx.from!.id)
    RelationsService.deleteAllActivities(ctx.from!.id)

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

  toMainScene(ctx: TelegrafContext) {
    ctx.scene.enter('swiper_main', { is_first: true })
  }

  toProfileScene(ctx: TelegrafContext) {
    ctx.scene.enter('profile_menu')
  }
}

export default new NavigationController()
