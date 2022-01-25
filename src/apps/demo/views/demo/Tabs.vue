<template>
    <div class="main">
        <div class="searchDiv">
            <query-info :propertyData="propertyData"></query-info>
        </div>
        <tabs :propertyData="propertyData">
            <template #tab1>
                <slot-list :uuid="1111111"></slot-list>
            </template>
            <template #tab2>
                <div>
                    <div>这种slot的label设为空，并且设置margin-left，根据实际情况调整，并且可以自定义一些其他内容</div>
                    <slot-list :uuid="22222"></slot-list>
                </div>
            </template>
            <template #tab3>
                <slot-list :uuid="33333"></slot-list>
            </template>
        </tabs>
    </div>
</template>
<script lang="ts">
import { BaseVue, IasService } from '@/common'
import SlotList from './DemoListSlot.vue'
import { Component } from 'vue-property-decorator'
import Tabs from '../../../../../packages/components/packages/pages/Tabs.vue'
import QueryInfo from '../../../../../packages/components/packages/pages/Query.vue'
@Component({
    components: {
        Tabs,
        SlotList,
        QueryInfo
    }
})
export default class AnnounceIndex extends BaseVue {
    propertyData = {}
    created() {
        //高级搜索模块的配置方法handler
        this.getPropertyDataJson()
    }
    mounted() {
        console.log('mounted')
    }
    getPropertyDataJson() {
        IasService.getDemoJsonProperty('demo/Tabs.json', res => {
            this.propertyData = res
        })
    }
}
</script>
