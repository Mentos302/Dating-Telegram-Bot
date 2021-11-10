import cyrillicToTranslit from 'cyrillic-to-translit-js'
import ICity from '../../../interfaces/ICIty'
import db from '../../../database'
import BotError from '../../../exceptions/botError'

const fetch = require('node-fetch')

const { City } = db

export default async (name: string): Promise<ICity | undefined> => {
  try {
    let city: ICity = await City.findOne({ name })

    if (city) {
      return city
    } else {
      let adress = new cyrillicToTranslit({ preset: 'uk' }).transform(name, ' ')
      let nameURL =
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        adress +
        `&key=${process.env.GOOGLE_MAPS_KEY}`
      let response = await fetch(nameURL)
      let commits: any | undefined = await response.json()
      if (commits.results[0]) {
        const { lat, lng } = commits.results[0].geometry.location

        const city: ICity = {
          name,
          lat,
          lng,
        }

        await City.create(city)

        return city
      } else {
        throw new Error('City not found')
      }
    }
  } catch (e: any) {
    throw new BotError(`Unexpected error with city coords getting`, e)
  }
}
