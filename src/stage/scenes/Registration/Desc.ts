const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/reg-controller'
import { ITelegrafContext } from '../../../interfaces/ITelegrafContext'

module.exports = () => {
  const scene = new Scene('reg7')

  scene.enter(controller.reqDesc)

  scene.action('skip', controller.resDescSkip)

  scene.on('text', controller.resDesc)

  scene.on('message', (ctx: ITelegrafContext) => ctx.scene.reenter('reg7'))

  return scene
}
