const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/reg-controller'
import { ITelegrafContext } from '../../../interfaces/ITelegrafContext'

module.exports = () => {
  const scene = new Scene('reg8')

  scene.enter(controller.reqAvatar)

  scene.on('photo', controller.resAvatarPhoto)

  scene.on('video', controller.resAvatarVideo)

  scene.on('message', (ctx: ITelegrafContext) => ctx.scene.reenter('reg8'))

  return scene
}
