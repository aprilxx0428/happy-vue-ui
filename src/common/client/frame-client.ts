import { MessageAction } from '../messageAction/action'

export const SetIFrameHeightMessageActionCode = 'setIframeHeight'

export type SetIFrameHeightMessageAction = MessageAction<{
    height: string
}>

/**
 * 设置父Iframe高度
 * @param height 高度 `num`px or `num`%
 */
export function setParentHeight(height: string) {
    const action: SetIFrameHeightMessageAction = {
        action: SetIFrameHeightMessageActionCode,
        data: {
            height: height
        }
    }
    window.parent.postMessage(action, '*')
}
