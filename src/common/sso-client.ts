import Cookies from 'js-cookie'
import ConfigManager from './config-manager'
import request from '@/utils/request'

const getLoginUrl = function() {
    return ConfigManager.get('sso.loginUrl')
}

const getLogoutUrl = function() {
    return ConfigManager.get('sso.logoutUrl')
}

const getTicketUrl = function() {
    return ConfigManager.get('sso.ticketUrl')
}

const getSessionName = function() {
    return ConfigManager.get('sso.sessionName')
}

const getUserUid = function() {
    const userUid = Cookies.get(getSessionName())

    if (userUid === null || userUid === undefined || userUid.length === 0) {
        return null
    }

    return userUid
}

const setUserUid = function(userUid: string) {
    Cookies.set(getSessionName(), userUid)
}

function getTokenName() {
    return ConfigManager.get('sso.tokenName') || '_sso_token'
}

function getRefreshTokenName() {
    return getTokenName() + '_refresh'
}

export function getToken(): { access_token: string; refresh_token: string } | null {
    const access_token = Cookies.get(getTokenName())
    const refresh_token = Cookies.get(getRefreshTokenName())

    let token = null
    if (access_token && refresh_token) {
        token = {
            access_token,
            refresh_token
        }
    }

    if (token === null || token === undefined || token.length === 0) {
        return null
    }

    return token
}

export function setToken(token) {
    const access_token = token.access_token
    const refresh_token = token.refresh_token
    Cookies.set(getTokenName(), access_token)
    Cookies.set(getRefreshTokenName(), refresh_token)
}

export function clearToken() {
    Cookies.remove(getTokenName())
    Cookies.remove(getRefreshTokenName())
}

const clearUserUid = function() {
    Cookies.remove(getSessionName())
}

function getUser(ticket: string) {
    return request<{
        refreshToken: string
        accessToken: string
        identity: string
    }>(getTicketUrl(), {
        method: 'GET',
        data: {
            ticket: ticket
        }
    })
}

const getRootURI = function() {
    const re = new RegExp(/^.*\//)

    return re.exec(window.location.href)
}

const signOut = function() {
    clearUserUid()
    clearToken()
    const actionUrl = encodeURIComponent(`${getRootURI()}sso?actionUrl=/`)
    window.location.href = `${getLogoutUrl()}?actionUrl=${actionUrl}`
}

export default {
    getLoginUrl,
    getLogoutUrl,
    getTicketUrl,
    getSessionName,
    getUserUid,
    setUserUid,
    clearUserUid,
    getUser,
    signOut,
    clearToken,
    getToken,
    setToken
}
