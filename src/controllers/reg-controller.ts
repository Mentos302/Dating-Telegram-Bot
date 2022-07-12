import { Markup } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'
import errorNotification from '../exceptions/error-notification'
import { ITelegrafContext } from '../interfaces/ITelegrafContext'

import ProfileService from '../services/profile-service'
import DisplayController from './display-controller'

const Extra = require('telegraf/extra')

class RegController {
  async greeting(ctx: ITelegrafContext) {
    ctx.replyWithHTML(
      ctx.i18n.t('reg.greeting'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([m.callbackButton(ctx.i18n.t('yes'), 'okay')])
      )
    )
  }

  async regStart(ctx: ITelegrafContext) {
    ctx.scene.enter('reg2')
  }

  reqAge({ reply, i18n }: ITelegrafContext) {
    reply(i18n.t('reg.age'), Extra.HTML())
  }

  resAge({ scene, i18n, message, replyWithHTML }: ITelegrafContext) {
    const age: string = message!.text

    isNaN(parseInt(age?.trim()))
      ? replyWithHTML(i18n.t('reg.age_error'))
      : scene.enter(`reg3`, { age })
  }

  reqGender({ replyWithHTML, i18n }: ITelegrafContext) {
    replyWithHTML(
      i18n.t('reg.sex'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([
          m.callbackButton(i18n.t('reg.sex_boy'), 'boy'),
          m.callbackButton(i18n.t('reg.sex_girl'), 'girl'),
        ])
      )
    )
  }

  async resGenderMale(ctx: ITelegrafContext) {
    ctx.scene.enter('reg4', { ...ctx.scene.state, gender: 1 })
  }

  async resGenderFemale(ctx: ITelegrafContext) {
    ctx.scene.enter('reg4', { ...ctx.scene.state, gender: 0 })
  }

  reqSex({ replyWithHTML, i18n }: ITelegrafContext) {
    replyWithHTML(
      i18n.t('reg.int'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([
          m.callbackButton(i18n.t('reg.int_boys'), 'boys'),
          m.callbackButton(i18n.t('reg.int_girls'), 'girls'),
          m.callbackButton(i18n.t('reg.int_both'), 'both'),
        ])
      )
    )
  }

  async resSex(ctx: ITelegrafContext) {
    let sex

    switch (ctx.callbackQuery!.data) {
      case 'girls':
        sex = 0
        break
      case 'boys':
        sex = 1
        break
      case 'both':
        sex = 2
        break
    }

    ctx.scene.state.interest = sex

    ctx.reply(ctx.i18n.t('reg.candidateage'), Extra.HTML())
  }

  resCandidateAge(ctx: ITelegrafContext) {
    const candidateAge = ctx.message?.text

    candidateAge && !isNaN(parseInt(candidateAge))
      ? ctx.scene.enter('reg5', { ...ctx.scene.state, candidateAge })
      : ctx.reply(ctx.i18n.t('reg.age_error'), Extra.HTML())
  }

  reqCity(ctx: ITelegrafContext) {
    ctx.replyWithHTML(ctx.i18n.t('reg.city'))
  }

  async resCity(ctx: ITelegrafContext) {
    ctx.scene.enter('reg6', { ...ctx.scene.state, city: ctx.message?.text })

    ctx.session = {
      profile: { ...ctx.scene.state, city: ctx.message?.text },
      city: ctx.message?.text,
      citiesCache: [],
      relations: [],
    }

    DisplayController.getCandidates(ctx.session).catch((e) =>
      errorNotification(e)
    )
  }

  reqName({ replyWithHTML, i18n }: ITelegrafContext) {
    replyWithHTML(
      i18n.t('reg.name'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([
          m.callbackButton(i18n.t('reg.name_btn'), 'first_name'),
        ])
      )
    )
  }

  resName({ message, scene }: ITelegrafContext) {
    scene.enter('reg7', { ...scene.state, name: message?.text })
  }

  async resNameDefault(ctx: ITelegrafContext) {
    ctx.scene.enter('reg7', { ...ctx.scene.state, name: ctx.from?.first_name })
  }

  reqDesc({ replyWithHTML, i18n }: ITelegrafContext) {
    replyWithHTML(
      i18n.t('reg.desc'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([m.callbackButton(i18n.t('reg.desc_skip'), 'skip')])
      )
    )
  }

  async resDescSkip(ctx: ITelegrafContext) {
    ctx.scene.enter('reg8', { ...ctx.scene.state, descript: `` })
  }

  resDesc({ message, scene }: ITelegrafContext) {
    let linkFilter = message?.text.replace(/\./g, ' ').replace(/@/g, ' ')

    scene.enter('reg8', { ...scene.state, descript: linkFilter })
  }

  reqAvatar({ replyWithHTML, i18n }: ITelegrafContext) {
    replyWithHTML(i18n.t('reg.avatar'))
  }

  resAvatarPhoto({ message, scene }: ITelegrafContext) {
    scene.enter('reg9', {
      ...scene.state,
      avatar: {
        file_id: message?.photo[0].file_id,
      },
    })
  }

  resAvatarVideo({ message, scene }: ITelegrafContext) {
    scene.enter('reg9', {
      ...scene.state,
      avatar: {
        file_id: message?.video.file_id,
        is_video: true,
      },
    })
  }

  async reqConfirm({
    scene,
    replyWithVideo,
    replyWithPhoto,
    replyWithHTML,
    i18n,
  }: ITelegrafContext) {
    const { name, age, city, descript, avatar } = scene.state

    if (avatar.is_video) {
      await replyWithVideo(
        `${avatar.file_id}`,
        Extra.markup((m: Markup<any>) => {
          m.resize()
        })
          .caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`)
          .HTML()
      )
    } else {
      await replyWithPhoto(
        `${avatar.file_id}`,
        Extra.markup((m: Markup<any>) => {
          m.resize()
        })
          .caption(`<b>${name}, ${age}</b>. ${city} \n\n${descript}`)
          .HTML()
      )
    }
    replyWithHTML(
      i18n.t('reg.conf'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([
          m.callbackButton(i18n.t('reg.well'), 'well'),
          m.callbackButton(i18n.t('reg.edit'), 'edit'),
        ])
      )
    )
  }

  async resConfirm(ctx: ITelegrafContext) {
    const { from, scene, session, callbackQuery } = ctx

    const userProfile = {
      ...scene.state,
      chat_id: from?.id,
    }

    session.profile = userProfile
    ProfileService.createProfile(userProfile)

    callbackQuery.data === 'well'
      ? scene.enter('swiper_main', { is_first: true })
      : scene.enter('profile_menu')
  }
}

export default new RegController()
