import { utils } from '@belvoly-vue-aioa/core'
import { RequestOption, ResponseOption as RO } from '@belvoly-vue-aioa/core/utils/request'
const { request: r, requestVariant: rv } = utils.request
//import { globalConfig } from '@belvoly-vue-aioa/core'
import componentConfig from '../config'
//import gloablConfig from '@belvoly-vue-aioa/core/config'

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

    const token = componentConfig.token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
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
    const token = componentConfig.token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
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

export default request
