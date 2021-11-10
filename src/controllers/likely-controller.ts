import { TelegrafContext } from 'telegraf/typings/context'
import DisplayController from './display-controller'
import RelationsService from '../services/relations-service'
import IProfile from '../interfaces/IProfile'
import ProfileService from '../services/profile-service'
import { Markup } from 'telegraf'
const Extra = require('telegraf/extra')

class LikelyContoroller {
  constructor() {
    this.matchHandler = this.matchHandler.bind(this)
  }

  async enter(ctx: TelegrafContext) {
    const { scene, session } = ctx

    session.likely_candidates = []

    for (const like of scene.state.likes) {
      const profile: IProfile = await ProfileService.getProfile(like.host_id)
      if (profile) session.likely_candidates.push(profile)
    }

    if (session.likely_candidates)
      DisplayController.showCandidates(ctx, session.likely_candidates[0])
  }

  choose = async (ctx: TelegrafContext) => {
    const { from, session, callbackQuery } = ctx

    if (session.likely_candidates?.length) {
      const { chat_id } = session.likely_candidates[0]

      let like: boolean = callbackQuery?.data === 'yes'

      await RelationsService.updateLikely(chat_id, from!.id)

      session.relations.push(chat_id)

      if (like) {
        await this.matchHandler(ctx, session.likely_candidates[0])
      } else {
        session.likely_candidates.shift()

        if (session.likely_candidates.length) {
          DisplayController.showCandidates(ctx, session.likely_candidates[0])
        } else {
          ctx.scene.enter('swiper_nav')
        }
      }
    } else {
      ctx.scene.enter('swiper_nav')
    }
  }

  async report(ctx: TelegrafContext) {
    if (ctx.session.likely_candidates) {
      const { chat_id } = ctx.session.likely_candidates[0]

      await ProfileService.reportProfile(ctx.session.likely_candidates[0])

      await RelationsService.updateLikely(ctx.from!.id, chat_id)

      ctx.session.likely_candidates.shift()

      DisplayController.showCandidates(ctx, ctx.session.likely_candidates[0])
    }
  }

  async matchHandler(ctx: TelegrafContext, liked: IProfile) {
    const { from, i18n, telegram, replyWithHTML } = ctx

    replyWithHTML(
      `${i18n.t('likely.climatch')} <a href="tg://user?id=${liked.chat_id}">${
        liked.name
      }</a>`,
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([
          [m.callbackButton(i18n.t('likely.continue'), 'continue')],
        ])
      )
    )

    if (from) {
      try {
        await telegram.sendMessage(
          liked.chat_id,
          `${i18n.t('likely.hostmatch')} <a href="tg://user?id=${from.id}">${
            from.first_name
          }</a>`,
          Extra.HTML().markup((m: Markup<any>) =>
            m.inlineKeyboard([
              [m.callbackButton(i18n.t('likely.continue'), 'continue')],
            ])
          )
        )
      } catch (e: any) {
        if (e.response && e.response.error_code === 403) {
          ProfileService.deleteProfile(liked.chat_id)
        } else {
          console.log(e)

          throw new Error('Unexpected error with match handler')
        }
      }
    }
  }

  async continue(ctx: TelegrafContext) {
    const candidates = ctx.session.likely_candidates
    candidates?.shift()

    ctx.scene.state.is_first = true

    if (candidates?.length) {
      DisplayController.showCandidates(ctx, candidates[0])
    } else {
      ctx.scene.enter('swiper_main', ctx.scene.state)
    }
  }

  async toNavigation(ctx: TelegrafContext) {
    ctx.scene.enter('swiper_nav')
  }
}

export default new LikelyContoroller()
