<template>
    <div class="main">
        <div class="searchDiv">
            <query-info :propertyData="propertyData">
                <template #list2>
                    <div style="margin-left:-100px;margin-top:-30px;">
                        <div>这种slot的label设为空，并且设置margin-left，根据实际情况调整，并且可以自定义一些其他内容</div>
                    </div>
                </template>
            </query-info>
        </div>
        <table-component :loading="loading" :propertyData="propertyData" :tableData="tableData" @handleShow="handleShow"></table-component>
    </div>
</template>
<script lang="ts">
import { BaseVue, IasService } from '@/common'
import { Component } from 'vue-property-decorator'
import TableComponent from '../../../../../packages/components/packages/pages/Table.vue'
import QueryInfo from '../../../../../packages/components/packages/pages/Query.vue'
import { Bus } from '../../../../../packages/components/common/bus'
@Component({
    components: {
        TableComponent,
        QueryInfo
    }
})
export default class Table extends BaseVue {
    propertyData = {}
    initTableData = [
        {
            id: '12987122',
            name: '王小虎',
            amount1: '234',
            amount2: '3.2',
            amount3: 10
        },
        {
            id: '12987122',
            name: '王小虎',
            amount1: '165',
            amount2: '4.43',
            amount3: 12
        },
        {
            id: '12987122',
            name: '666',
            amount1: '324',
            amount2: '1.9',
            amount3: 9
        },
        {
            id: '12987125',
            name: 'april',
            amount1: '621',
            amount2: '2.2',
            amount3: 17
        },
        {
            id: '12987126',
            name: 'april',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
        }
    ]
    tableData = []
    loading = true
    created() {
        //高级搜索模块的配置方法handler
        Bus.on('handleAdvanceSearch', this.advanceSearch)
        this.getPropertyDataJson()
    }
    destroyed() {
        Bus.off('handleAdvanceSearch', this.advanceSearch)
    }
    mounted() {
        this.queryList(null)
    }
    getPropertyDataJson() {
        IasService.getDemoJsonProperty('demo/Table.json', res => {
            this.propertyData = res
        })
    }
    exportExcel(query: Record<string, any>) {
        //todo
        console.log('export', query)
    }
    async advanceSearch(query: Record<string, any>) {
        console.log('advanceSearch', query)
        this.queryList(query)
    }

    async queryList(query) {
        this.loading = false
        if (query && query.name) {
            this.tableData = this.initTableData.filter(item => {
                return item.name.indexOf(query.name) > -1
            })
            console.log('queryList', this.tableData)
        } else {
            this.tableData = this.initTableData
        }
    }

    handleShow(clickParms) {
        alert('handleShow')
        console.log('handleShow', clickParms.row)
    }
}
</script>
