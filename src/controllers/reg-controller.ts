import { Markup } from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'

import ProfileService from '../services/profile-service'
import DisplayController from './display-controller'

const Extra = require('telegraf/extra')

class RegController {
  greeting({ replyWithHTML, i18n }: TelegrafContext) {
    replyWithHTML(
      i18n.t('reg.greeting'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([m.callbackButton(i18n.t('yes'), 'okay')])
      )
    )
  }

  regStart({ scene }: TelegrafContext) {
    scene.enter('reg2')
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

  resGenderMale({ scene }: TelegrafContext) {
    scene.enter('reg4', { ...scene.state, gender: 1 })
  }

  resGenderFemale({ scene }: TelegrafContext) {
    scene.enter('reg4', { ...scene.state, gender: 0 })
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

  resSexMale({ scene }: TelegrafContext) {
    scene.enter('reg5', { ...scene.state, interest: 1 })
  }

  resSexFemale({ scene }: TelegrafContext) {
    scene.enter('reg5', { ...scene.state, interest: 0 })
  }

  resSexBoth({ scene }: TelegrafContext) {
    scene.enter('reg5', { ...scene.state, interest: 2 })
  }

  reqCity({ replyWithHTML, i18n }: TelegrafContext) {
    replyWithHTML(i18n.t('reg.city'))
  }

  async resCity({ message, scene, session }: TelegrafContext) {
    scene.enter('reg6', { ...scene.state, city: message?.text })

    session = {
      profile: { ...scene.state, city: message?.text },
      city: message?.text,
      citiesCache: [],
      relations: [],
    }

    DisplayController.getCandidates(session).catch((e) => console.log(e))
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

  resNameDefault({ from, scene }: TelegrafContext) {
    scene.enter('reg7', { ...scene.state, name: from?.first_name })
  }

  reqDesc({ replyWithHTML, i18n }: TelegrafContext) {
    replyWithHTML(
      i18n.t('reg.desc'),
      Extra.markup((m: Markup<any>) =>
        m.inlineKeyboard([m.callbackButton(i18n.t('reg.desc_skip'), 'skip')])
      )
    )
  }

  resDescSkip({ scene }: TelegrafContext) {
    scene.enter('reg8', { ...scene.state, descript: `` })
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

  async resConfirm({ from, scene, session, callbackQuery }: TelegrafContext) {
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
