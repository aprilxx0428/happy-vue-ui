import { install as demoInstall } from './demo'

export interface AppConfig {
    name: string
    routes: any[]
    module?: {}
    locales?: {}
}

const APPS: AppConfig[] = []

/**
 * 注册APP
 * @param app app配置
 */
export function register(app: AppConfig) {
    APPS.push(app)
}

/**
 * 获取所有APP
 */
export function gets(): AppConfig[] {
    return APPS
}

let isInstall = false

export function install() {
    if (!isInstall) {
        //
        demoInstall()
    }
    isInstall = true
}
