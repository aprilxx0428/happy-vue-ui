<template>
    <page-list :loading="loading" :propertyData="propertyData" :tableData="tableData" :pagination="pagination" @handleCurrentChange="handleCurrentChange"></page-list>
</template>

<script lang="ts">
import { BaseVue, IasService } from '@/common'
import { Component } from 'vue-property-decorator'
import PageList from '../../../../../packages/components/packages/pages/PageList.vue'
@Component({
    components: {
        PageList
    }
})
export default class EasyIndex extends BaseVue {
    propertyData = {}
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

    listResult = [
        {
            account: 'april',
            userName: '吉倩',
            mobile: '15001111111'
        },
        {
            account: 'cj',
            userName: '储俊',
            mobile: '15001112222'
        }
    ]

    created() {
        this.getPropertyDataJson()
    }
    mounted() {
        this.queryList()
    }
    getPropertyDataJson() {
        IasService.getDemoJsonProperty('demo/EasyIndex.json', res => {
            this.propertyData = res
        })
    }
    queryList() {
        setTimeout(() => {
            this.tableData = this.listResult
            this.pagination.total = this.listResult.length
            this.loading = false
        }, 3000)
    }

    //分页 页数
    handleCurrentChange(currentPage) {
        this.pagination.currentPage = currentPage
        this.queryList()
    }
}
</script>
