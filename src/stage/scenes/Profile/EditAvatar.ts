const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/profile-controller'

module.exports = () => {
  const scene = new Scene('editavatar')

  scene.enter((ctx: TelegrafContext) =>
    ctx.replyWithHTML(ctx.i18n.t('reg.avatar'))
  )

  scene.on('photo', controller.changePhoto)

  scene.on('video', controller.changeVideo)

  scene.on('message', (ctx: TelegrafContext) => {
    ctx.replyWithHTML(ctx.i18n.t('reg.avatar'))
  })

  return scene
}
