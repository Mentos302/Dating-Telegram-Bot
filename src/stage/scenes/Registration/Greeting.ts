const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/reg-controller'

module.exports = () => {
  const scene = new Scene('reg1')

  scene.enter(controller.greeting)

  scene.action('okay', controller.regStart)

  scene.on('message', (ctx: TelegrafContext) => ctx.scene.reenter('reg1'))

  return scene
}
