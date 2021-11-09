import ICity from '../../../interfaces/ICIty'
import getDistance from './getDistance'
import db from '../../../database'
import BotError from '../../../exceptions/error-notification'

const { City } = db

export default async (host_city: ICity): Promise<string[]> => {
  try {
    let cities = await City.find({
      name: { $ne: host_city.name },
      profiles: { $ne: 0 },
    })

    cities = await Promise.all(
      cities.map(async (e: ICity) => {
        e.distance = await getDistance(host_city, e)

        return e
      })
    )

    cities = cities
      .sort((a: ICity, b: ICity) => {
        if (a.distance && b.distance) {
          return a.distance - b.distance
        }
      })
      .map((e: ICity) => e.name)

    return cities
  } catch (e: any) {
    throw new BotError(`Unexpected error with nearest cities getting`, e)
  }
}
