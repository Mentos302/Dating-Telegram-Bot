import { Markup } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'

import ProfileService from '../services/profile-service'
import DisplayController from './display-controller'

const Extra = require('telegraf/extra')

class RegController {
  async greeting(ctx: TelegrafContext) {
    ctx.replyWithHTML(
      ctx.i18n.t('reg.greeting'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([m.callbackButton(ctx.i18n.t('yes'), 'okay')])
      )
    )
  }

  async regStart(ctx: TelegrafContext) {
    await ctx.answerCbQuery()
    ctx.scene.enter('reg2')
  }

  reqAge({ reply, i18n }: TelegrafContext) {
    reply(i18n.t('reg.age'), Extra.HTML())
  }

  resAge({ scene, i18n, message, replyWithHTML }: TelegrafContext) {
    const age: string = message!.text

    isNaN(parseInt(age?.trim()))
      ? replyWithHTML(i18n.t('reg.age_error'))
      : scene.enter(`reg3`, { age })
  }

  reqGender({ replyWithHTML, i18n }: TelegrafContext) {
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

  async resGenderMale(ctx: TelegrafContext) {
    await ctx.answerCbQuery()
    ctx.scene.enter('reg4', { ...ctx.scene.state, gender: 1 })
  }

  async resGenderFemale(ctx: TelegrafContext) {
    await ctx.answerCbQuery()
    ctx.scene.enter('reg4', { ...ctx.scene.state, gender: 0 })
  }

  reqSex({ replyWithHTML, i18n }: TelegrafContext) {
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

  async resSex(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

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

  resCandidateAge(ctx: TelegrafContext) {
    const candidateAge = ctx.message?.text

    candidateAge && !isNaN(parseInt(candidateAge))
      ? ctx.scene.enter('reg5', { ...ctx.scene.state, candidateAge })
      : ctx.reply(ctx.i18n.t('reg.age_error'), Extra.HTML())
  }

  reqCity(ctx: TelegrafContext) {
    ctx.replyWithHTML(ctx.i18n.t('reg.city'))
  }

  async resCity(ctx: TelegrafContext) {
    ctx.scene.enter('reg6', { ...ctx.scene.state, city: ctx.message?.text })

    ctx.session = {
      profile: { ...ctx.scene.state, city: ctx.message?.text },
      city: ctx.message?.text,
      citiesCache: [],
      relations: [],
    }

    if (!ctx.session.searchingNow) DisplayController.getCandidates(ctx.session)
  }

  reqName({ replyWithHTML, i18n }: TelegrafContext) {
    replyWithHTML(
      i18n.t('reg.name'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([
          m.callbackButton(i18n.t('reg.name_btn'), 'first_name'),
        ])
      )
    )
  }

  resName({ message, scene }: TelegrafContext) {
    scene.enter('reg7', { ...scene.state, name: message?.text })
  }

  async resNameDefault(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

    ctx.scene.enter('reg7', { ...ctx.scene.state, name: ctx.from?.first_name })
  }

  reqDesc({ replyWithHTML, i18n }: TelegrafContext) {
    replyWithHTML(
      i18n.t('reg.desc'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([m.callbackButton(i18n.t('reg.desc_skip'), 'skip')])
      )
    )
  }

  async resDescSkip(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

    ctx.scene.enter('reg8', { ...ctx.scene.state, descript: `` })
  }

  resDesc({ message, scene }: TelegrafContext) {
    let linkFilter = message?.text.replace(/\./g, ' ').replace(/@/g, ' ')

    scene.enter('reg8', { ...scene.state, descript: linkFilter })
  }

  reqAvatar({ replyWithHTML, i18n }: TelegrafContext) {
    replyWithHTML(i18n.t('reg.avatar'))
  }

  resAvatarPhoto({ message, scene }: TelegrafContext) {
    scene.enter('reg9', {
      ...scene.state,
      avatar: {
        file_id: message?.photo[0].file_id,
      },
    })
  }

  resAvatarVideo({ message, scene }: TelegrafContext) {
    scene.enter('reg9', {
      ...scene.state,
      avatar: {
        file_id: message?.photo[0].file_id,
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
  }: TelegrafContext) {
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

  async resConfirm(ctx: TelegrafContext) {
    await ctx.answerCbQuery()

    const { from, scene, session, callbackQuery } = ctx

    const userProfile = {
      ...scene.state,
      chat_id: from?.id,
    }

    session.profile = userProfile
    ProfileService.createProfile(userProfile)

    callbackQuery!.data === 'well'
      ? scene.enter('swiper_main', { is_first: true })
      : scene.enter('profile_menu')
  }
}

export default new RegController()
