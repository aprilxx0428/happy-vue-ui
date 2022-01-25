<template>
    <div class="cascader">
        <template v-if="readOnly">
            <span v-html="myText"></span>
        </template>
        <template v-else>
            <el-cascader
                :value="myValue"
                :size="myBasic.size"
                :class="{ placeholder: initPlaceholder }"
                :placeholder="initValue"
                :disabled="myBasic.disabled"
                :separator="myBasic.separator"
                :props="selectProps"
                @change="handleInput"
                style="width: 100%;"
            ></el-cascader>
        </template>
    </div>
</template>
<script lang="ts">
import { IasService } from '../../services'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({})
export default class Cascader extends Vue {
    @Prop() code: string
    @Prop() basic: Record<string, any>
    @Prop() value: Array<Record<string, any>>
    @Prop() datasource: Record<string, any>
    @Prop() options: Record<string, any>
    @Prop() readOnly: boolean
    @Prop() prop: string
    selectProps = {}
    initPlaceholder = ''
    myBasic = { separator: '' }
    myValue = []
    initValue = ''
    myCode = ''
    myOptions = { label: '', value: '' }
    allText = []
    setTextFlag = true
    @Watch('datasource', { immediate: true, deep: true })
    watchDataSource(val) {
        if (val && val.from == 'dictionary' && val.code && val.code != '') {
            this.myCode = val.code
            this.setMyText()
        }
        this.selectProps = {
            lazy: true,
            lazyLoad: this.getDicLazyLoad
        }
    }
    @Watch('basic', { immediate: true })
    watchBasic(val) {
        this.myBasic = val
    }
    @Watch('value', { immediate: true, deep: true })
    watchValue(val) {
        if (val) {
            this.myValue = val
            this.initValue = val.join(this.myBasic.separator)
            this.$emit('setCurrentOpProp', this.prop)
            this.setMyText()
        }
    }
    @Watch('options', { immediate: true })
    watchOptions(val) {
        this.myOptions = val
    }

    async getDicLazyLoad(node, resolve) {
        const parentCode = node.data ? node.data.code : this.myCode
        const { success, data } = await IasService.getDictionary(parentCode)
        if (success) {
            if (data && data.length == 0) {
                this.$emit('input', node.path)
                this.initPlaceholder = node.pathLabels.join(`${this.myBasic.separator || '/'}`)
                return resolve([])
            }
            data.forEach(element => {
                element.label = element[this.myOptions.label]
                element.value = element[this.myOptions.value]
            })
            resolve(data)
        }
    }
    async getDicText(code, value, callback) {
        const { success, data } = await IasService.getDictionary(code)
        if (success) {
            data.forEach(element => {
                if (element[this.myOptions.value] == value) {
                    const rtn = { code: element.code, text: element[this.myOptions.label] }
                    callback(rtn)
                }
            })
        }
    }

    getMyText(code, num) {
        if (num <= this.myValue.length - 1) {
            this.getDicText(code, this.myValue[num], res => {
                const paramCode = res.code
                this.allText.push(res.text)
                num++
                this.getMyText(paramCode, num)
            })
        }
    }
    get myText() {
        if (this.allText.length > 0) return this.allText.join(this.basic.separator)
        else return ''
    }

    setMyText() {
        if (this.myValue && this.myValue.length > 0 && this.myCode && this.setTextFlag) {
            const paramCode = this.myCode
            this.getMyText(paramCode, 0)
            this.setTextFlag = false
        }
    }
    handleInput(val) {
        //if (val.length == 0) this.initPlaceholder = ''
        this.$emit('input', val)
    }
}
</script>
