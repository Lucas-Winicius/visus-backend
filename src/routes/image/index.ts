import { app } from '../../server'
import getImage from './getImage'
import getImages from './getImages'
import getImagesByTime from './getImagesByTime'
import postImages from './postImage'

export default async function ImageRoutes() {
  app.register(postImages)
  app.register(getImages)
  app.register(getImagesByTime)
  app.register(getImage)
}
