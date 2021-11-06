import collections from './models'
import connection from './connection'

const db: any = {
  connection,
}

Object.keys(collections).forEach((collectionName) => {
  db[collectionName] = connection.model(
    collectionName,
    collections[collectionName]
  )
})

export default db
