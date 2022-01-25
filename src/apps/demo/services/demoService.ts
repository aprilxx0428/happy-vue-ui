import config from '@/config'
import request from '@/utils/request'

/**
 * 查询用户
 * @method query
 */

function queryList(params) {
    return request<any>(`${config.unpcApiHost}noticeInfo/query`, {
        method: 'POST',
        data: params
    })
}

export default {
    queryList
}
