const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/likely-controller'

module.exports = () => {
  const scene = new Scene('likely')

  scene.enter(controller.enter)

  scene.action('yes', controller.choose)

  scene.action('no', controller.choose)

  scene.action('report', controller.report)

  scene.action('go_exit', controller.toNavigation)

  scene.action('continue', controller.continue)

  scene.on('message', controller.toNavigation)

  return scene
}
