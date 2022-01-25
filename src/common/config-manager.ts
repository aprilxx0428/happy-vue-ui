const getConfig = function() {
    return (<any>window).$config
}

/**
 * 获取配置数据
 * @param {String} name 参数名称
 */
const get = function(name: string) {
    const splitNames = name.split('.')
    let graph = getConfig()

    for (let i = 0; i < splitNames.length; ++i) {
        graph = graph[splitNames[i]]
    }

    return graph
}

/**
 * web.config.js配置管理类
 */
export default {
    getConfig,
    get
}
