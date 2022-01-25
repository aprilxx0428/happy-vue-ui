<template>
    <div class="selectedBox">
        <div class="choosePeopleTitle">
            <div class="choosePeopleTitle_number"><span>已选：</span>{{ list.length }}人</div>
            <el-button type="primary" size="mini" style="margin:0" @click="deleteAll">清空</el-button>
            <span style="margin-left:10px;" v-if="saveGroup && saveGroup.visible" @click="saveMemberGroupHandler">保存分组</span>
        </div>
        <div class="peoplelist">
            <div class="peopleitem" v-for="(item, index) of list" :key="`people${index}`">
                <span v-html="showProp ? item[showProp] : item"></span>
                <i class="el-icon-close" @click="peopleDelClick(item)"></i>
            </div>
        </div>
        <el-dialog
            v-if="renameGroupVisible"
            :visible="renameGroupVisible"
            title="保存分组"
            custom-class="dialog-position dialog-position-auto dialog-position-auto--nopadding"
            :append-to-body="true"
            width="400px"
            height="400px"
            @close="editCloseHandler"
        >
            <div style="margin:20px;"><el-input placeholder="请输入分组名称" v-model="groupName"></el-input></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="renameGroupVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMemberGroup">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { Vue, Watch, Component, Prop } from 'vue-property-decorator'
import { Bus } from '../../common/bus'
@Component
export default class SelectedArea extends Vue {
    @Prop() selectedList: Array<any>
    @Prop() showProp: string
    @Prop() keyProp: string
    @Prop() saveGroup: Record<string, any>
    list = []
    renameGroupVisible = false
    groupName = ''
    @Watch('selectedList', { immediate: true })
    watchList(val) {
        this.list = val
        //console.log('watchSelect', this.list)
    }

    // 删除某个人
    peopleDelClick(item) {
        // this.list.forEach((obj, index) => {
        //     if (obj[this.keyProp] == item[this.keyProp]) this.list.splice(index, 1)
        // })
        this.list = this.list.filter(element => {
            return element[this.keyProp] != item[this.keyProp]
        })
        this.$emit('deleteSelectedHandle', item)
    }
    // 清空
    deleteAll() {
        this.list = []
        this.$emit('clearAllSelectedHandle')
    }

    //保存分组弹出分组名称框
    saveMemberGroupHandler() {
        //判断是否已经有已选数据
        if (this.list.length == 0) this.$message.error('暂时没有已选数据，请先选择')
        else this.renameGroupVisible = true
    }

    editCloseHandler() {
        this.renameGroupVisible = false
    }

    saveMemberGroup() {
        if (this.groupName == '') {
            this.$message({
                message: '请输入自定义分组名称',
                type: 'warning'
            })
        } else {
            this.renameGroupVisible = false
            console.log('saveMemberGroup', this.list, this.groupName)
            Bus.emit(this.saveGroup['handler'], this.groupName, this.list)
        }
    }
}
</script>
