import { TelegrafContext } from 'telegraf/typings/context'
import DisplayController from './display-controller'
import RelationsService from '../services/relations-service'
import IProfile from '../interfaces/IProfile'
import ProfileService from '../services/profile-service'
const Extra = require('telegraf/extra')

class LikelyContoroller {
  constructor() {
    this.matchHandler = this.matchHandler
  }

  async enter(ctx: TelegrafContext) {
    ctx.session.candidates = []

    for (const candidat of ctx.scene.state.likes) {
      const profile = await ProfileService.getProfile(candidat)

      ctx.session.candidates.push(profile)
    }

    const isOver = await DisplayController.showCandidates(ctx)

    if (isOver) ctx.scene.enter('swiper_main')
  }

  async choose(ctx: TelegrafContext) {
    const { from, session, callbackQuery } = ctx

    if (session.candidates) {
      const { chat_id } = session.candidates[0]

      let like: boolean = callbackQuery?.data === 'yes'

      RelationsService.updateLikely(from!.id, chat_id)

      if (like) {
        this.matchHandler(ctx, session.candidates[0])
      }
    }

    session.relations = session.relations || []

    if (session.candidates?.length) await session.candidates.shift()

    await DisplayController.showCandidates(ctx)
  }

  async report(ctx: TelegrafContext) {
    if (ctx.session.candidates) {
      const { chat_id, strikes } = ctx.session.candidates[0]

      ProfileService.reportProfile(chat_id, strikes)

      RelationsService.newRelation(ctx.from!.id, chat_id, false)

      await ctx.session.candidates.shift()

      DisplayController.showCandidates(ctx)
    }
  }

  async matchHandler(ctx: TelegrafContext, liked: IProfile) {
    const { from, i18n, telegram, replyWithHTML } = ctx

    replyWithHTML(
      `${i18n.t('likely.climatch')} <a href="tg://user?id=${liked.chat_id}">${
        liked.name
      }</a>`
    )

    if (from) {
      try {
        await telegram.sendMessage(
          liked.chat_id,
          `${i18n.t('likely.hostmatch')} <a href="tg://user?id=${from.id}">${
            from.first_name
          }</a>`,
          Extra.HTML()
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

  toNavigation(ctx: TelegrafContext) {
    ctx.scene.enter('action_menu')
  }
}

export default new LikelyContoroller()
