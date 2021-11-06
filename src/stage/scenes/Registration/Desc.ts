const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/reg-controller'

module.exports = () => {
  const scene = new Scene('reg7')

  scene.enter(controller.reqDesc)

  scene.action('skip', controller.resDescSkip)

  scene.on('text', controller.resDesc)

  scene.on('message', (ctx: TelegrafContext) => ctx.scene.reenter('reg7'))

  return scene
}
