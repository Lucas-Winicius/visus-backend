import { app } from '../../server'
import postImages from './postImage'

export default async function ImageRoutes() {
  app.register(postImages)
}
