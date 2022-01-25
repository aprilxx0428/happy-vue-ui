import { on, off } from './core'

type ot = typeof on

let uid = 0
export function BindMessageActionMixin(handler: (fun: ot) => void) {
    const key = `binded_${uid++}`

    function bind() {
        if (!this[key]) {
            handler.call(this, on, true)
            this[key] = true
        }
    }

    function unbind() {
        if (this[key]) {
            handler.call(this, off, false)
            this[key] = false
        }
    }

    return {
        mounted: bind,
        activated: bind,
        deactivated: unbind,
        beforeDestroy: unbind
    }
}
