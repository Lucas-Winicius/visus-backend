import { app } from '../../server'
import get from './get'
import post from './post'

export default async function UserRoutes() {
  app.register(post)
  app.register(get)
}
