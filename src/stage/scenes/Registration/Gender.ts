const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/reg-controller'

module.exports = () => {
  const scene = new Scene('reg3')

  scene.enter(controller.reqGender)

  scene.action('boy', controller.resGenderMale)

  scene.action('girl', controller.resGenderFemale)

  scene.on('message', (ctx: TelegrafContext) => ctx.scene.reenter('reg3'))

  return scene
}
