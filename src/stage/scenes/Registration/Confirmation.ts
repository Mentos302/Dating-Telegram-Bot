const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/reg-controller'
import { ITelegrafContext } from '../../../interfaces/ITelegrafContext'

module.exports = () => {
  const scene = new Scene('reg9')

  scene.enter(controller.reqConfirm)

  scene.action('well', controller.resConfirm)

  scene.action('edit', controller.resConfirm)

  scene.on('message', (ctx: ITelegrafContext) => ctx.scene.reenter('reg9'))
  return scene
}
