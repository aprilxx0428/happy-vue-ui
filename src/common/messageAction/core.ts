import { Bus } from '../../../packages/components/common/bus'

export function on(actionCode: string, cb) {
    Bus.on(`MessageAction_${actionCode}`, cb)
}

export function off(actionCode: string, cb) {
    Bus.off(`MessageAction_${actionCode}`, cb)
}

export function messageEventListener(e: MessageEvent) {
    if (typeof e.data === 'object') {
        const { action } = e.data
        if (action) {
            Bus.emit(`MessageAction_${action}`, e.data)
        }
    }
}
