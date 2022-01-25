import { request } from '@/utils/request'

/**
 * 上传附件
 * @method upload
 *
 */
const upload = function(uploadData) {
    return request('/sharedservice/blob/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            ...uploadData
        }
    })
}

/**
 * 更新附件业务关联表
 * @method updateRelevance
 *
 */
const updateRelevance = function(updateRelevanceData) {
    return request('/sharedservice/blob/updateRelevance', {
        method: 'POST',
        data: {
            ...updateRelevanceData
        }
    })
}

/**
 * 删除附件
 * @method deleteAttachment
 */
const deleteAttachment = function(id) {
    return request(`/sharedservice/blob/delete/${id}`, {
        method: 'POST'
    })
}

/**
 * 删除业务数据关联附件
 * @method deleteRelevance
 * @param refTableId 关联表ID
 * @param refTableName 关联表名称
 */
const deleteRelevance = function(deleteRelevanceData: { refTableId: string; refTableName: string }) {
    return request(`/sharedservice/blob/delete?refTableId=${deleteRelevanceData.refTableId}&refTableName=${deleteRelevanceData.refTableName}`, {
        method: 'POST'
    })
}

/**
 * 查询附件列表
 * @method query
 *
 */
const query = function(queryData) {
    return request('/sharedservice/blob/query', {
        method: 'GET',
        data: {
            ...queryData
        }
    })
}

export default {
    upload,
    updateRelevance,
    deleteAttachment,
    deleteRelevance,
    query
}
