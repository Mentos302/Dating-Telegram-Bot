const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/swiper-controller'

module.exports = () => {
  const scene = new Scene('swiper_main')

  scene.enter(controller.enter)

  scene.action('yes', controller.choose)

  scene.action('no', controller.choose)

  scene.action('report', controller.report)

  scene.action('go_exit', controller.toNavigation)

  scene.on('message', controller.toNavigation)

  return scene
}
