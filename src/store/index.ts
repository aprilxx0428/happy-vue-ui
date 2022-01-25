import Vue from 'vue'
import Vuex from 'vuex'
import SSOClient from '@/common/sso-client'
import { setGloablConfig } from '@belvoly-vue-aioa/core'

import { getUser } from '@/services/bua/userService'

Vue.use(Vuex)
// const debug = process.env.NODE_ENV === 'development' // 生产环境

export interface User {
    /**
     * 用户账号
     */
    userUid: string
    /**
     * 用户姓名
     */
    name: string
    /**
     * 性别
     */
    sex: string
    /**
     * 邮件
     */
    email: string
    /**
     * 部门Code
     */
    orgCode: string
    /**
     * 部门名称
     */
    orgName: string
    /**
     * 单位Code
     */
    unitCode: string
    /**
     * 单位名称
     */
    unitName: string
    /**
     * 个人信息
     */
    person: {
        /**
         * 昵称
         */
        nickName: string
        /**
         * 绑定手机号
         */
        mobile: string
        /**
         * 联系地址
         */
        address: string
    }
    /**
     * 办公室信息
     */
    office: {
        officeRoom: string
        officePhone: string
        fax: string
    }
}

const state = {
    // 全局错误信息
    globalError: '',
    // 当前身份信息
    identity: {
        uid: '',
        authenticated: false,
        token: ''
    },
    token: {
        access_token: '',
        refresh_token: ''
    },
    // 当前用户信息
    user: <User>{}
}

export type StateType = typeof state

function setToken(state: StateType, token: { access_token: string; refresh_token: string }) {
    setGloablConfig({ token: token.access_token })
    state.token.access_token = token.access_token
    state.token.refresh_token = token.refresh_token
    SSOClient.setToken(token)
}

export default new Vuex.Store({
    // plugins: debug ? [createLogger()] : [],
    state: state,
    mutations: {
        setToken: setToken,
        setGlobalError(state: StateType, error) {
            state.globalError = error
        },
        loginSuccessed(state: StateType, { uid, token }: { uid: string; token: { access_token: string; refresh_token: string } }) {
            state.identity.uid = uid
            state.identity.token = token.access_token
            state.identity.authenticated = true

            SSOClient.setUserUid(uid)
            setToken(state, token)
        },
        logout(state) {
            state.identity.uid = ''
            state.identity.token = ''
            state.identity.authenticated = false

            state.token.access_token = ''
            state.token.refresh_token = ''

            SSOClient.clearToken()
            SSOClient.clearUserUid()
        },
        setUser(state, user) {
            state.user = user
        }
    },
    actions: {
        async login({ commit, dispatch }, { uid, token, refreshToken }) {
            commit('loginSuccessed', {
                uid,
                token: {
                    access_token: token,
                    refresh_token: refreshToken
                }
            })
            const result = await dispatch('setUser', uid)
            return result
        },
        async setUser({ commit }) {
            try {
                const { success, data } = await getUser(false)
                if (success) {
                    commit('setUser', data)
                }
                return success
            } catch (ex) {
                return false
            }
        }
    },
    modules: {}
})
