import { app } from '../../server'
import addLikeImage from './addLikeImage'

export default async function LikeRoutes() {
  app.register(addLikeImage)
}
