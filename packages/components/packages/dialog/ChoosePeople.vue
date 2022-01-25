<template>
    <div class="deafult">
        <el-input :value="myShowValue" :type="inputOptions.type" :placeholder="inputOptions.placeholder" :rows="inputOptions.rows" :style="{ width: inputOptions.width }"></el-input>
        <el-button v-if="buttonOptions" :type="buttonOptions.type" :size="buttonOptions.size" @click="changeDialog(true)" style="margin-left: 15px;">
            {{ buttonOptions.label }}
        </el-button>
        <!-- <el-input style="width:200px;" v-model="prop" /> -->
        <el-dialog :visible.sync="infoVisible" :append-to-body="true" :modal="true" :title="dialogOptions.label" custom-class="choosePeopleDialog" width="80%" top="3%">
            <choose-people-component :options="dialogOptions" :oldList="myValue" @changeDialog="changeDialog"></choose-people-component>
            <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="infoVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div> -->
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ChoosePeopleComponent from './UserPicker.vue'
@Component({
    components: {
        ChoosePeopleComponent
    }
})
export default class ChoosePeople extends Vue {
    @Prop() options: {}
    @Prop() value: ''
    @Prop() prop: string
    dialogOptions = { separator: '', saveHandle: '' }
    inputOptions = {}
    buttonOptions = {}
    dataOptions = { jsonProps: [], showProp: '' }
    myValue = [] //选中的json字符串
    myShowValue = ''
    infoVisible = false

    @Watch('options', { immediate: true })
    watchOptions(val) {
        this.dialogOptions = val.dialog
        this.inputOptions = val.input
        this.buttonOptions = val.button
        this.dataOptions = val.dataOptions
    }
    @Watch('value', { immediate: true })
    watchValue(val) {
        if (val) {
            this.myValue = JSON.parse(val)
        }
    }

    @Watch('myValue', { immediate: true })
    watchMyValue(val) {
        if (val) {
            const nameList = val.map(item => {
                return item[this.dataOptions.showProp]
            })
            this.myShowValue = nameList.join(this.dialogOptions.separator)
        }
    }
    setChooseUsersValue(list) {
        if (JSON.stringify(list) != JSON.stringify(this.myValue)) this.myValue = list
    }
    handleInput(val) {
        this.$emit('input', val)
    }
    changeDialog(val) {
        this.infoVisible = val
    }
}
</script>
