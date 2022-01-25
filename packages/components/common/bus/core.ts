import Vue from 'vue'

export const Bus = new Vue({
    methods: {
        emit(event, ...args) {
            this.$emit(event, ...args)
        },
        on(event, callback) {
            this.$on(event, callback)
        },
        off(event, callback) {
            this.$off(event, callback)
        }
    }
})
