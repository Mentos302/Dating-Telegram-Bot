const Scene = require('telegraf/scenes/base')
import { TelegrafContext } from 'telegraf/typings/context'
import controller from '../../../controllers/reg-controller'

module.exports = () => {
  const scene = new Scene('reg4')

  scene.enter(controller.reqSex)

  scene.on('callback_query', controller.resSex)

  scene.on('message', controller.resCandidateAge)

  return scene
}
