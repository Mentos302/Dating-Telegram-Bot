import { Markup } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import DisplayController from './display-controller'
import RelationsService from '../services/relations-service'
import ProfileService from '../services/profile-service'
import UserService from '../services/user-service'
const Extra = require('telegraf/extra')

class SwiperController {
  constructor() {
    this.sendLike = this.sendLike.bind(this)
  }

  async enter(ctx: TelegrafContext) {
    const candidates = ctx.session.candidates

    if (candidates && candidates[0]) {
      const isOver = await DisplayController.showCandidates(ctx, candidates[0])

      if (ctx.scene.state.is_first) {
        ctx.scene.state.is_first = false
      }

      if (isOver) {
        await ctx.reply(ctx.i18n.t('action.over'), Extra.HTML())

        ctx.scene.enter('swiper_nav')
      }
    } else {
      ctx.reply(ctx.i18n.t('action.delay'), Extra.HTML())
      setTimeout(async () => {
        if (ctx.session.candidates?.length) {
          ctx.scene.state.is_first = true

          ctx.scene.reenter()
        } else {
          await ctx.reply(ctx.i18n.t('action.over'), Extra.HTML())

          ctx.scene.enter('swiper_nav')
        }
      }, 10000)
    }
  }

  choose = async (ctx: TelegrafContext) => {
    ctx.answerCbQuery()
    const { from, session, callbackQuery } = ctx
    const { candidates } = session

    if (candidates) {
      const { chat_id } = candidates[0]

      let like: boolean = callbackQuery?.data === 'yes'

      if (like && session.daily_likes! >= 15) {
        await ctx.reply(
          ctx.i18n.t('action.limit'),
          Extra.HTML().markup((m: Markup<any>) =>
            m.inlineKeyboard([
              [m.callbackButton('📋 Запросити друзів', 'toRefferal')],
              [m.callbackButton('↩️ Повернутись в меню', 'go_exit')],
            ])
          )
        )
      } else {
        if (like) {
          let likes = session.daily_likes ? session.daily_likes : 0

          likes++

          if (!(likes! % 5) && ctx.from) {
            await UserService.updateDailyLikes(ctx.from?.id, likes)
          }

          await this.sendLike(ctx, chat_id)
        }

        await RelationsService.newRelation(from!.id, chat_id, like)

        if (candidates.length) {
          candidates.shift()
        }

        if (candidates.length) {
          session.relations = session.relations || []

          DisplayController.showCandidates(ctx, candidates[0])
        } else {
          await ctx.reply(ctx.i18n.t('action.over'), Extra.HTML())

          ctx.scene.enter('swiper_nav')
        }
      }
    }
  }

  async report(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

    if (ctx.session.candidates) {
      const { chat_id } = ctx.session.candidates[0]

      await ProfileService.reportProfile(ctx.session.candidates[0])

      await RelationsService.newRelation(ctx.from!.id, chat_id, false)

      ctx.session.candidates.shift()

      DisplayController.showCandidates(ctx, ctx.session.candidates[0])
    }
  }

  async sendLike({ telegram, i18n }: TelegrafContext, chat_id: number) {
    const likes = await ProfileService.updateProfileLikes(chat_id)

    if (likes && likes % 3 === 0) {
      try {
        await telegram.sendMessage(
          chat_id,
          `${i18n.t('likely.alert1')} <b>${likes} ${i18n.t(
            'likely.alert2'
          )}</b>\n\n${i18n.t('likely.alert3')}`,
          Extra.HTML().markup((m: Markup<any>) =>
            m.inlineKeyboard([
              m.callbackButton(i18n.t('likely.alertbtn'), 'rndmsht'),
            ])
          )
        )
      } catch (e: any) {
        if (e.response && e.response.error_code === 403) {
          ProfileService.deleteProfile(chat_id)
        } else {
          throw new Error(`Unexpected error with like sending`)
        }
      }
    }
  }

  async toRefferal(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

    ctx.scene.enter('refferal')
  }

  async toNavigation(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

    ctx.scene.enter('swiper_nav')
  }
}

export default new SwiperController()
