<template>
    <div class="main">
        <multi-row-table :propertyData="propertyData" :tableData="tableData"></multi-row-table>
    </div>
</template>
<script lang="ts">
import { BaseVue, IasService } from '@/common'
import { Component } from 'vue-property-decorator'
import MultiRowTable from '../../../../../packages/components/packages/pages/MultiRowTable.vue'
@Component({
    components: {
        MultiRowTable
    }
})
export default class Table extends BaseVue {
    propertyData = { tableColumn: [] }
    tableData = []
    created() {
        this.getPropertyDataJson()
    }
    getPropertyDataJson() {
        IasService.getDemoJsonProperty('demo/MultiRowTable.json', res => {
            this.propertyData = res
        })
    }
}
</script>
