const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/refferal-controller'

module.exports = () => {
  const scene = new Scene('refferal')

  scene.enter(controller.enter)

  scene.action('go_exit', controller.toNavigation)

  return scene
}
