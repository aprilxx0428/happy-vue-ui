import { MessageAction } from '../messageAction/action'
import { RawLocation } from 'vue-router'

export const ClosePageMessageActionCode = 'close_page'

export enum OpenPageModeEnum {
    IframeDialog = 'iframeDialog',
    Blank = 'blank'
}
interface OpenPageModeTypeCode {
    code: string
}

interface OpenPageModeType {
    iframeDialog: OpenPageModeTypeCode
    blank: OpenPageModeTypeCode
}

export type ClosePageMessageAction = MessageAction<{
    OPEN_TARGET_ID: string
    OPEN_MODE: keyof OpenPageModeType
    data: any
}>

export function renderOpenUrl<T extends keyof OpenPageModeType>(mode: T, url: RawLocation, targetId: string): RawLocation {
    if (typeof url === 'string') {
        const isExistsQ = url.indexOf('?') > -1
        return `${url}${isExistsQ ? '&' : '?'}OPEN_MODE=${mode}&OPEN_TARGET_ID=${targetId}`
    }

    return {
        ...url,
        query: {
            ...url.query,
            OPEN_MODE: mode,
            OPEN_TARGET_ID: targetId
        }
    }
}
