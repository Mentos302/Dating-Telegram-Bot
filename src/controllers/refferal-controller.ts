import { Markup } from 'telegraf'
import { ITelegrafContext } from '../interfaces/ITelegrafContext'
import UserService from '../services/user-service'

const Extra = require('telegraf/extra')

class RefferalController {
  async enter(ctx: ITelegrafContext) {
    const refferals = await UserService.getUserRefBonus(ctx.from!.id)

    const quantity = refferals == 1 ? 'single' : 'multiple'

    const msg = ctx.i18n.t(`refferal.${quantity}`, { refferals })

    ctx.replyWithHTML(
      ctx.i18n.t('refferal.enter', {
        msg,
        likesq: refferals + 15,
      }),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([
          [
            m.urlButton(
              'Відправити посилання 🥳',
              `https://t.me/share/url?url=t.me/ukrdatingbot?start=${
                ctx.from!.id
              }`
            ),
          ],
          [m.callbackButton('↩️ Повернутись назад', 'go_exit')],
        ])
      )
    )
  }

  async toNavigation(ctx: ITelegrafContext) {
    ctx.scene.enter('swiper_nav')
  }
}

export default new RefferalController()
