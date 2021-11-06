const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/nav-controller'

module.exports = () => {
  const scene = new Scene('swiper_nav')

  scene.enter(controller.showMenu)

  scene.action('continue', controller.toMainScene)

  scene.action('profile', controller.toProfileScene)

  scene.action('close', controller.closeConfirmation)

  scene.action('close_confirm', controller.closeProfile)

  scene.action('go_back', controller.showMenu)

  return scene
}
