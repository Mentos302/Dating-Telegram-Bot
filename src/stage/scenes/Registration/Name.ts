const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/reg-controller'

module.exports = () => {
  const scene = new Scene('reg6')

  scene.enter(controller.reqName)

  scene.action('first_name', controller.resNameDefault)

  scene.on('text', controller.resName)

  scene.on('message', (ctx: TelegrafContext) => ctx.scene.reenter('reg6'))

  return scene
}
