const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/LikelyController'

module.exports = () => {
  const scene = new Scene('action_main')

  scene.enter(controller.showCandidates)

  scene.action('yes', controller.choose)

  scene.action('no', controller.choose)

  scene.action('mail', controller.mail)

  scene.action('report', controller.report)

  scene.action('go_exit', controller.toNavigation)

  scene.on('message', controller.messageHandler)

  return scene
}
