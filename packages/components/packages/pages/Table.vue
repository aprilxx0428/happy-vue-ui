<template>
    <div class="deafult">
        <el-table
            :data="myTableData"
            :span-method="spanWithRepeat"
            border
            style="width: 100%; margin-top: 20px"
            :show-header="showHeader"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
        >
            <el-table-column :prop="item.prop" :label="item.label" :width="item.width" v-for="(item, index) in tableColumns" :key="index"></el-table-column>
            <!--多个操作按钮，放在“更多”中-->
            <el-table-column v-if="isShowTableOperatorBtns && operatorBtns && operatorBtns.length > 1" label="操作" :align="operatorBtnsAlign" width="100">
                <template slot-scope="scope">
                    <el-popover placement="bottom" trigger="hover" popper-class="tableOperatePopover">
                        <div class="handBthList">
                            <div
                                v-for="(btn, index) in operatorBtns"
                                :key="index"
                                :class="isDeleteBtn(btn) ? 'handDeleteBthItem' : 'handBthItem'"
                                @click="handleMethod(scope.$index, scope.row, btn.handle)"
                                v-show="btnShow(btn.showCondition, scope.row)"
                            >
                                <span :class="`icon iconfont ${btn.icon}`"></span><span>{{ btn.label }}</span>
                            </div>
                        </div>
                        <span :class="moreIcon" slot="reference"></span>
                    </el-popover>
                </template>
            </el-table-column>
            <!--一个操作按钮直接显示-->
            <el-table-column v-if="isShowTableOperatorBtns && operatorBtns && operatorBtns.length == 1" label="操作" align="center" width="100">
                <template slot-scope="scope">
                    <div class="handBthList">
                        <div :class="isDeleteBtn(operatorBtns[0]) ? 'handDeleteBthItem' : 'handBthItem'" @click="handleMethod(scope.$index, scope.row, operatorBtns[0].handle)">
                            <span :class="`icon iconfont ${operatorBtns[0].icon}`"></span><span>{{ operatorBtns[0].label }}</span>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Bus } from '../../common/bus'
@Component({})
export default class Table extends Vue {
    @Prop() tableData: Array<Record<string, any>>
    @Prop() loading: boolean
    @Prop() propertyData: Record<string, any>
    myTableData = []
    tableColumns = []
    distinctColumns = []
    repeatArr = []
    showHeader = true
    isShowTableOperatorBtns = true
    operatorBtnsAlign = 'center'
    operatorBtns = []
    moreIcon = 'icon iconfont iconicon_more'
    @Watch('tableData', { immediate: true })
    WatchTableData(val) {
        if (val) {
            this.myTableData = val
            if (val.length > 0) this.getRepeatTD()
        }
    }
    @Watch('propertyData', { immediate: true })
    WatchPropertyData(val) {
        if (val && val.table && val.table.tableColumn) {
            this.isShowTableOperatorBtns = val.table.isShowTableOperatorBtns
            this.showHeader = val.table.showHeader
            this.operatorBtnsAlign = val.table.operatorBtnsAlign
            if (val.table.operatorBtns && val.table.isShowTableOperatorBtns && val.table.operatorBtns.length > 0) {
                this.operatorBtns = val.table.operatorBtns.filter(item => {
                    return item.visible == true
                })
            }
            this.tableColumns = val.table.tableColumn
            this.distinctColumns = this.tableColumns
                .filter(item => {
                    return item.distinct
                })
                .map(item => {
                    return item.prop
                })
            this.getRepeatTD()
        }
    }
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    //     console.log('arraySpanMethod', row, column)
    //     if (rowIndex % 2 === 0) {
    //         if (columnIndex === 0) {
    //             return [1, 2]
    //         } else if (columnIndex === 1) {
    //             return [0, 0]
    //         }
    //     }
    // }

    // objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
    //     console.log('objectSpanMethod2', row, column)
    //     if (columnIndex === 0) {
    //         if (rowIndex % 2 === 0) {
    //             return {
    //                 rowspan: 2,
    //                 colspan: 1
    //             }
    //         } else {
    //             return {
    //                 rowspan: 0,
    //                 colspan: 0
    //             }
    //         }
    //     }
    // }

    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //     console.log('objectSpanMethod', row, column)
    //     const result = {
    //         rowspan: -1,
    //         colspan: -1
    //     }
    //     this.repeatArr.forEach(element => {
    //         if (columnIndex == element.colIndex && rowIndex == element.rowIndex) {
    //             result.rowspan = element.rowspan
    //             result.colspan = element.colspan
    //         }
    //     })
    //     if (result.rowspan >= 0) return result
    // }

    getRepeatTD() {
        //直有distinct列需要去重复
        if (this.distinctColumns.length > 0) {
            this.distinctColumns.forEach((thisKey, c) => {
                let currentTD = { rowIndex: 0, colIndex: 0, rowspan: 1, colspan: 1 }
                currentTD.colIndex = c
                let firstFlag = true
                let hasReapeat = false
                this.myTableData.forEach((element, r) => {
                    if (r < this.myTableData.length - 1) {
                        const thisValue = element[thisKey]
                        const nextValue = this.myTableData[r + 1][thisKey]
                        //行重复有没有
                        if (thisValue != nextValue) {
                            if (hasReapeat) {
                                const zero = Object.assign({}, currentTD)
                                zero.rowspan = 0
                                zero.colspan = 0
                                zero.rowIndex = r
                                zero.colIndex = c
                                this.repeatArr.push(zero)
                                this.repeatArr.push(currentTD)
                            }
                            hasReapeat = false
                            firstFlag = true
                            currentTD = Object.assign({}, currentTD)
                            currentTD.rowspan = 1
                        } else {
                            hasReapeat = true
                            if (firstFlag) {
                                currentTD.rowIndex = r
                            } else {
                                //被合并的几个列返回[0, 0]
                                const zero = Object.assign({}, currentTD)
                                zero.rowspan = 0
                                zero.colspan = 0
                                zero.rowIndex = r
                                zero.colIndex = c
                                this.repeatArr.push(zero)
                            }
                            firstFlag = false
                            currentTD.rowspan = currentTD.rowspan + 1
                        }
                    } else {
                        if (hasReapeat) {
                            this.repeatArr.push(currentTD)
                            const zero = Object.assign({}, currentTD)
                            zero.rowspan = 0
                            zero.colspan = 0
                            zero.rowIndex = r
                            zero.colIndex = c
                            this.repeatArr.push(zero)
                        }
                    }
                })
            })
        }
    }
    spanWithRepeat({ row, column, rowIndex, columnIndex }) {
        //行合并
        const result = { rowspan: -1, colspan: -1 }
        this.repeatArr.forEach(element => {
            if (rowIndex == element.rowIndex && columnIndex == element.colIndex) {
                result.rowspan = element.rowspan
                result.colspan = element.colspan
            }
        })
        if (result.rowspan >= 0) return result
    }

    btnShow(condition, row) {
        if (condition == null || condition == '') return true
        else {
            //操作符默认为in
            const { prop, value } = condition
            return value.indexOf(row[prop]) > -1
        }
    }
    //表格 操作里的按钮
    handleMethod(index, row, methodName) {
        const clickParams = {
            index,
            row
        }
        if (methodName.indexOf('handleDelete') > -1) {
            this.$confirm('确认删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(() => {
                this.$emit(methodName, clickParams)
                Bus.emit(methodName, clickParams)
            })
        } else {
            this.$emit(methodName, clickParams)
            Bus.emit(methodName, clickParams)
        }
    }

    //是否删除按钮,根据handel方法名称
    isDeleteBtn(btn) {
        //console.log('btn', btn.handle.toLowerCase())
        if (btn.handle.toLowerCase().indexOf('delete') > -1) return true
        else return false
    }
}
</script>
