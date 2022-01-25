import { MessageAction } from '../messageAction/action'

export const SetPortalMenuSidebarMessageActionCode = 'setPortalMenuSidebarSelected'

export type SetPortalMenuSidebarMessageAction = MessageAction<{
    code: string
}>

/**
 * 设置portl菜单侧边栏选中
 * @param code 菜单code
 */
export function setPortalMenuSidebarSelected(code: string) {
    const action: SetPortalMenuSidebarMessageAction = {
        action: SetPortalMenuSidebarMessageActionCode,
        data: {
            code: code
        }
    }
    window.parent.postMessage(action, '*')
}
