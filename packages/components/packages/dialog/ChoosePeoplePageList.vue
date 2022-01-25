<template>
    <div class="choosePeoplePageList">
        <div class="searchDiv">
            <choose-people-query :propertyData="propertyData" :chooseTableColumn="chooseTableColumn" @setCondition="setCondition"></choose-people-query>
        </div>
        <div style="background: #fff;margin-bottom: 15px;">
            <el-table
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                :header-cell-style="{ 'text-align': propertyData.tableHeadAlign, background: '#f5f7fa', width: '100%' }"
                :data="myTableData"
                @select="selectionChange"
                @select-all="selectionAllChange"
                ref="multipleTable"
            >
                <template v-for="(property, index) in tableColumn">
                    <!--selection-->
                    <el-table-column
                        v-if="property.type"
                        :key="`property${index}`"
                        :type="property.type"
                        :prop="property.prop"
                        :label="property.label"
                        :width="property.width"
                        :align="property.align"
                    ></el-table-column>
                    <!-- other normal column-->
                    <el-table-column
                        v-if="!property.type"
                        :key="`property${index}`"
                        :prop="property.prop"
                        :label="property.label"
                        :width="property.width"
                        :align="property.align"
                        :show-overflow-tooltip="property.isEllipsis"
                    >
                        <template slot-scope="scope">
                            <div v-if="property.isNeedEdit">
                                <el-input v-model="scope.row[property.prop]" @blur="tableInputBlur(property.handle, property.prop, scope.row)"></el-input>
                            </div>
                            <span v-else>{{ scope.row[property.prop] }}</span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <div class="page-wrap">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :current-page="paginationJson.currentPage"
                    :page-size="paginationJson.pageSize"
                    layout="total, prev, pager, next"
                    prev-text="上一页"
                    next-text="下一页"
                    :total="Number(paginationJson.total)"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { config } from '@vue/test-utils'
import { Vue, Watch, Component, Prop } from 'vue-property-decorator'
import ChoosePeopleQuery from './ChoosePeopleQuery.vue'

@Component({
    components: {
        ChoosePeopleQuery
    }
})
export default class ChoosePeoplePageList extends Vue {
    @Prop() loading: boolean
    @Prop() propertyData: Record<string, any>
    @Prop() tableData: Array<Record<string, any>>
    @Prop() pagination: Record<string, any>
    @Prop() selectedList: any
    @Prop() peopleDeleteItem: any
    @Prop() max: number
    searchBthList = []
    isHighSearchShow = false
    highSearchFormList = []
    highSearchBthList = []
    tableColumn = []
    paginationJson = {}
    operatorBtns = []
    condition = {}
    chooseTableColumn = [] //选中的行
    myTableData = []
    //选中的标致字段，防止选中重复
    keyProp = ''
    //搜索条件
    queryCondition = {}
    @Watch('propertyData', { immediate: true })
    watchPropertyData(val) {
        //高级搜索列表项
        // this.highSearchFormList = val.advanceSearchContent.filter(item => {
        //     return item.visible == true
        // })
        // 高级搜索 按钮
        // this.highSearchBthList = val.highSearchBtns.filter(item => {
        //     return item.visible == true
        // })
        //表格
        this.tableColumn = val.tableColumn.filter(item => {
            return item.visible == true
        })
        this.keyProp = val.keyProp
    }
    @Watch('tableData', { immediate: true, deep: true })
    watchtableData(val) {
        this.myTableData = val
        for (let i = 0; i < this.selectedList.length; i++) {
            for (let index = 0; index < val.length; index++) {
                if (this.selectedList[i][this.keyProp] == val[index][this.keyProp]) {
                    this.$nextTick(() => {
                        const multipleTable = this.$refs.multipleTable as any
                        multipleTable.toggleRowSelection(val[index], true)
                    })
                }
            }
        }
    }
    @Watch('pagination', { immediate: true })
    watchPaginationData(val) {
        this.paginationJson = val
    }
    @Watch('selectedList', { immediate: true, deep: true })
    watchSelectedList(data) {
        console.log('watchSelectedList', data)

        if (data.length > 0) {
            this.$nextTick(() => {
                const multipleTable = this.$refs.multipleTable as any
                multipleTable.clearSelection()
            })

            for (let i = 0; i < data.length; i++) {
                for (let index = 0; index < this.myTableData.length; index++) {
                    if (data[i][this.keyProp] == this.myTableData[index][this.keyProp]) {
                        this.$nextTick(() => {
                            const multipleTable = this.$refs.multipleTable as any
                            multipleTable.toggleRowSelection(this.myTableData[index], true)
                        })
                    }
                }
            }
        } else {
            this.$nextTick(() => {
                const multipleTable = this.$refs.multipleTable as any
                multipleTable.clearSelection()
            })
        }
    }
    //监听删除某个选中成员
    @Watch('peopleDeleteItem', { immediate: true, deep: true })
    watchPpeopleDeleteItem(item) {
        for (let index = 0; index < this.myTableData.length; index++) {
            if (item[this.keyProp] == this.myTableData[index][this.keyProp]) {
                const multipleTable = this.$refs.multipleTable as any
                multipleTable.toggleRowSelection(this.myTableData[index], false)
            }
        }
    }

    selectionChange(selection, row) {
        let errorStatus = false
        const isAddRow = selection.some(obj => {
            return obj[this.keyProp] == row[this.keyProp]
        })
        //如果新增select并且当前选中的长度已经等于最长长度，那么提示错误，并且该行不会被选中
        if (isAddRow && this.max && this.max <= this.selectedList.length) {
            errorStatus = true
            const multipleTable = this.$refs.multipleTable as any
            multipleTable.toggleRowSelection(row, false)
        }
        console.log('selectionChange', isAddRow, row)
        this.$emit('selectionChange', {
            isAddRow,
            row,
            error: errorStatus
        })
    }
    selectionAllChange(val) {
        console.log('selectionAllChange', val)
        let isCheckAll = false
        let list = isCheckAll ? val : this.myTableData
        let errorStatus = false
        if (val.length != 0) {
            isCheckAll = true
            list = []
            if (!this.max) {
                // const multipleTable = this.$refs.multipleTable as any
                // for (let i = val.length - 1; i >= 0; i--) {
                //     multipleTable.toggleRowSelection(val[i], true)
                // }
                list = val
            } else {
                //还没有满，看还缺多少个到满选中
                if (this.max > this.selectedList.length) {
                    const emptyNumber = this.max - this.selectedList.length
                    for (let i = val.length - 1; i >= 0; i--) {
                        if (i >= emptyNumber) {
                            console.log('index', i, val[i], val)
                            const multipleTable = this.$refs.multipleTable as any
                            multipleTable.toggleRowSelection(val[i], false)
                            errorStatus = true
                        } else {
                            list.push(val[i])
                        }
                    }
                }
                if (this.max <= this.selectedList.length) {
                    //已经到了max数额，所以val都置为不选中
                    errorStatus = true
                    const multipleTable = this.$refs.multipleTable as any
                    for (let i = val.length - 1; i >= 0; i--) {
                        multipleTable.toggleRowSelection(val[i], false)
                    }
                }
            }
        }
        this.$emit('selectionAllChange', {
            isCheckAll,
            list: list,
            error: errorStatus
        })
    }
    //点击某一页
    handleCurrentChange(val) {
        console.log('handleCurrentChange', this.queryCondition, val)
        this.$emit('handleCurrentChange', val, this.queryCondition)
    }

    //从查询获取搜索条件
    setCondition(condition) {
        this.queryCondition = condition
        console.log('setCondition', this.queryCondition)
    }

    isShowHignSearchClick() {
        this.isHighSearchShow = !this.isHighSearchShow
        if (this.isHighSearchShow) {
            this.highSearchFormList.forEach(obj => (obj.value = ''))
        }
    }

    handleSelectionChange(val) {
        this.chooseTableColumn = val
    }
}
</script>
