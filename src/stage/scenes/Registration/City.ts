const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/reg-controller'
import { ITelegrafContext } from '../../../interfaces/ITelegrafContext'

module.exports = () => {
  const scene = new Scene('reg5')

  scene.enter(controller.reqCity)

  scene.on('text', controller.resCity)

  scene.on('message', (ctx: ITelegrafContext) => ctx.scene.reenter('reg5'))

  return scene
}
