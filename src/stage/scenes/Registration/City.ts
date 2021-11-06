const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/reg-controller'

module.exports = () => {
  const scene = new Scene('reg5')

  scene.enter(controller.reqCity)

  scene.on('text', controller.resCity)

  scene.on('message', (ctx: TelegrafContext) => ctx.scene.reenter('reg5'))

  return scene
}
