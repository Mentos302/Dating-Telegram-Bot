type cityDistance = {
  pointName: string
  distance: number
}

interface ICity {
  name: string
  lat: string
  profiles?: number
  lng: string
  cached_distances?: cityDistance[]
  distance?: number
}

export default ICity
