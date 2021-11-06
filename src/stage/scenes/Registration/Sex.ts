const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/reg-controller'

module.exports = () => {
  const scene = new Scene('reg4')

  scene.enter(controller.reqSex)

  scene.action('boys', controller.resSexMale)

  scene.action('girls', controller.resSexFemale)

  scene.action('both', controller.resSexBoth)

  scene.on('message', (ctx: TelegrafContext) => ctx.scene.reenter('reg4'))

  return scene
}
