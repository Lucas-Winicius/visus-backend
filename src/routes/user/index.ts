import { app } from '../../server'
import get from './get'

export default async function UserRoutes() {
  app.register(get)
}
