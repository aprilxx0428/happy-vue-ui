<template>
    <div class="aioa-cell-group">
        <div class="aioa-cell-group__title" v-if="title">{{ title }}</div>
        <div :class="['aioa-cell-group__con', { 'aioa-cell-group__con--hairline': hairline }]">
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class AioaCell extends Vue {
    @Prop({ type: String, default: '' }) title: string
    @Prop({ type: Boolean, default: false }) hairline: boolean
}
</script>
<style lang="less" scoped>
.aioa-cell-group {
    background-color: #fff;
    position: relative;
}
.aioa-cell-group__title {
    padding: 16px 16px 8px;
    font-size: 14px;
    color: #999;
}
.aioa-cell-group__con--hairline {
    position: relative;
}

.aioa-cell-group__con--hairline::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    border-bottom: 1px solid #ccc;
    width: 100%;
    pointer-events: none;
    box-sizing: border-box;
}
</style>
