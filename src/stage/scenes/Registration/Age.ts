const Scene = require('telegraf/scenes/base')
import controller from '../../../controllers/reg-controller'

module.exports = () => {
  const scene = new Scene('reg2')

  scene.enter(controller.reqAge)

  scene.on('message', controller.resAge)

  return scene
}
