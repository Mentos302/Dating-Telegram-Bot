import { Markup } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import IProfile from '../interfaces/IProfile'
import ISession from '../interfaces/ISession'
import SearchCandidates from '../services/searching-service'

const Extra = require('telegraf/extra')

class DisplayController {
  constructor() {
    this.getCandidates = this.getCandidates
    this.controlKeyboard = this.controlKeyboard
  }

  async showCandidates(ctx: TelegrafContext, profile: IProfile) {
    const { scene, session, replyWithPhoto, replyWithVideo } = ctx

    let { is_first, likes } = scene.state

    const candidates = session.candidates || []
    const citiesCache = session.citiesCache || []

    if (!likes && candidates.length < 10 && citiesCache.length) {
      this.getCandidates(session)
    }

    if (profile && is_first) {
      profile.avatar.is_video
        ? replyWithVideo(
            `${profile.avatar.file_id}`,
            this.controlKeyboard(ctx, profile)
          )
        : replyWithPhoto(
            `${profile.avatar.file_id}`,
            this.controlKeyboard(ctx, profile)
          )

      scene.state = {}
    } else if (profile) {
      this.editMessage(ctx, profile)
    } else {
      return true
    }
  }

  async getCandidates(session: ISession) {
    const searching = await SearchCandidates(session)

    if (searching) {
      let { candidates, citiesCache } = searching

      if (!citiesCache) citiesCache = []

      session.city = citiesCache[0]
      session.candidates = session.candidates
        ? session.candidates.concat(candidates)
        : candidates
      session.citiesCache = citiesCache

      candidates.forEach((e) => {
        session.relations.push(e.chat_id)
      })

      if (citiesCache.length && session.candidates.length < 10) {
        this.getCandidates(session).catch((e: Error) => console.log(e))
      }
    }
  }

  controlKeyboard({ i18n }: TelegrafContext, profile: IProfile) {
    const { name, age, city, decsript } = profile

    return Extra.markup((m: Markup<any>) => {
      m.resize()
    })
      .caption(`<b>${name}, ${age}</b>. ${city} \n\n${decsript}`)
      .HTML()
      .markup((m: Markup<any>) =>
        m.inlineKeyboard([
          [
            m.callbackButton(i18n.t('action.like'), 'yes'),
            m.callbackButton(i18n.t('action.dislike'), 'no'),
          ],
          [
            m.callbackButton(i18n.t('action.report'), 'report'),
            m.callbackButton(i18n.t('action.exit'), 'go_exit'),
          ],
        ])
      )
  }

  async editMessage(
    { i18n, editMessageMedia, editMessageCaption }: TelegrafContext,
    profile: IProfile
  ) {
    const { name, age, city, decsript, avatar } = profile

    const media = avatar.file_id

    editMessageMedia(
      avatar.is_video ? { type: 'video', media } : { type: 'photo', media }
    )

    editMessageCaption(
      `<b>${name}, ${age}</b>. ${city} \n\n${decsript}`,
      Extra.markup((m: Markup<any>) => {
        m.resize()
      })
        .HTML()
        .markup((m: Markup<any>) =>
          m.inlineKeyboard([
            [
              m.callbackButton(i18n.t('action.like'), 'yes'),
              m.callbackButton(i18n.t('action.dislike'), 'no'),
            ],
            [
              m.callbackButton(i18n.t('action.report'), 'report'),
              m.callbackButton(i18n.t('action.exit'), 'go_exit'),
            ],
          ])
        )
    )
  }
}

export default new DisplayController()
