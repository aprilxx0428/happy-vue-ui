<template>
    <div class="deafult">
        <template v-if="readOnly">
            <span v-html="myText"></span>
        </template>
        <template v-else>
            <el-switch
                :value="myValue"
                :disabled="myBasic.disabled"
                :active-text="myBasic.activeText"
                :inactive-text="myBasic.inactiveText"
                :active-color="myBasic.activeColor"
                :inactive-color="myBasic.inactiveColor"
                :active-value="myBasic.activeValue"
                :inactive-value="myBasic.inactiveValue"
                @input="handleInput"
            >
            </el-switch>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
@Component({})
export default class SwitchComponent extends Vue {
    @Prop() basic: Record<string, any>
    @Prop() readOnly: boolean
    @Prop() value: string
    @Prop() prop: string
    myBasic = { activeValue: '', activeText: '', inactiveValue: '', inactiveText: '' }
    //myText = ''
    myValue = ''
    @Watch('basic', { immediate: true })
    WatchBasic(val) {
        this.myBasic = val
        //this.setText()
    }
    @Watch('value', { immediate: true })
    WatchValue(val) {
        this.myValue = val
        this.$emit('setCurrentOpProp', this.prop)
        //this.setText()
    }
    get myText() {
        if (this.myBasic && this.myValue != null) {
            return this.myValue == this.myBasic.activeValue ? this.myBasic.activeText : this.myBasic.inactiveText
        } else return ''
    }
    handleInput(val) {
        this.$emit('input', val)
    }
}
</script>
