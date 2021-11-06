const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/profile-controller'

module.exports = () => {
  const scene = new Scene('profile_menu')

  scene.enter(controller.sendProfile)

  scene.action('prof_menu1', controller.regAgain)

  scene.action('prof_menu2', controller.toChangeAvatar)

  scene.action('prof_menu3', controller.toChangeDescript)

  scene.action('prof_menu4', controller.toSwiper)

  scene.on('message', controller.messageHandler)

  return scene
}
