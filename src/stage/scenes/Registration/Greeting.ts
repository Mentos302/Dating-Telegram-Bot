const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/reg-controller'
import { ITelegrafContext } from '../../../interfaces/ITelegrafContext'

module.exports = () => {
  const scene = new Scene('reg1')

  scene.enter(controller.greeting)

  scene.action('okay', controller.regStart)

  scene.on('message', (ctx: ITelegrafContext) => ctx.scene.reenter('reg1'))

  return scene
}
