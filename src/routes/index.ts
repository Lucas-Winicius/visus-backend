import { app } from '../server'
import HomeRoutes from './home'
import UserRoutes from './user'
import ImageRoutes from './image'

export default async function routes() {
  app.register(HomeRoutes)
  app.register(UserRoutes)
  app.register(ImageRoutes)
}
