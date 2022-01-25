import config from '../config'
import request from '../utils/irequest'
// import axios from 'axios'

/**获取一级字典项 */
function getDictionary(code) {
    return request<any>(`${config.coreApiHost}dictionary/getListByParentCode/${code}`)
}

/**获取所有字典项（树状） */
function getDicTree(code) {
    return request<any>(`${config.coreApiHost}dictionary/getDicTreeByParentCode/${code}`)
}

/**查询字典项 */
function queryDic(rootCode, queryName) {
    return request<any>(`${config.coreApiHost}dictionary/query`, {
        data: { rootCode, queryName },
        method: 'POST'
    })
}

/**获取配置项 */
function getWebConfigValue(keyName) {
    return request<any>(`${config.coreApiHost}webconfig/getByKeyName/${keyName}`)
}

// /**获取json配置 */
// function getJsonProperty(path, callback) {
//     axios
//         .get(`${config.unpcPathHost}config/${config.configArea}/${path}?t=` + new Date().getTime())
//         .then(res => {
//             if (res.status == 200) callback(res.data)
//         })
//         .catch(ex => {
//             console.log('catch', ex)
//             axios.get(`${config.unpcPathHost}config/${config.defaultArea}/${path}?t=` + new Date().getTime()).then(res => {
//                 if (res.status == 200) callback(res.data)
//                 else callback({})
//             })
//         })
// }

// /**获取json配置 */
// function getDemoJsonProperty(path, callback) {
//     axios.get(`${config.unpcPathHost}config/${path}?t=` + new Date().getTime()).then(res => {
//         if (res.status == 200) callback(res.data)
//         else callback({})
//     })
// }

/**选人控件查询机构人员 */
function queryOfficeUser(params) {
    if (!params.currentPage) params.currentPage = 1
    if (!params.pageSize) params.pageSize = 10
    return request<any>(`${config.unpcApiHost}officeUserInfo/query`, {
        data: params
    })
}

/**选人控件查询镇代表 */
function queryTownMember(params) {
    const myParams = { currentPage: 1, pageSize: 10, condition: {} }
    if (params.currentPage) myParams.currentPage = params.currentPage
    if (params.pageSize) myParams.pageSize = params.pageSize
    const condition = {}
    for (const [key, value] of Object.entries(params)) {
        //console.log(key + ':' + value)
        if (key != 'currentPage' && key != 'pageSize') condition[key] = value
    }
    myParams.condition = condition
    return request<any>(`${config.unpcApiHost}townMemberInfo/query`, {
        data: myParams,
        method: 'POST'
    })
}

/**选人控件查询市代表 */
function queryCityMember(params) {
    const myParams = { currentPage: 1, pageSize: 10, condition: {} }
    if (params.currentPage) myParams.currentPage = params.currentPage
    if (params.pageSize) myParams.pageSize = params.pageSize
    const condition = {}
    for (const [key, value] of Object.entries(params)) {
        //console.log(key + ':' + value)
        if (key != 'currentPage' && key != 'pageSize') condition[key] = value
    }
    myParams.condition = condition
    return request<any>(`${config.unpcApiHost}cityMemberInfo/query`, {
        data: myParams,
        method: 'POST'
    })
}

/**选人控件选择所有代表 */
function queryMember(params) {
    //console.log('querymember', params)
    const myParams = { currentPage: 1, pageSize: 10, condition: {} }
    if (params.currentPage) myParams.currentPage = params.currentPage
    if (params.pageSize) myParams.pageSize = params.pageSize
    const condition = {}
    for (const [key, value] of Object.entries(params)) {
        console.log(key + ':' + value)
        if (key != 'currentPage' && key != 'pageSize') condition[key] = value
    }
    myParams.condition = condition
    return request<any>(`${config.unpcApiHost}memberInfo/chooseQuery`, {
        data: myParams,
        method: 'POST'
    })
}

/**删除附件 */
function deleteAttach(params) {
    //console.log(params)
    return request<any>(`${config.attachApiHost}upload/delete`, {
        data: { id: params },
        method: 'POST'
    })
}

/**获取附件列表 */
function queryAttach(params) {
    //console.log(params)
    return request<any>(`${config.attachApiHost}upload/query`, {
        data: params
    })
}

function queryCustomApi(url, params) {
    return request<any>(url, {
        data: params
    })
}

function testQueryDictionayApi(url, params) {
    if (params && params != '') return request<any>(`${url}/${params}`)
    else return request<any>(`${url}`)
}

export default {
    getDictionary,
    //getJsonProperty,
    queryOfficeUser,
    queryTownMember,
    queryCityMember,
    queryMember,
    queryCustomApi,
    testQueryDictionayApi,
    deleteAttach,
    queryAttach,
    getWebConfigValue,
    getDicTree,
    queryDic
    //getDemoJsonProperty
}
