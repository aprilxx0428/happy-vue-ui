<template>
    <div class="deafult">
        <template v-if="readOnly">
            <span v-html="myText"></span>
        </template>
        <template v-else>
            <el-radio-group :value="value" @input="handleInput">
                <el-radio v-for="(item, index) in dataSource" :label="item[myOptions.value]" :disabled="disabled" :key="index">{{ item[myOptions.label] }}</el-radio>
            </el-radio-group>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({})
export default class Radio extends Vue {
    @Prop() datasource: Array<Record<string, any>>
    @Prop() options: Record<string, any>
    @Prop() value: any
    @Prop() readOnly: boolean
    @Prop() prop: string
    @Prop() disabled: boolean
    dataSource = []
    myValue = ''
    myOptions = { value: '', label: '' }
    @Watch('datasource', { immediate: true })
    watchDatasource(val) {
        this.dataSource = val
    }

    @Watch('options', { immediate: true })
    watchOptions(val) {
        this.myOptions = val
    }

    @Watch('value', { immediate: true })
    watchValue(val) {
        this.myValue = val
        this.$emit('setCurrentOpProp', this.prop)
    }
    get myText() {
        let result = ''
        if (this.dataSource && this.myValue != null && this.myOptions) {
            this.dataSource.forEach(item => {
                if (item[this.myOptions.value] == this.myValue) result = item[this.myOptions.label]
            })
        }
        return result
    }
    handleInput(val) {
        this.$emit('input', val)
    }
}
</script>
