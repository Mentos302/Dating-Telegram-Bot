const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/reg-controller'
import { ITelegrafContext } from '../../../interfaces/ITelegrafContext'

module.exports = () => {
  const scene = new Scene('reg6')

  scene.enter(controller.reqName)

  scene.action('first_name', controller.resNameDefault)

  scene.on('text', controller.resName)

  scene.on('message', (ctx: ITelegrafContext) => ctx.scene.reenter('reg6'))

  return scene
}
