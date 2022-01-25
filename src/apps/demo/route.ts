import { nanoid } from 'nanoid'
import Emplty from '@/views/Empty.vue'
import { RouteConfig } from 'vue-router'

export const userRouteNames = {
    main: nanoid(),
    home: nanoid(),
    detail: nanoid(),
    edit: nanoid(),
    add: nanoid(),
    demoInfo: nanoid(),
    demoList: nanoid(),
    demoMain: nanoid(),
    demoTabs: nanoid(),
    demoTable: nanoid(),
    demoMultiRowTable: nanoid(),
    demoTest: nanoid(),
    easyIndex: nanoid()
}

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: '/demo'
    },
    {
        path: '/demo',
        name: userRouteNames.demoMain,
        component: Emplty,
        redirect: { name: userRouteNames.home },
        children: [
            {
                path: '',
                name: userRouteNames.demoList,
                component: () => import('./views/demo/Index.vue'),
                meta: {
                    title: '测试列表',
                    pageTitle: '测试列表',
                    keepAlive: false,
                    isGoIndex: true,
                    anonymous: false
                }
            },
            {
                path: 'IndexWithSlot',
                name: userRouteNames.demoList,
                component: () => import('./views/demo/IndexWithSlot.vue'),
                meta: {
                    title: '测试列表',
                    pageTitle: '测试列表',
                    keepAlive: false,
                    isGoIndex: true,
                    anonymous: false
                }
            },
            {
                path: 'info',
                name: userRouteNames.demoInfo,
                component: () => import('./views/demo/Info.vue'),
                props: true,
                meta: {
                    title: '测试info',
                    anonymous: false
                }
            },
            {
                path: 'tabs',
                name: userRouteNames.demoTabs,
                component: () => import('./views/demo/Tabs.vue'),
                props: true,
                meta: {
                    title: '测试tabs',
                    anonymous: false
                }
            },
            {
                path: 'table',
                name: userRouteNames.demoTable,
                component: () => import('./views/demo/Table.vue'),
                props: true,
                meta: {
                    title: '测试table',
                    anonymous: false
                }
            },
            {
                path: 'multiRowTable',
                name: userRouteNames.demoMultiRowTable,
                component: () => import('./views/demo/MultiRowTable.vue'),
                props: true,
                meta: {
                    title: '测试multiRowTable',
                    anonymous: false
                }
            },
            {
                path: 'test',
                name: userRouteNames.demoTest,
                component: () => import('./views/demo/Test.vue'),
                props: true,
                meta: {
                    title: 'dddddd',
                    anonymous: true
                }
            },
            {
                path: 'easyIndex',
                name: userRouteNames.easyIndex,
                component: () => import('./views/demo/EasyIndex.vue'),
                props: true,
                meta: {
                    title: 'easyIndex',
                    anonymous: true
                }
            }
        ]
    }
]

export default routes
