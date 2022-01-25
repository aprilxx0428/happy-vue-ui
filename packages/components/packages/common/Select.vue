<template>
    <div class="deafult">
        <template v-if="readOnly">
            <span v-html="myText"></span>
        </template>
        <template v-else-if="myBasic.multiple">
            <el-select
                :value="myValue"
                multiple
                :placeholder="myBasic.placeholder"
                :disabled="myBasic.disabled"
                :filterable="myBasic.filterable"
                :size="myBasic.size"
                @input="handleInput"
                style="width: 100%;"
            >
                <el-option v-for="(item, index) in myDataSource" :label="item[myOptions.label]" :key="`item${index}`" :value="item[myOptions.value]"></el-option>
            </el-select>
        </template>
        <template v-else>
            <el-select :value="myValue" :placeholder="myBasic.placeholder" :disabled="myBasic.disabled" :filterable="myBasic.filterable" :size="myBasic.size" @input="handleInput" style="width: 100%;">
                <el-option v-for="(item, index) in myDataSource" :label="item[myOptions.label]" :key="`item${index}`" :value="item[myOptions.value]"></el-option>
            </el-select>
        </template>
    </div>
</template>
<script lang="ts">
import { IasService } from '../../services'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import config from '../../config'
@Component({})
export default class Select extends Vue {
    @Prop() options: Record<string, any>
    @Prop() datasource: Record<string, any>
    @Prop() basic: Record<string, any>
    @Prop() value: any
    @Prop() readOnly: boolean
    @Prop() prop: string
    myOptions = { value: '', label: '' }
    myDataSource = []
    myBasic = {}
    myValue = ''
    @Watch('options', { immediate: true })
    watchOptions(val) {
        this.myOptions = val
    }
    @Watch('datasource', { immediate: true })
    watchDataSource(val) {
        if (val.url && val.url != '') {
            console.log(val.url)
            let url = val.url
            if (url.indexOf('http') < 0) url = config.apiHost + url
            this.getCustomApiData(url, null, res => {
                this.myDataSource = res
            })
        } else this.myDataSource = val.dataList
        console.log('watchDatasource', this.myDataSource, val)
        if (val.defaultItem) {
            this.myDataSource = [val.defaultItem, ...val.dataList]
        }
        console.log('datasource,', this.myDataSource, val)
    }
    @Watch('basic', { immediate: true })
    watchBasic(val) {
        this.myBasic = val
    }
    @Watch('value', { immediate: true })
    watchValue(val) {
        this.myValue = val
        //console.log('setCurrentOpProp', this.prop)
        this.$emit('setCurrentOpProp', this.prop)
    }
    get myText() {
        let result = ''
        if (this.myDataSource && this.myValue != null && this.myOptions) {
            this.myDataSource.forEach(item => {
                if (item[this.myOptions.value] == this.myValue) result = item[this.myOptions.label]
            })
        }
        return result
    }
    handleInput(val) {
        this.$emit('input', val)
    }

    async getCustomApiData(url, params, callback) {
        const { success, data } = await IasService.queryCustomApi(url, params)
        if (success) callback(data)
        else callback([])
    }
}
</script>
