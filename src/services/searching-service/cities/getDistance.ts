import ICity from '../../../interfaces/ICIty'
import { getDistance } from 'geolib'
import db from '../../../database'

const { City } = db

type cityDistance = {
  pointName: string
  distance: number
}

export default async (from: ICity, to: ICity): Promise<number> => {
  const { cached_distances } = from

  if (cached_distances?.length) {
    const data: cityDistance | undefined = cached_distances.find(
      (e) => e.pointName === to.name
    )

    if (data) return data.distance
  }

  const distance = await calculateDistance(from, to)

  return distance
}

const calculateDistance = async (from: ICity, to: ICity): Promise<number> => {
  const { name, lat, lng, profiles } = from

  const distance: number = Math.round(
    getDistance(
      { latitude: lat, longitude: lng },
      { latitude: to.lat, longitude: to.lng },
      1
    ) / 1000
  )

  if (profiles && profiles > 10) {
    City.updateOne(
      { name },
      { $push: { cached_distances: { pointName: to.name, distance } } }
    ).catch((e: Error) => console.log(e))

    City.updateOne(
      { name: to.name },
      { $push: { cached_distances: { pointName: name, distance } } }
    ).catch((e: Error) => console.log(e))
  }

  return distance
}
