import { app } from '../../server'
import getImages from './getImages'
import postImages from './postImage'

export default async function ImageRoutes() {
  app.register(postImages)
  app.register(getImages)
}
