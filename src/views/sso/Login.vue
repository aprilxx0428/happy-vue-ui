<template>
    <div>{{ message }}</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SSOClient from '@/common/sso-client'
@Component
export default class Login extends Vue {
    message = ''
    fullscreenLoading = false
    mounted() {
        const query = this.$route.query
        if (query && query.ticket) {
            this.getUser(query.ticket)
        } else {
            window.location.href = SSOClient.getLoginUrl() + '?actionUrl=' + encodeURI(window.location.href)
        }
    }

    async getUser(ticket) {
        const loading = this.$loading({
            lock: true,
            fullscreen: true,
            background: 'rgba(255, 255, 255, 0.7)'
        })
        const { success, data } = await SSOClient.getUser(ticket)

        loading.close()

        if (!success) {
            this.message = '通过Ticket获取用户失败'
        } else {
            const { accessToken, refreshToken, identity } = data
            await this.onLoginSuccessed({ uid: identity, token: accessToken, refreshToken: refreshToken })
        }
    }

    async onLoginSuccessed({ uid, token, refreshToken }) {
        const loading = this.$loading({
            lock: true,
            fullscreen: true,
            spinner: 'sso-loading-spinner',
            background: 'rgba(255, 255, 255, 0.7)'
        })
        const isSuccess = await this.$store.dispatch('login', { uid: uid, token: token, refreshToken: refreshToken })
        loading.close()

        if (isSuccess) {
            this.message = '获取成功，正在跳转..'

            const query = this.$route.query
            this.$router.push(<string>query.redirectUrl || <string>query.actionUrl || '/')
        } else {
            this.message = '获取用户信息失败，请刷新重试或重新登录'
        }
    }
}
</script>

<style lang="less">
.sso-loading-spinner {
    background-image: url('~@/assets/img/sso/loading.svg');
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    display: inline-block;
}
</style>
