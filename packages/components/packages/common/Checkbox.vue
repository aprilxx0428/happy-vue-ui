<template>
    <div class="deafult">
        <template v-if="readOnly && !disabled">
            <span v-html="myText"></span>
        </template>
        <template v-else-if="!readOnly && !disabled">
            <el-checkbox-group :value="myValue" @input="handleInput">
                <el-checkbox v-for="(item, index) in dataSource" :label="item[myOptions.value]" :key="`item${index}`">{{ item[myOptions.label] }}</el-checkbox>
            </el-checkbox-group>
        </template>
        <template v-else-if="!readOnly && disabled">
            <el-checkbox-group :value="myValue" @input="handleInput">
                <el-checkbox v-for="(item, index) in dataSource" :label="item[myOptions.value]" :key="`item${index}`" disabled>{{ item[myOptions.label] }}</el-checkbox>
            </el-checkbox-group>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({})
export default class Checkbox extends Vue {
    @Prop() datasource: Array<Record<string, any>>
    @Prop() options: Record<string, any>
    @Prop() value: any
    @Prop() readOnly: boolean
    @Prop() separator: string
    @Prop() prop: string
    @Prop() disabled: boolean
    dataSource = []
    myValue = []
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
        if (val) this.myValue = val
        this.$emit('setCurrentOpProp', this.prop)
    }

    get myText() {
        let result = ''
        const arr = []
        if (this.dataSource && this.myValue != null && this.myOptions) {
            this.dataSource.forEach(item => {
                const exist = this.myValue.filter(val => {
                    return val == item[this.myOptions.value]
                })
                if (exist.length > 0) arr.push(item[this.myOptions.label])
            })
        }
        if (arr.length > 0) return (result = arr.join(this.separator))
        return result
    }
    handleInput(val) {
        this.$emit('input', val)
    }
}
</script>
