<template>
    <div class="main">
        <!--直接使用query组件，请使用querySlot作为slot名称-->
        <query :propertyData="propertyData">
            <template #querySlot>
                <span style="width: 100px;margin-left:20px;">
                    111
                </span>
                <span style="width: 100px;margin-left:20px;">
                    222
                </span>
                <span style="width: 100px;margin-left:20px;">
                    000
                </span>
            </template>
            <template #queryBtnLeftSlot>
                <el-button>左边的按钮</el-button>
            </template>
            <template #queryBtnRightSlot>
                <el-button>右边的按钮</el-button>
            </template>
        </query>
        <div style="background:#ffc0cb59;height:30px;">中间的内容</div>
        <page-list
            :loading="loading"
            :propertyData="listPropertyData"
            :tableData="tableData"
            :pagination="pagination"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"
            @handleCurrentChange="handleCurrentChange"
            @tableInputBlur="tableInputBlur"
            @toLink="toLink"
        >
        </page-list>
        <el-dialog
            v-if="infoVisible"
            :visible="infoVisible"
            title="公告管理"
            custom-class="dialog-position dialog-position-auto dialog-position-auto--nopadding"
            :append-to-body="true"
            width="90%"
            height="100%"
            @close="editCloseHandler"
        >
            <demo-info :id="currentEditItem.guid" @close="editCloseHandler" />
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { BaseVue, IasService } from '@/common'
import { messages } from '@/common/display-messages'
import { Component } from 'vue-property-decorator'
import PageList from '../../../../../packages/components/packages/pages/PageList.vue'
import Query from '../../../../../packages/components/packages/pages/Query.vue'
import DemoInfo from './Info.vue'
import { demoService } from '../../services/'
import { Bus } from '../../../../../packages/components/common/bus'
import { Message } from 'element-ui'
@Component({
    components: {
        PageList,
        DemoInfo,
        Query
    }
})
export default class AnnounceIndex extends BaseVue {
    propertyData = {}
    listPropertyData = {}
    /** 没有数据时的文本提示 */
    emptyText = messages.COMMON_LIST_NO_DATA
    tableData = []
    loading = true
    /**
     * 分页
     */
    pagination = {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
    condition = {}
    /**
     * 是否显示Info页面
     */
    infoVisible = false
    /**
     * 当前编辑的数据
     */
    currentEditItem = {
        id: null
    }
    created() {
        //高级搜索模块的配置方法handler
        Bus.on('handleAdvanceSearch', this.advanceSearch)
        Bus.on('handleExport', this.exportExcel)
        Bus.on('handleAdd', this.handleAdd)
        Bus.on('handleBatchDelete', this.handleBatchDelete)
        this.getPropertyDataJson()
    }
    mounted() {
        this.queryList()
    }
    destroyed() {
        Bus.off('handleAdvanceSearch', this.advanceSearch)
        Bus.off('handleExport', this.exportExcel)
        Bus.off('handleAdd', this.handleAdd)
        Bus.on('handleBatchDelete', this.handleBatchDelete)
    }
    getPropertyDataJson() {
        IasService.getDemoJsonProperty('demo/Index.json', res => {
            this.propertyData = res
            //query和pagelist分开引用
            this.listPropertyData = JSON.parse(JSON.stringify(res))
            this.$set(this.listPropertyData, 'isSearchShow', false)
            this.$set(this.listPropertyData, 'isAdvanceSearchShow', false)
            console.log('listPropertyData', this.listPropertyData, this.propertyData)
        })
    }
    exportExcel(query: Record<string, any>) {
        //todo
        console.log('export', query)
    }
    async advanceSearch(query: Record<string, any>) {
        this.pagination.currentPage = 1
        this.condition = query
        this.queryList()
    }

    async queryList() {
        const params = {
            condition: this.condition,
            currentPage: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
        }
        console.log(params)
        const { success, data } = await demoService.queryList(params)
        console.log(success, data)
        if (success) {
            this.loading = false
            const list = JSON.parse(JSON.stringify(data.list)) || []
            if (list && list.length > 0) {
                list.forEach(element => {
                    //是否置顶
                    element.isTop ? (element.isTopText = '是') : (element.isTopText = '否')
                })
            }
            this.tableData = list
            this.pagination.total = data.total
        }
    }
    // 搜索
    search(data) {
        for (const key in this.condition) {
            console.log('key', key, data.prop)
            if (key == data.prop) {
                //this.condition[key] = data.searchValue
                this.$set(this.condition, key, data.searchValue)
            }
        }
        console.log('search', this.condition)
        this.pagination.currentPage = 1
        this.queryList()
        console.log(data)
    }

    // 表格里面的 input修改
    tableInputBlur(str) {
        console.log(str)
        // 接下来写对应的修改接口
    }
    //点击某列
    toLink(params) {
        this.infoVisible = true
        this.currentEditItem = params.item
    }
    //编辑
    handleEdit(clickParms) {
        this.infoVisible = true
        this.currentEditItem = clickParms.row
    }
    //新增
    handleAdd() {
        this.infoVisible = true
    }
    // 删除
    handleDelete(clickParams) {
        this.deleteApi(clickParams.row.id)
    }
    // 批量删除
    handleBatchDelete(list) {
        if (list.length > 0) {
            this.$confirm('确认删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(() => {
                const idList = []
                list.forEach(element => {
                    idList.push(element.id)
                })
                this.deleteApi(idList.join(','))
            })
            return false
        } else {
            Message.error('请选择需要删除的行')
        }
    }
    // 删除api
    async deleteApi(id) {
        const success = true
        if (success) {
            this.$message({
                message: '删除成功',
                type: 'success'
            })
            this.queryList()
        }
    }
    //分页 页数
    handleCurrentChange(currentPage) {
        this.pagination.currentPage = currentPage
        this.queryList()
    }

    editCloseHandler(flag: 'ok' | 'cancel') {
        this.currentEditItem = { id: null }
        this.infoVisible = false
        if (flag === 'ok') {
            this.queryList()
        }
    }
}
</script>
