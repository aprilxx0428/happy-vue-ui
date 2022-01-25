<template>
    <div class="deafult">
        <template v-if="readOnly">
            <span v-html="myText"></span>
        </template>
        <template v-else>
            <el-time-picker
                :is-range="myBasic.isRange"
                :value="myValue"
                :picker-options="myBasic.pickerOptions"
                :placeholder="myBasic.placeholder"
                :range-separator="myBasic.rangeSeparator"
                :start-placeholder="myBasic.startPlaceholder"
                :end-placeholder="myBasic.endPlaceholder"
                :editable="myBasic.editable"
                :clearable="myBasic.clearable"
                :size="myBasic.size"
                :align="myBasic.align"
                :value-format="myBasic.valueformat"
                @input="handleInput"
                style="width: 100%;"
            >
            </el-time-picker>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import config from '../../config'
@Component({})
export default class Time extends Vue {
    @Prop() value: string
    @Prop() basic: Record<string, any>
    @Prop() readOnly: boolean
    @Prop() prop: string
    myValue = ''
    myBasic = {}
    dateSeparator = config.dateSeparator
    @Watch('value', { immediate: true })
    watchValue(val) {
        this.myValue = val
        this.$emit('setCurrentOpProp', this.prop)
    }
    @Watch('basic', { immediate: true })
    watchBasic(val) {
        this.myBasic = val
    }
    get myText() {
        //数组改为字符串显示
        if (this.myValue && typeof this.myValue == 'string') return this.myValue
        //if (this.myValue && typeof this.myValue == 'object')
        else if (this.myValue && typeof this.myValue == 'object') return this.myValue[0] + this.dateSeparator + this.myValue[1]
        else return ''
    }
    handleInput(val) {
        if (!val) {
            if (this.myBasic['type'].indexOf('range') > -1) {
                this.$emit('input', [])
            } else {
                this.$emit('input', '')
            }
        } else {
            this.$emit('input', val)
        }
    }
}
</script>
