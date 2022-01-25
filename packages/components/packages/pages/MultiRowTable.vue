<template>
    <div class="multiRowTable">
        <div :style="addRow.divStyle">
            <el-button type="text" size="normal" @click="addTableRow" v-html="添加"></el-button>
        </div>
        <el-table :data="myData" style="width: 100%">
            <el-table-column key="date" prop="date" label="节点时间" align="center">
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.date" type="monthrange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column key="content" prop="content" label="节点内容" align="center">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.content"></el-input>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import FormInfo from './FormInfo.vue'
@Component({
    components: {
        FormInfo
    }
})
export default class MultiRowTable extends Vue {
    @Prop() tableData
    tableColumn = []
    addRow = {}
    myData = []
    @Watch('tableData', { immediate: true })
    watchTableData(val) {
        if (val) {
            this.myData = val
        }
    }
    //添加form对象
    getFormProperty(val) {
        const formList = []
        formList.push(val)
        const result = { form: formList }
        //console.log('getFormProperty', result)
        return result
    }
    addTableRow() {
        //console.log('addTableRow', this.tableData)
        this.myData.push({})
    }
    handleDelete(index, row) {
        this.tableData.splice(index, 1)
        //console.log(index, row)
    }
}
</script>
