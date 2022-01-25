<template>
    <div
        :class="[
            'aioa-cell',
            cellClass,
            {
                'aioa-cell--large': size && size !== '',
                'aioa-cell--center': center,
                'aioa-cell--column': direction === 'column',
                'aioa-cell--hairline': hairline
            }
        ]"
    >
        <div v-if="title" :class="['aioa-cell_title', titleClass]">
            <slot name="title">
                <i v-if="icon" :class="['aioa-icon', 'aioa-cell__left-icon']"></i>
                <span> {{ title }}</span>
            </slot>
            <div v-if="$scopedSlots.label || label" :class="['aioa-cell_lable', labelClass]">
                <!-- 优先插槽显示  -->
                <slot v-if="$scopedSlots.label" name="label"></slot>
                <span v-else>{{ label }}</span>
            </div>
        </div>
        <div v-if="$scopedSlots.value || value" :class="['aioa-cell_value', { 'van-cell__value--alone': !title }, valueClass]">
            <!-- 优先插槽显示  -->
            <slot v-if="$scopedSlots.value" name="value"></slot>
            <span v-else>{{ value }}</span>
        </div>

        <!-- 默认插槽 适应特别布局 -->
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AioaCell extends Vue {
    @Prop({ type: String, default: '' }) cellClass: string
    @Prop({ type: String, default: '' }) title: string
    @Prop({ type: String, default: '' }) titleClass: string
    @Prop({ type: String, default: '' }) value: string
    @Prop({ type: String, default: '' }) valueClass: string
    @Prop({ type: String, default: '' }) label: string
    @Prop({ type: String, default: '' }) labelClass: string
    @Prop({ type: String, default: '' }) icon: string
    @Prop({
        type: String,
        default: '',
        validator(value) {
            return ['', 'large'].includes(value)
        }
    })
    size: string
    @Prop({ type: Boolean, default: false }) center: boolean
    @Prop({
        type: String,
        default: '',
        validator(value) {
            return ['', 'column'].includes(value)
        }
    })
    direction: string
    @Prop({ type: Boolean, default: false }) hairline: boolean
}
</script>

<style lang="less" scoped>
@font-size: 14px;
.aioa-cell {
    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 10px 16px;
    overflow: hidden;
    color: #323233;
    font-size: @font-size;
    line-height: 24px;
    background-color: #fff;
}
.aioa-cell--hairline::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    border-bottom: 1px solid #ccc;
    width: 100%;
    pointer-events: none;
    box-sizing: border-box;
}
.aioa-cell--large {
    padding-top: 12px;
    padding-bottom: 12px;
}
.aioa-cell--center {
    align-items: center;
}
.aioa-cell--column {
    flex-direction: column;
}
.aioa-cell--column .aioa-cell_title,
.aioa-cell--column .aioa-cell_value {
    width: 100%;
    text-align: left;
}

.aioa-cell_title {
    flex: 1;
    color: #999;
}

.aioa-cell__left-icon,
.aioa-cell__right-icon {
    min-width: 1em;
    height: 24px;
    font-size: 14px;
    line-height: 24px;
}

.aioa-cell_value {
    flex: 1;
    position: relative;
    overflow: hidden;
    color: #333;
    text-align: right;
    vertical-align: middle;
    word-wrap: break-word;
}
.aioa-cell__value--alone {
    color: #323233;
    text-align: left;
}
.aioa-cell_lable {
    color: #333;
}
</style>
