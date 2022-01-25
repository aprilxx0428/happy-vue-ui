import { on, off, messageEventListener } from './core'
export { BindMessageActionMixin } from './mixins'

export function bootstrap() {
    window.addEventListener('message', messageEventListener)
}

export function unbootstrap() {
    window.removeEventListener('message', messageEventListener)
}

export const MessageActionBus = {
    on,
    off
}
