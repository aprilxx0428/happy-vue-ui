<template>
    <div>
        <page-list :propertyData="propertyData" :tableData="tableData"></page-list>
    </div>
</template>
<script lang="ts">
import { BaseVue, IasService } from '@/common'
import { Component, Prop, Watch } from 'vue-property-decorator'
import PageList from '../../../../../packages/components/packages/pages/PageList.vue'
@Component({
    components: {
        PageList
    }
})
export default class SlotList extends BaseVue {
    @Prop() listData: []
    //propertyData = require('../../../../../public/config/fx/demo/Index.json')
    propertyData = {}
    /** 没有数据时的文本提示 */
    tableData = []
    @Watch('listData', { immediate: true })
    WatchData(val) {
        if (val) this.tableData = val
    }
    created() {
        this.getPropertyDataJson()
    }

    getPropertyDataJson() {
        IasService.getDemoJsonProperty('demo/ContactTableSlot.json', res => {
            this.propertyData = res
        })
    }
}
</script>
