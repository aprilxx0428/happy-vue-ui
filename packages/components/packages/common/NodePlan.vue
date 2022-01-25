<template>
    <div class="nodeplanBox">
        <template v-if="readOnly">
            <div>
                <el-table :data="myData" header-cell-class-name="defaultPageListTableHead" :header-cell-style="{ 'text-align': 'center' }">
                    <el-table-column type="index" width="50"> </el-table-column>
                    <el-table-column key="date" prop="date" label="节点时间" align="center" width="350px">
                        <template slot-scope="scope">
                            <div>{{ scope.row.date | filterDate }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="content" prop="content" label="节点内容" align="center">
                        <template slot-scope="scope">
                            <div>{{ scope.row.content }}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
        <template v-else>
            <div style="float:right;width:70px;">
                <el-button type="text" size="normal" @click="addTableRow">添加节点</el-button>
            </div>
            <el-table :data="myData" header-cell-class-name="defaultPageListTableHead" :header-cell-style="{ 'text-align': 'center' }">
                <el-table-column type="index" width="50"> </el-table-column>
                <el-table-column key="date" prop="date" label="节点时间" align="center" width="350px">
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.date"
                            type="monthrange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @blur="updateTableData"
                        ></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column key="content" prop="content" label="节点内容" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.content" @blur="updateTableData"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100" v-if="!readOnly">
                    <template slot-scope="scope">
                        <div class="handBthList">
                            <div class="handBthItem" @click="deleteItem(scope.$index, scope.row)"><span class="icon iconfont iconshanchu"></span><span>删除</span></div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import moment from 'moment'
@Component({
    filters: {
        filterDate(value) {
            return moment(value[0]).format('yyyy年MM月') + ' 至 ' + moment(value[1]).format('yyyy年MM月')
        }
    }
})
export default class NodePlan extends Vue {
    @Prop() tableData
    @Prop() prop
    @Prop() readOnly
    addRow = {}
    myData = []
    @Watch('tableData', { immediate: true })
    watchTableData(val) {
        if (val) {
            console.log('nodePlan', val)
            this.myData = val
        }
    }

    addTableRow() {
        //console.log('addTableRow', this.tableData)
        this.myData.push({})
    }
    deleteItem(index, row) {
        this.myData.splice(index, 1)
        //console.log(index, row)
    }
    updateTableData() {
        this.$emit('updateNodePlan', this.myData, this.prop)
    }
}
</script>
