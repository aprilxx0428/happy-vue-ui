import './common/promiseExtend'
import { registerMessageHandler, MessageEventActionName, PortalFrameSideBarChangeData } from '@/common/portal-client'
import Vue from 'vue'
import App from './App.vue'
import routes from './router'
import store from './store'
import sso from './common/sso-client'
import './filters'
import ElementUI from 'element-ui'
import './assets/css/element-#4A90E2/index.css' // 阻止启动生产消息
import 'babel-polyfill'
import 'url-search-params-polyfill'
import config from '@/config'
import VueRouter from 'vue-router'
import { setComponentConfig } from '../packages/components/config'
import { setGloablConfig } from '@belvoly-vue-aioa/core'
import { setReLoginAction } from './common/app'
import './assets/myCss/common.css'

//自定义阿里icon
import '@/assets/icon/iconfont.css'
setGloablConfig({ apiHost: config.apiHost })
setComponentConfig({
    apiHost: config.apiHost,
    coreApiHost: config.coreApiHost,
    configArea: config.configArea,
    defaultArea: config.defaultArea,
    unpcApiHost: config.unpcApiHost,
    unpcPathHost: config.unpcPathHost,
    attachApiHost: config.attachApiHost,
    defaultAvatarSrc: config.defaultAvatarSrc,
    attachDowloadPathPrefix: config.attachDowloadPathPrefix
})

Vue.use(ElementUI)
Vue.config.productionTip = false

async function initApp() {
    setReLoginAction(() => {
        const { href } = router.resolve({ name: 'sso', query: { redirectUrl: router.currentRoute.fullPath } })
        window.location.replace(href)
    })
    const uid = sso.getUserUid()
    const token = sso.getToken()
    if (uid && token) {
        setComponentConfig({ token: token.access_token })
        const isSuccess = await store.dispatch('login', { uid: uid, token: token.access_token, refreshToken: token.refresh_token })
        if (!isSuccess) {
            store.commit('logout')
        }
    }

    const router = new VueRouter({
        base: config.publicPath,
        mode: 'history',
        routes
    })

    router.beforeEach((to, from, next) => {
        const title = to.meta && to.meta.title
        if (title) {
            document.title = title
        }
        if (to.matched.some(r => r.meta && r.meta.anonymous)) {
            next()
        } else {
            if (store.state.identity.authenticated) {
                next()
            } else {
                next({
                    path: '/sso',
                    query: {
                        redirectUrl: to.fullPath
                    }
                })
            }
        }
    })

    registerMessageHandler(MessageEventActionName.portalFrameSideBarChange, (data: PortalFrameSideBarChangeData) => {
        // 接受门户左侧菜单配置了frame=2后，由当前系统自己切换url
        let url = data.url
        url = url.replace(window.location.origin, '')
        if (config.publicPath) {
            url = url.replace(config.publicPath, '')
        }
        url = url || '/'
        url = url.indexOf('?') === 0 ? '/' + url : url
        router.push(url)
    })

    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
}

initApp()
