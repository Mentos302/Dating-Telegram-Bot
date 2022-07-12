import { Markup } from 'telegraf'
import IProfile from '../interfaces/IProfile'
import ISession from '../interfaces/ISession'
import SearchCandidates from '../services/searching-service'
import errorNotification from '../exceptions/error-notification'
import { ITelegrafContext } from '../interfaces/ITelegrafContext'
const Extra = require('telegraf/extra')

class DisplayController {
  constructor() {
    this.getCandidates = this.getCandidates
    this.controlKeyboard = this.controlKeyboard
  }

  async showCandidates(ctx: ITelegrafContext, profile: IProfile) {
    const { scene, session, replyWithPhoto, replyWithVideo } = ctx

    let { is_first, likes } = scene.state

    const candidates = session.candidates || []

    if (!likes && candidates.length < 10 && !session.searchingNow) {
      this.getCandidates(session).catch((e) => errorNotification(e))
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
    session.searchingNow = true

    const candidates = await SearchCandidates(session)

    if (candidates) {
      session.searchingNow = false

      session.candidates = session.candidates
        ? session.candidates.concat(candidates)
        : candidates

      candidates.forEach((e) => {
        session.relations.push(e.chat_id)
      })
    }
  }

  controlKeyboard({ i18n }: ITelegrafContext, profile: IProfile) {
    const { name, age, city, descript } = profile

    return Extra.markup((m: Markup<any>) => {
      m.resize()
    })
      .caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`)
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
    { i18n, editMessageMedia, editMessageCaption }: ITelegrafContext,
    profile: IProfile
  ) {
    const { name, age, city, descript, avatar } = profile

    const media = avatar.file_id

    await editMessageMedia(
      avatar.is_video ? { type: 'video', media } : { type: 'photo', media }
    )

    editMessageCaption(
      `<b>${name}, ${age}</b>. ${city} \n\n${descript}`,
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
