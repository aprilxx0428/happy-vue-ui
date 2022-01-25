import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { gets as getApps, install as appInstall } from '@/apps'
appInstall()

Vue.use(VueRouter)

const routes: RouteConfig[] = []

getApps().forEach(app => {
    routes.push(...app.routes)
})

routes.push(
    ...[
        {
            path: '/sso',
            name: 'sso',
            component: () => import('@/views/sso/Login.vue'),
            meta: {
                anonymous: true
            }
        },
        { path: '*', component: () => import('@/views/404.vue') }
    ]
)

export default routes
