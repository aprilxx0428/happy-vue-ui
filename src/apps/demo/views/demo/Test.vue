<template>
    <el-checkbox-group v-model="checkList">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="禁用"></el-checkbox>
        <el-checkbox label="选中且禁用"></el-checkbox>
    </el-checkbox-group>
</template>
<script lang="ts">
import { BaseVue, IasService } from '@/common'
import { Component } from 'vue-property-decorator'
import { Bus } from '../../../../../packages/components/common/bus'
@Component({})
export default class Table extends BaseVue {
    checkList = ['选中且禁用', '复选框 A']
}
</script>
