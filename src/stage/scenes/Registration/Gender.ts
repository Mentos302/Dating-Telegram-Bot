const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/reg-controller'
import { ITelegrafContext } from '../../../interfaces/ITelegrafContext'

module.exports = () => {
  const scene = new Scene('reg3')

  scene.enter(controller.reqGender)

  scene.action('boy', controller.resGenderMale)

  scene.action('girl', controller.resGenderFemale)

  scene.on('message', (ctx: ITelegrafContext) => ctx.scene.reenter('reg3'))

  return scene
}
