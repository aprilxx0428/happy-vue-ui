<template>
    <div class="aioa-page-dialog">
        <div class="aioa-page-dialog__content">
            <slot />
        </div>
        <div class="aioa-page-dialog__footer" v-if="$slots.footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { OpenPageModeEnum, ClosePageMessageActionCode, ClosePageMessageAction } from '@/common/client/page-client'
import { setParentHeight } from '@/common/client/frame-client'
@Component
export default class PageDialogLayout extends Vue {
    @Prop({ type: String, default: '100%' }) minHeight

    get style() {
        return {
            height: this.minHeight
        }
    }

    mounted() {
        const { OPEN_MODE } = this.$route.query
        if (OPEN_MODE === OpenPageModeEnum.IframeDialog) {
            setParentHeight(this.minHeight)
        }
        if (this.$el.parentElement.classList.contains('el-dialog__body')) {
            const cheight = this.$el.clientHeight
            const pheight = this.$el.parentElement.clientHeight
            if (cheight > 0 && cheight > pheight) {
                ;(this.$el as HTMLElement).style.height = pheight + 'px'
            }
        }
    }

    close(data?) {
        const { OPEN_MODE, OPEN_TARGET_ID } = this.$route.query

        if (OPEN_MODE === OpenPageModeEnum.IframeDialog) {
            const action: ClosePageMessageAction = {
                action: ClosePageMessageActionCode,
                data: {
                    OPEN_MODE: OPEN_MODE,
                    OPEN_TARGET_ID: OPEN_TARGET_ID as string,
                    data: data
                }
            }
            window.parent.postMessage(action, '*')
            return
        } else if (OPEN_MODE === OpenPageModeEnum.Blank) {
            const target: Window = window.opener
            if (target) {
                const action: ClosePageMessageAction = {
                    action: ClosePageMessageActionCode,
                    data: {
                        OPEN_MODE: OPEN_MODE,
                        OPEN_TARGET_ID: OPEN_TARGET_ID as string,
                        data: data
                    }
                }
                target.postMessage(action, '*')
            }
            window.close()
            return
        } else {
            //
        }
    }
}
</script>

<style lang="less">
.aioa-page-dialog {
    height: 100%;
    max-height: 100%;
    min-height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;

    &__content {
        height: 100px;
        flex: 1;
        overflow: auto;
    }
    &__footer {
        border-top: 1px solid #c3c3c3;
        background-color: #f2f2f2;
        padding: 10px;
        text-align: right;
    }
}
</style>
