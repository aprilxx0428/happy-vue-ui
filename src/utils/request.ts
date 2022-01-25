import { utils } from '@belvoly-vue-aioa/core'
import { RequestOption, ResponseOption as RO } from '@belvoly-vue-aioa/core/utils/request'
const { request: r, requestVariant: rv } = utils.request
import store from '@/store'
import rootConfig from '@/config'
import { needReLogin } from '@/common/app'

interface ResponseOption<T> extends RO<T> {
    isHandlerAccessTokenError?: boolean
}

export function request<T>(
    url: string,
    options?: RequestOption & { cancel?: (cancel: () => void) => void },
    resOption?: ResponseOption<T>
): Promise<{ data?: T; error?: any; response?: any; success: boolean; isCancel?: boolean }> {
    const config = {
        headers: {},
        ...options
    }
    const token = store.state.token
    if (token && token.access_token) {
        config.headers['Authorization'] = `Bearer ${token.access_token}`
    }

    const ro = commomResponse(url, options, resOption)

    return r(url, config, ro)
}

export function requestVariant<T>(
    url: string,
    options?: RequestOption,
    resOption?: ResponseOption<T>
): {
    /**
     * 取消的方法
     */
    abort: () => void
    /**
     * 执行的promise
     */
    promise: Promise<{
        data?: T
        error?: any
        response?: any
        success: boolean
        isCancel?: boolean
    }>
} {
    const config = {
        headers: {},
        ...options
    }
    const token = store.state.token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token.access_token}`
    }

    const ro = commomResponse(url, options, resOption)

    return rv(url, config, ro)
}

function commomResponse<T>(url: string, options?: RequestOption, resOption?: ResponseOption<T>) {
    return {
        ...resOption,
        handleCatch: async e => {
            const status = getValue(e, 'response.status')
            const flag = getValue(e, 'data.flag') || getValue(e, 'response.data.flag')
            const handleResult: {
                errorText?: string
                result?: any
                handle: boolean
            } = { handle: false }
            if (resOption && resOption.isHandlerAccessTokenError === false) {
                return handleResult
            }

            if (status === 401) {
                if (flag === 4) {
                    handleResult.errorText = '登录超时，请刷新重试或重新登录'
                    handleResult.handle = true
                }
                if (flag === 2) {
                    const token = store.state.token
                    const { success, data, response } = await refreshToken(token.refresh_token, token.access_token)
                    if (success) {
                        store.commit('setToken', { access_token: data.access_token, refresh_token: data.refresh_token })
                        const result = request<T>(url, options)
                        handleResult.result = result
                        handleResult.handle = true
                    } else {
                        const flag = response.data.flag
                        // http://yapi.beyondbit.com/project/25/interface/api/1235
                        if ([4, 6, 8].includes(flag)) {
                            handleResult.errorText = '刷新令牌错误'
                            handleResult.handle = true
                        }
                    }
                }
                if (handleResult.handle && handleResult.errorText) {
                    needReLogin(handleResult.errorText)
                }
            }

            return handleResult
        }
    }
}

function getValue(target, key: string, defaultValue?) {
    const paths = typeof key === 'string' ? key.split('.') : [key]
    try {
        return paths.reduce((prev, path) => {
            return prev[path]
        }, target)
    } catch (e) {
        return defaultValue || ''
    }
}

export function refreshToken(refreshToken: string, access_token: string) {
    return request<{
        access_token: string
        refresh_token: string
        expire: number
        scopes: string
    }>(
        `${rootConfig.sso.baseApiURI}/oauth2/refresh_token`,
        {
            method: 'GET',
            data: {
                access_token: access_token,
                refresh_token: refreshToken
            }
        },
        {
            isShowError: re => {
                const flag = re.data.flag
                // http://yapi.beyondbit.com/project/25/interface/api/1235
                return ![4, 6, 8].includes(flag)
            }
        }
    )
}

export default request
