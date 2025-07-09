import { app } from '../../server'
import getImage from './getImage'
import getImages from './getImages'
import getImagesByTime from './getImagesByTime'
import incrementView from './incrementView'
import postImages from './postImage'

export default async function ImageRoutes() {
  app.register(postImages)
  app.register(getImages)
  app.register(getImagesByTime)
  app.register(getImage)
  app.register(incrementView)
}
