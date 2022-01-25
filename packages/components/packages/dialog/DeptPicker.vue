<template>
    <div class="deptPicker">
        <div class="left">
            <div class="search">
                <el-select v-model="searchVal" ref="select" multiple filterable remote placeholder="请输入关键词" :remote-method="queryDept" :loading="loading">
                    <el-option v-for="item in deptOptions" :key="item[myOptions.tree.nodeKey]" :label="item.name" :value="item[myOptions.tree.nodeKey]"> </el-option>
                </el-select>
            </div>
            <div class="tree">
                <el-tree
                    v-loading="loadingTree"
                    :props="props"
                    ref="tree"
                    :data="data"
                    show-checkbox
                    :node-key="myOptions.tree.nodeKey"
                    :default-checked-keys="list"
                    :default-expanded-keys="list"
                    @check-change="handleCheckChange"
                    empty-text=""
                ></el-tree>
            </div>
        </div>
        <div class="right">
            <selected-area
                :selectedList="list"
                :showProp="myOptions.tree.showProp"
                :keyProp="myOptions.tree.nodeKey"
                @deleteSelectedHandle="deleteSelectedHandle"
                @clearAllSelectedHandle="clearAllSelectedHandle"
            ></selected-area>
        </div>
        <div class="btnBox">
            <el-button @click="cancel">取 消</el-button>
            <el-button @click="reset">重 置</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Bus } from '../../common/bus'
import { IasService } from '../../services'
import SelectedArea from './SelectedArea.vue'
@Component({
    components: {
        SelectedArea
    }
})
export default class DeptPicker extends Vue {
    @Prop() oldList: Array<Record<string, any>>
    @Prop() options: Record<string, any>
    myOptions = { saveHandle: '', cancelHandle: '', tree: { dataSource: {}, selectedProp: [], propName: [], showProp: '', nodeKey: '' } }
    myDataSource = { from: '', code: '', onlyEndCheck: '', dataList: [] }
    list = []
    props = {
        label: 'name',
        children: 'children'
    }
    searchVal = []
    data = []

    loading = true
    loadingTree = true
    deptOptions = []
    @Watch('options', { immediate: true })
    WatchOptions(val) {
        this.myOptions = val
        this.myDataSource = val.tree.dataSource
        this.getDeptTree()
    }
    @Watch('oldList', { immediate: true })
    WatchOldList(val) {
        if (val && val.length > 0) {
            this.list = val
            this.$nextTick(() => {
                this.refreshTreeSelectedNode()
            })
        }
    }

    // @Watch('list', { immediate: true })
    // watchList(val) {
    //     if (val && val.length > 0) {
    //         const tree = this.$refs.tree as any
    //         tree.setCheckedKeys(
    //             this.list.map(item => {
    //                 return item.code
    //             })
    //         )
    //     }
    // }
    @Watch('searchVal', { immediate: true })
    WatchSearchVal(val) {
        //console.log('watchSearchVal', val)
        if (val && val.length > 0) {
            const searchItem = this.deptOptions.filter(element => {
                return element[this.myOptions.tree.nodeKey] == val[0]
            })[0]
            this.setCheckedNode(Object.assign({}, searchItem))
            //console.log('searchVal', val, this.list)
        }
    }

    setCheckedNode(data) {
        this.addNodeToList(data)
        //console.log('list', this.list)
        //出去list中选中的值，
        this.refreshTreeSelectedNode()
        // const tree = this.$refs.tree as any
        // const keys = tree.getCheckedKeys()
        // keys.push(data[this.myOptions.tree.nodeKey])
        // tree.setCheckedKeys(keys)
        this.searchVal = []
        const select = this.$refs.select as any
        select.blur()
        //console.log('setCheckedNode', this.list)
    }
    async getDeptTree() {
        if (this.myDataSource.from && this.myDataSource.from == 'dictionary') {
            const { success, data } = await IasService.getDicTree(this.myDataSource.code)
            if (success) {
                this.data = data
                this.loadingTree = false
            }
        } else {
            this.data = this.myDataSource.dataList
        }
    }
    async queryDept(query) {
        this.loading = true
        if (this.myDataSource.from && this.myDataSource.from == 'dictionary') {
            if (query && query != '') {
                const { success, data } = await IasService.queryDic(this.myDataSource.code, query)
                if (success) {
                    this.deptOptions = data
                    this.loading = false
                }
            }
        } else {
            //todo
        }
    }
    handleCheckChange(data, isCheck) {
        //console.log('handleCheckChange', data, isCheck)
        this.$nextTick(() => {
            //两种方式，一种是string[],另一种是object[]；如果propName不存在或者为空，那么就是第一种方式，如果propName不为空，就是object的数组
            if (isCheck) {
                //选择父级栏目的时候判断list中没有children的栏目就补上
                this.addNodeList(data)
            } else {
                if (this.myOptions.tree.propName && this.myOptions.tree.propName.length > 0) {
                    this.list = this.list.filter(item => {
                        return item[this.myOptions.tree.propName[0]] != data[this.myOptions.tree.selectedProp[0]]
                    })
                } else {
                    this.list = this.list.filter(item => {
                        return item != data[this.myOptions.tree.selectedProp[0]]
                    })
                }
            }
            //console.log('after handlecheck', this.list)
        })
    }
    addNodeToList(data) {
        if (this.myOptions.tree.propName && this.myOptions.tree.propName.length > 0) {
            const val = {}
            this.myOptions.tree.propName.forEach((name, index) => {
                this.$set(val, name, data[this.myOptions.tree.selectedProp[index]])
            })
            if (!this.compareObject(data, this.list)) this.list.push(val)
            //this.list.push(val)
        } else {
            //console.log('newValue', data[this.myOptions.tree.selectedProp[0]], data)
            if (this.list.findIndex(data[this.myOptions.tree.selectedProp[0]]) < 0) this.list.push(data[this.myOptions.tree.selectedProp[0]])
        }
    }
    addNodeList(data) {
        if (data.children) {
            data.children.forEach(element => {
                this.addNodeList(element)
            })
        } else this.addNodeToList(data)
        //console.log('handleCheckChange', this.list)
    }
    refreshTreeSelectedNode() {
        const tree = this.$refs.tree as any
        tree.setCheckedKeys(
            this.list.map(item => {
                return item[this.myOptions.tree.nodeKey]
            })
        )
    }
    confirm() {
        Bus.emit(this.myOptions.saveHandle, this.list)
    }
    cancel() {
        this.$emit(this.myOptions.cancelHandle)
    }
    reset() {
        this.clearAllSelected()
    }
    clearAllSelected() {
        this.list = []
        const tree = this.$refs.tree as any
        tree.setCheckedKeys([])
    }
    //用nodeKey来比较，因为nodeKey一定是里面的字段值，并且唯一
    compareObject(val, arr) {
        if (val && arr.length > 0) {
            let equallFlag = false
            arr.forEach(element => {
                if (element[this.myOptions.tree.nodeKey] == val[this.myOptions.tree.nodeKey]) equallFlag = true
            })
            return equallFlag
        }
        return false
    }

    deleteSelectedHandle(item) {
        //console.log('deleteSelected', item)
        this.list = this.list.filter(element => {
            return element[this.myOptions.tree.nodeKey] != item[this.myOptions.tree.nodeKey]
        })
        this.refreshTreeSelectedNode()
    }
    clearAllSelectedHandle() {
        this.clearAllSelected()
    }
}
</script>
