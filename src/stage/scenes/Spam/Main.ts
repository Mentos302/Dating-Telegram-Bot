const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/admin-controller'

module.exports = () => {
  const scene = new Scene('admin_spam')

  scene.enter(controller.enter)

  scene.on('message', controller.sendMessage)

  return scene
}
