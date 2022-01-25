import Vue from 'vue'
import dayjs from 'dayjs'

/**
 * 日期格式化过滤器
 * @example
 *      date | dateFormat('YYYY-MM-DD')
 */
Vue.filter('dateFormat', function(value, format) {
    if (!value) {
        return
    }

    const date = dayjs(value)
    return date.format(format)
})
