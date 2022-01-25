<template>
    <div class="pageList">
        <div class="searchDiv">
            <query-info :propertyData="propertyData">
                <template #querySlot>
                    <slot name="querySlot"></slot>
                </template>
                <template #queryBtnLeftSlot>
                    <slot name="queryBtnLeftSlot"></slot>
                </template>
                <template #queryBtnRightSlot>
                    <slot name="queryBtnRightSlot"></slot>
                </template>
            </query-info>
        </div>
        <div style="background: #fff;margin-bottom: 15px;">
            <el-table
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                header-cell-class-name="defaultPageListTableHead"
                :header-cell-style="{ 'text-align': 'center' }"
                :data="tableData"
                @selection-change="handleSelectionChange"
            >
                <template v-for="(property, index) in tableColumn">
                    <el-table-column
                        v-if="property.type && property.type == 'index'"
                        :key="`property${index}`"
                        :type="property.type"
                        :prop="property.prop"
                        :label="property.label"
                        width="60"
                        :align="property.align"
                        :index="indexMethod"
                    ></el-table-column>
                    <el-table-column
                        v-if="property.type && property.type != 'index'"
                        :key="`property${index}`"
                        :type="property.type"
                        :prop="property.prop"
                        :label="property.label"
                        width="60"
                        :align="property.align"
                    ></el-table-column>
                    <el-table-column
                        v-if="!property.type && !property.isNeedPopover"
                        :key="`property${index}`"
                        :prop="property.prop"
                        :label="property.label"
                        :width="property.width"
                        :align="property.align"
                        :show-overflow-tooltip="property.isEllipsis"
                    >
                        <template slot-scope="scope">
                            <div v-if="property.slotName"><slot :name="property.slotName" :row="scope.row"></slot></div>
                            <div v-else-if="property.isNeedEdit">
                                <el-input v-model="scope.row[property.prop]" @blur="tableInputBlur(property.handle, property.prop, scope.row)"></el-input>
                            </div>
                            <div v-else-if="property.isNeedClick" :class="`${property.hoverCss} blue`" @click="tableColumnClick(property.handle, property.prop, scope.row)">
                                {{ scope.row[property.prop] }}
                            </div>
                            <span v-else-if="property.formatStr">{{ scope.row[property.prop] | dateFormat(property.formatStr) }}</span>
                            <span v-else>{{ scope.row[property.prop] }}</span>
                        </template>
                    </el-table-column>
                    <!--需要popover列，不能有isNeedEdit和isNeedClick属性-->

                    <el-table-column
                        v-if="property.isNeedPopover"
                        :key="`property${index}`"
                        :prop="property.prop"
                        :label="property.label"
                        :width="property.width"
                        :align="property.align"
                        :show-overflow-tooltip="property.isEllipsis"
                    >
                        <template slot-scope="scope">
                            <el-popover
                                :placement="property.isNeedPopover.placement"
                                :title="property.isNeedPopover.title"
                                :width="property.isNeedPopover.width"
                                :trigger="property.isNeedPopover.trigger"
                            >
                                <!--popover的内容用slot自定义-->
                                <slot :name="property.isNeedPopover.slotName" :row="scope.row"></slot>
                                <div v-if="property.slotName" slot="reference"><slot :name="property.slotName" :row="scope.row"></slot></div>
                                <span v-else-if="property.formatStr" slot="reference">{{ scope.row[property.prop] | dateFormat(property.formatStr) }}</span>
                                <span v-else slot="reference">{{ scope.row[property.prop] }}</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                </template>
                <!--多个操作按钮，放在“更多”中-->
                <el-table-column v-if="propertyData.isShowTableOperatorBtns && operatorBtns && operatorBtns.length > 1" label="操作" :align="propertyData.operatorBtnsAlign" width="100">
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
                <el-table-column
                    v-if="propertyData.isShowTableOperatorBtns && operatorBtns && operatorBtns.length == 1"
                    label="操作"
                    :align="propertyData.operatorBtnsAlign"
                    :width="operatorBtns[0].width ? operatorBtns[0].width : 100"
                >
                    <template slot-scope="scope">
                        <div class="handBthList">
                            <div
                                :class="isDeleteBtn(operatorBtns[0]) ? 'handDeleteBthItem' : 'handBthItem'"
                                @click="handleMethod(scope.$index, scope.row, operatorBtns[0].handle)"
                                v-show="btnShow(operatorBtns[0].showCondition, scope.row)"
                            >
                                <span :class="`icon iconfont ${operatorBtns[0].icon}`"></span><span>{{ operatorBtns[0].label }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrap" v-if="propertyData.isPaginationShow">
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
import { Vue, Watch, Component, Prop } from 'vue-property-decorator'
import QueryInfo from './Query.vue'
import { Bus } from '../../common/bus'

@Component({
    components: {
        QueryInfo
    }
})
export default class PageList extends Vue {
    @Prop() loading: boolean
    @Prop() propertyData: Record<string, any>
    @Prop() tableData: Array<Record<string, any>>
    @Prop() pagination: Record<string, any>
    advanceSearchFormList = []
    advanceSearchBtnList = []
    tableColumn = []
    paginationJson = { pageSize: 10, currentPage: 1 }
    operatorBtns = []
    chooseTableColumn = [] //选中的行
    myCondition = {} //查询条件
    moreIcon = 'icon iconfont iconicon_more'
    @Watch('propertyData', { immediate: true, deep: true })
    watchPropertyData(val) {
        if (val) {
            //表格
            if (val.tableColumn) {
                this.tableColumn = val.tableColumn.filter(item => {
                    return item.visible == true
                })
            }
            //表格操作悬浮窗中的按钮
            if (val.operatorBtns && val.isShowTableOperatorBtns && val.operatorBtns.length > 0) {
                this.operatorBtns = val.operatorBtns.filter(item => {
                    return item.visible == true
                })
                //console.log('operatorBtns', this.operatorBtns, this.operatorBtns.length)
            }
        }
    }
    @Watch('pagination', { immediate: true })
    watchPaginationData(val) {
        if (val) this.paginationJson = val
        if (!this.paginationJson.pageSize) {
            this.$set(this.paginationJson, 'pageSize', 10)
        }
        if (!this.paginationJson.currentPage) {
            this.$set(this.paginationJson, 'currentPage', 1)
        }
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
    // input失去焦点
    tableInputBlur(method, prop, item) {
        if (method) {
            this.$emit(method, {
                prop,
                item
            })
        }
    }

    //字段中的点击事件
    tableColumnClick(method, prop, item) {
        this.$emit(method, {
            prop,
            item
        })
    }
    handleSelectionChange(val) {
        //this.chooseTableColumn = val
        Bus.emit('setChooseTableColumn', val)
    }
    //点击某一页
    handleCurrentChange(val) {
        this.$emit('handleCurrentChange', val)
    }

    // 搜索按钮
    searchclick(searchValue, prop) {
        this.$emit('search', {
            searchValue,
            prop
        })
    }

    //是否删除按钮,根据handel方法名称
    isDeleteBtn(btn) {
        //console.log('btn', btn.handle.toLowerCase())
        if (btn.handle.toLowerCase().indexOf('delete') > -1) return true
        else return false
    }

    indexMethod(index) {
        return (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
    }
}
</script>
