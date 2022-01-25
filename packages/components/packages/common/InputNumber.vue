<template>
    <div class="deafult">
        <template v-if="readOnly">
            <span v-html="myValue"></span>
        </template>
        <template v-else>
            <el-input-number v-model="myValue" @change="handleChange" :min="basic.min" :max="basic.max" :label="basic.label" @input="handleInput"></el-input-number>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({})
export default class InputNumber extends Vue {
    @Prop() prop: string
    @Prop() readOnly: boolean
    @Prop() basic: Record<string, any>
    @Prop() value: string
    myValue = ''
    readonly = false
    defaultNumber = 100
    @Watch('value', { immediate: true })
    WatchValue(val) {
        this.myValue = val != null ? val : this.basic.defaultNumber ? this.basic.defaultNumber : this.defaultNumber
        this.$emit('setCurrentOpProp', this.prop)
    }
    handleInput(val) {
        this.$emit('input', val)
    }
    handleChange(val) {
        //console.log('handleChange', val)
    }
}
</script>
