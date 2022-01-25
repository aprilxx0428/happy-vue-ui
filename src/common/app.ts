interface ReLoginAction {
    (message: string): void
}

let RELOGIN_ACTION: ReLoginAction = () => {
    //
}

/**
 * 设置重新登录的执行方法
 * @param action 重新登录的执行方法
 */
export function setReLoginAction(action: ReLoginAction) {
    RELOGIN_ACTION = action
}

/**
 * 需要重新登录
 * @param message 重新登录的理由
 */
export function needReLogin(message: string) {
    RELOGIN_ACTION(message)
}
