import request from '@/utils/request'
import config from '@/config'

/**
 * 查询用户个人信息
 * @method getUser
 * @param {string} uid
 */
export function getUser(isAutoHandleTokenError = true) {
    return request(
        `${config.apiHost}/private/bua/user/getUserForMultiUnit`,
        {
            method: 'GET',
            data: {}
        },
        {
            isShowError: r => {
                if (r.status === 401) {
                    return false
                } else {
                    return true
                }
            },
            isHandlerAccessTokenError: isAutoHandleTokenError
        }
    )
}

/**
 * 查询用户头像
 * @method getPicture
 * @param {string} uid
 */
const getPicture = function(uid) {
    return request(`${config.apiHost}/bua/user/getPicture`, {
        method: 'GET',
        data: {
            userUid: uid
        }
    })
}

export default {
    getUser,
    getPicture
}
