<template>
    <div>
        <div>uuid:{{ uuid }}</div>
        <page-list
            :loading="loading"
            :propertyData="propertyData"
            :tableData="tableData"
            :pagination="pagination"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"
            @handleCurrentChange="handleCurrentChange"
            @tableInputBlur="tableInputBlur"
            @toLink="toLink"
        ></page-list>
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
            <demo-info :id="currentEditItem.id" @close="editCloseHandler" />
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { BaseVue, IasService } from '@/common'
import { messages } from '@/common/display-messages'
import { Component, Prop } from 'vue-property-decorator'
import PageList from '../../../../../packages/components/packages/pages/PageList.vue'
import DemoInfo from './Info.vue'
import { demoService } from '../../services'
import { Bus } from '../../../../../packages/components/common/bus'
import { Message } from 'element-ui'
@Component({
    components: {
        PageList,
        DemoInfo
    }
})
export default class SlotList extends BaseVue {
    @Prop() uuid: string
    //propertyData = require('../../../../../public/config/fx/demo/Index.json')
    propertyData = {}
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
        IasService.getDemoJsonProperty('demo/DemoListSlot.json', res => {
            this.propertyData = res
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
