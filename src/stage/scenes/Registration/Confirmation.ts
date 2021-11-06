const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/reg-controller'

module.exports = () => {
  const scene = new Scene('reg9')

  scene.enter(controller.reqConfirm)

  scene.action('well', controller.resConfirm)

  scene.action('edit', controller.resConfirm)

  scene.on('message', (ctx: TelegrafContext) => ctx.scene.reenter('reg9'))
  return scene
}
