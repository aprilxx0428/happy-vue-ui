//const BASE_HOST = 'https://fxrd.fengxian.gov.cn'
BASE_HOST = 'http://192.168.12.178'
const BEYONDBIT_SSO_BASE_URI = BASE_HOST + '/sso'
const BEYONDBIT_GATEWAY_BASE_URI = BASE_HOST + '/api'
const BEYONDBIT_AIOA_SHARED_SERVICE_BASE_URI = BEYONDBIT_GATEWAY_BASE_URI + '/sharedservice'

window.$config = {
    sso: {
        baseApiURI: BEYONDBIT_SSO_BASE_URI,
        loginUrl: BEYONDBIT_SSO_BASE_URI + '/signOn',
        logoutUrl: BEYONDBIT_SSO_BASE_URI + '/signOut',
        ticketUrl: BEYONDBIT_SSO_BASE_URI + '/api/getUser',
        sessionName: 'sso-user-uid'
    },
    api: {
        baseURI: BEYONDBIT_GATEWAY_BASE_URI,
        appApiURI: 'http://192.168.101.135:2666',
        coreApiURI: BEYONDBIT_GATEWAY_BASE_URI + '/private/iCore/',
        unpcApiURI: BEYONDBIT_GATEWAY_BASE_URI + '/private/unpc/',
        //unpcApiURI: 'http://localhost:8008/unpcApi/',
        attachApiURI: BEYONDBIT_GATEWAY_BASE_URI + '/unpc/'
        //attachApiURI: 'http://localhost:1203/unpc/'
    },
    sharedservice: {
        baseURI: BEYONDBIT_AIOA_SHARED_SERVICE_BASE_URI,
        assets: {
            baseURI: BEYONDBIT_AIOA_SHARED_SERVICE_BASE_URI + '/assets'
        }
    },
    uri: {
        //读取json文件使用
        unpcPathPrefix: 'http://localhost:8008/unpc/',
        //下载附件使用，跟配置项中UploadPathPrefix的值一致
        attachDowloadPathPrefix: 'http://192.168.12.178/api/unpc/upload/'
    },
    config: {
        configArea: 'hk',
        defaultArea: 'fx',
        dateSeparator: ' 至 ',
        pageSize: 15
    }
}
