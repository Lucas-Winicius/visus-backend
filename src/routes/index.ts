import { app } from '../server'
import HomeRoutes from './home'
import UserRoutes from './user'

export default async function routes() {
  app.register(HomeRoutes)
  app.register(UserRoutes)
}
