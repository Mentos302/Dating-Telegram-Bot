import { ITelegrafContext } from '../interfaces/ITelegrafContext'
import AdminService from '../services/admin-service'

class AdminController {
  enter(ctx: ITelegrafContext) {
    if (`${ctx.from!.id}` == process.env.ADMIN_ID) {
      return ctx.reply('Надішліть повідомлення для розсилки користувачам боту.')
    }

    return ctx.scene.leave()
  }

  async sendMessage(ctx: ITelegrafContext) {
    try {
      const users = await AdminService.getUsers()

      if (users) {
        let blocked = 0

        ctx.telegram.sendMessage(
          process.env.ADMIN_ID as string,
          `Розпочинаю розсилку по ${users.length} користувчах`
        )

        await Promise.all(
          users.map(async (user) => {
            setTimeout(async () => {
              try {
                await ctx.telegram.sendMessage(
                  user.chat_id,
                  ctx.message?.text as any
                )
              } catch (e: any) {
                if (e.code === 403) {
                  AdminService.removeUser(user.chat_id)

                  blocked++
                } else {
                  console.log(e)
                }
              }
            }, 50)
          })
        )

        ctx.scene.leave()
      }
    } catch (e) {
      ctx.telegram.sendMessage(
        process.env.ADMIN_ID as string,
        'При розсилці повідомлення, щось пішло не так: ' + `${e}`
      )
    }
  }
}

export default new AdminController()
