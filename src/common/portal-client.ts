interface AioaMessageEventData {
    readonly action: string
    readonly data: any
}

export const MessageEventActionName = {
    /**
     * 门户左侧菜单栏Frame模式点击切换事件
     */
    portalFrameSideBarChange: 'portal.frameSidebarChange'
}

export interface PortalFrameSideBarChangeData {
    readonly url: string
}

const CALLBACKS = {}

export function registerMessageHandler(actionName: string, fn: Function) {
    CALLBACKS[actionName] = fn

    initMessage()
}

let IS_INIT_MESSAGE_HANDLER = false

function initMessage() {
    if (IS_INIT_MESSAGE_HANDLER) {
        return
    }
    window.addEventListener('message', function(event: MessageEvent) {
        const data: AioaMessageEventData = event.data
        if (data.action === MessageEventActionName.portalFrameSideBarChange) {
            const fn = CALLBACKS[MessageEventActionName.portalFrameSideBarChange]
            const ed: PortalFrameSideBarChangeData = { url: data.data.url }
            fn && fn(ed)
        }
    })
    IS_INIT_MESSAGE_HANDLER = true
}
