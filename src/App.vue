<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
// import opickerMixin from '@/mixins/opickerMixin.ts'

@Component({
    components: {}
    // mixins: [opickerMixin]
})
export default class App extends Mixins() {
    // mounted() {
    //     this.initOPicker()
    // }
}
</script>

<style lang="less">
html,
body {
    height: 100%;
    // text-size-adjust: none;//目前兼容性不强
    max-height: 10000px;
    -webkit-overflow-scrolling: touch; /* 用于 ios5+ */
}

#app {
    height: 100%;
}
@import './assets/fonts/cop/css/font-cop.css';
@import './assets/css/aioa.less';
@import './assets/css/belvoly.less';

.tableOperatePopover {
    min-width: 80px !important;
}
</style>
