import configManager from '@/common/config-manager'

const ssoBaseApiURI = configManager.get('sso.baseApiURI')

export default {
    apiHost: configManager.get('api.baseURI'),
    appApiHost: configManager.get('api.appApiURI'),
    unpcApiHost: configManager.get('api.unpcApiURI'),
    coreApiHost: configManager.get('api.coreApiURI'),
    publicPath: process.env.VUE_APP_PUBLICPATH,
    unpcPathHost: configManager.get('uri.unpcPathPrefix'),
    attachDowloadPathPrefix: configManager.get('uri.attachDowloadPathPrefix'),
    attachApiHost: configManager.get('api.attachApiURI'),
    sso: {
        baseApiURI: ssoBaseApiURI
    },
    dateSeparator: configManager.get('config.dateSeparator'),
    configArea: configManager.get('config.configArea'),
    defaultArea: configManager.get('config.defaultArea'),
    pageSize: configManager.get('config.pageSize'),
    defaultAvatarSrc: configManager.get('config.defaultAvatarSrc')
}
