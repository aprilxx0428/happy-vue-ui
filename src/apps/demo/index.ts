import { register, AppConfig } from '../index'
import routes from './route'

const app: AppConfig = {
    name: 'user',
    routes: routes
}

export function install() {
    register(app)
}
