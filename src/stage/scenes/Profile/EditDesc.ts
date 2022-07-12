const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/profile-controller'
import { ITelegrafContext } from '../../../interfaces/ITelegrafContext'

module.exports = () => {
  const scene = new Scene('editdescript')

  scene.enter((ctx: ITelegrafContext) =>
    ctx.replyWithHTML(ctx.i18n.t('reg.desc'))
  )

  scene.on('text', controller.changeDesc)

  scene.on('message', (ctx: ITelegrafContext) => {
    ctx.replyWithHTML(ctx.i18n.t('reg.desc'))
  })

  return scene
}
