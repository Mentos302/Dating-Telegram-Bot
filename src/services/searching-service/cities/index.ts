import getCityCoords from './getCityCoords'
import getNearestCities from './getNearestCities'

export default async (name: string): Promise<string[] | undefined> => {
  const city = await getCityCoords(name)

  if (city) {
    const nearlies = await getNearestCities(city)

    return nearlies
  }
}
