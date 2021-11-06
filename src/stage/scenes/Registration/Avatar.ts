const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/reg-controller'

module.exports = () => {
  const scene = new Scene('reg8')

  scene.enter(controller.reqAvatar)

  scene.on('photo', controller.resAvatarPhoto)

  scene.on('video', controller.resAvatarVideo)

  scene.on('message', (ctx: TelegrafContext) => ctx.scene.reenter('reg8'))

  return scene
}
