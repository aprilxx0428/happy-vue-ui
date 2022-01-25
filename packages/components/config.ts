interface ComponentConfigType {
    apiHost?: string
    coreApiHost?: string
    unpcApiHost?: string
    unpcPathHost?: string
    defaultArea?: string
    configArea?: string
    attachApiHost?: string
    dateSeparator?: string
    attachDowloadPathPrefix?: string
    defaultAvatarSrc?: string
    token?: string
}
const componentConfig: ComponentConfigType = {
    apiHost: '',
    coreApiHost: '',
    unpcApiHost: '',
    unpcPathHost: '',
    defaultArea: '',
    configArea: '',
    attachApiHost: '',
    dateSeparator: '-',
    attachDowloadPathPrefix: '',
    defaultAvatarSrc: '',
    token: ''
}
export function setComponentConfig(config: typeof componentConfig) {
    if (config.apiHost) {
        componentConfig.apiHost = config.apiHost
    }
    if (config.coreApiHost) {
        componentConfig.coreApiHost = config.coreApiHost
    }
    if (config.unpcApiHost) {
        componentConfig.unpcApiHost = config.unpcApiHost
    }
    if (config.unpcPathHost) {
        componentConfig.unpcPathHost = config.unpcPathHost
    }
    if (config.defaultArea) {
        componentConfig.defaultArea = config.defaultArea
    }
    if (config.configArea) {
        componentConfig.configArea = config.configArea
    }
    if (config.attachApiHost) {
        componentConfig.attachApiHost = config.attachApiHost
    }
    if (config.dateSeparator) {
        componentConfig.dateSeparator = config.dateSeparator
    }
    if (config.attachDowloadPathPrefix) {
        componentConfig.attachDowloadPathPrefix = config.attachDowloadPathPrefix
    }
    if (config.defaultAvatarSrc) {
        componentConfig.defaultAvatarSrc = config.defaultAvatarSrc
    }
    if (config.token) {
        componentConfig.token = config.token
    }
}

export default componentConfig
