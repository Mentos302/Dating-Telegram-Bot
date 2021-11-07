import db from '../database'

const { Relation } = db

class RelationsService {
  async newRelation(host_id: number, cli_id: number, host_like: boolean) {
    try {
      await Relation.create({
        host_id,
        cli_id,
        host_like,
        cli_checked: false,
      })
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with creating new relation`)
    }
  }

  async checkNewLikes(cli_id: number): Promise<number[]> {
    try {
      const likedRelations = await Relation.find({
        cli_id,
        cli_checked: false,
      })

      likedRelations.map((e: any) => {
        e.host_id
      })

      return likedRelations
    } catch (e) {
      console.log(e)

      throw new Error(`Unexpected error with new likes checking`)
    }
  }

  async getUserRelations(cli_id: number): Promise<number[] | undefined> {
    try {
      let relations = await Relation.find(
        { host_id: cli_id },
        { cli_id: 1, _id: 0 }
      )
      relations = relations
        .concat(
          await Relation.find(
            { cli_id, host_like: false },
            { host_id: 1, _id: 0 }
          )
        )
        .concat(
          await Relation.find(
            { cli_id, cli_checked: true },
            { host_id: 1, _id: 0 }
          )
        )
        .concat(
          await Relation.find(
            { cli_id, host_like: true, cli_checked: false },
            { host_id: 1, _id: 0 }
          )
        )

      relations = relations.map((e: any) =>
        e.host_id == undefined ? (e = e.cli_id) : (e = e.host_id)
      )

      return relations
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with getting user relations`)
    }
  }

  async updateLikely(host_id: number, cli_id: number) {
    try {
      await Relation.updateOne({ host_id, cli_id }, { cli_checked: true })
    } catch (e) {
      console.log(e)

      throw new Error(`Unexprected error with likely updating`)
    }
  }

  async deleteLikes(cli_id: number) {
    try {
      await Relation.deleteMany({ cli_id })
    } catch (e) {
      console.log(e)

      throw new Error(`Unexpected error with likes deleting`)
    }
  }

  async deleteAllActivities(cli_id: number) {
    try {
      await Relation.deleteMany({ host_id: cli_id })
      await Relation.deleteMany({ cli_id })
    } catch (e) {
      console.log(e)

      throw new Error(`Unexpected error with activities deleting`)
    }
  }
}

export default new RelationsService()
