<template>
    <div class="tabsBox">
        <el-tabs v-model="myBasic.activeName" :type="myBasic.type" @tab-click="handleClick">
            <el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in myBasic.tabPanel" :key="index">
                <slot :name="item.slotName"></slot>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class Tabs extends Vue {
    @Prop() propertyData: Record<string, any>
    myOptions = {}
    myBasic = { type: '', tabPanel: [] }
    @Watch('propertyData', { immediate: true })
    WatchOptions(val) {
        if (val) this.myOptions = val
        if (val && val.tabs) this.myBasic = val.tabs
    }
    handleClick(tab, event) {
        console.log(tab, event)
    }
}
</script>
