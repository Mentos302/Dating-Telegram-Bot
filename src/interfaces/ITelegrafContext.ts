import { TelegrafContext } from 'telegraf/typings/context'

export interface ITelegrafContext extends TelegrafContext {
  session: any
  scene: any
  i18n: any
  callbackQuery: any
}
