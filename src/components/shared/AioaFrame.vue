<template>
    <iframe></iframe>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { BindMessageActionMixin } from '@/common/messageAction'
import { SetIFrameHeightMessageActionCode, SetIFrameHeightMessageAction } from '@/common/client/frame-client'
import BaseVue from '@/common/base-vue'

@Component({
    mixins: [
        BindMessageActionMixin(function(bind) {
            bind(SetIFrameHeightMessageActionCode, this.setIframeMessageActionHandler)
        })
    ]
})
export default class AioaFrame extends BaseVue {
    get element() {
        return this.$el as HTMLIFrameElement
    }

    setIframeMessageActionHandler({ data }: SetIFrameHeightMessageAction) {
        const rawHeight = this.element.style.height
        if (rawHeight < data.height) {
            this.element.style.height = data.height
        }
    }
}
</script>
