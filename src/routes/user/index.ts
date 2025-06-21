import { app } from '../../server'
import get from './get'
import createUser from './createUser'
import login from './login'

export default async function UserRoutes() {
  app.register(createUser)
  app.register(login)
  app.register(get)
}
