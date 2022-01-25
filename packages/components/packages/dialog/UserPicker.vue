<template>
    <div class="userPicker clearfix">
        <div class="treeContent" :style="`right: ${treeOptions.width}; width: ${treeOptions.width}`">
            <template>
                <el-tree v-if="myReloadTree" :props="props" ref="tree" :node-key="treeOptions.nodeKey" :load="loadNode" lazy show-checkbox @check-change="handleCheckChange" @node-click="nodeClick">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span v-if="data.searchParam == 'customGroup' && node.level > 1">
                            <el-button type="text" size="mini" @click="() => delMemberGroup(node, data)">
                                <span style="font-size:0.8rem;">删除</span>
                            </el-button>
                        </span>
                    </span>
                </el-tree>
            </template>
        </div>
        <div class="tableContent" :style="`left: calc(${treeOptions.width} + 12px);width:${selectAreaOptions.width}`">
            <choose-people-page-list
                :loading="loading"
                :propertyData="selectAreaOptions"
                :tableData="tableData"
                :pagination="pagination"
                :selectedList="selectedList"
                :peopleDeleteItem="peopleDeleteItem"
                @selectionChange="selectionChange"
                @selectionAllChange="selectionAllChange"
                @handleCurrentChange="handleCurrentChange"
                :max="max"
            ></choose-people-page-list>
        </div>
        <div class="choosePeopleContent" :style="` width: calc(100% - ${treeOptions.width} - ${selectAreaOptions.width} - 22px)`">
            <people
                :selectedList="selectedList"
                :showProp="showProp"
                :keyProp="keyProp"
                :saveGroup="saveGroup"
                @deleteSelectedHandle="peopleDeleteItemHandle"
                @clearAllSelectedHandle="peopleClearAllHandle"
            ></people>
        </div>
        <div class="btnBox">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </div>
</template>
<script lang="ts">
import { IasService } from '../../services'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ChoosePeoplePageList from './ChoosePeoplePageList.vue'
import People from './SelectedArea.vue'
import { Bus } from '../../common/bus'
import config from '../../config'
@Component({
    components: {
        ChoosePeoplePageList,
        People
    }
})
export default class UserPicker extends Vue {
    @Prop() options: object
    @Prop() oldList: Array<Record<string, any>> //编辑页接口返回的已经选中的人列表
    @Prop() max: number //最多选择几个，最少选择几个在picker的saveHandler里面自行实现判断，组件中不再控制
    @Prop() reloadTree: boolean //重新加载树

    myReloadTree = true
    // choosePeopleWidth = '' //右侧已选中的人div宽度
    isGetDictionary = false //是否需要获取字典项
    treeOptions = { selectedProp: '', dataSource: { dataList: [] } }
    showProp = ''
    keyProp = ''
    //是否显示“保存分组”
    saveGroup = {}
    selectAreaOptions = { handle: '', apiParams: '' }
    props = {
        label: 'label',
        children: 'children',
        isLeaf: 'isLeaf'
    }
    myOptions = { saveHandle: '', cancelHandle: '' }

    tableData = []
    allTableList = []
    loading = true

    /**
     * 分页
     */
    name = ''
    type = ''
    pagination = {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
    selectedProp = ''
    currentCode = ''
    selectedList = [] //已选的人列表
    peopleDeleteItem = {} //删除的某个成员
    selectedTreeNodes = [] //已选的树节点
    currentCondition = {}
    currentCheckTreeNode = { prop: '', value: '' }
    @Watch('reloadTree', { immediate: true })
    watchReloadTree(val) {
        console.log('watchReloadTree', val)
        if (val == false) this.myReloadTree = false
        else this.myReloadTree = true
    }
    @Watch('options', { immediate: true })
    watchOptions(val) {
        this.myOptions = val
        this.treeOptions = val.tree
        this.selectAreaOptions = val.selectArea
        this.showProp = val.selectArea.showProp
        this.keyProp = val.selectArea.keyProp
        this.saveGroup = val.selectArea.saveGroup
        this.selectedProp = val.tree.selectedProp
    }
    // @Watch('selectedList', { immediate: true })
    // watchSelectedList(val) {
    //     //Bus.emit('setChooseUsersValue', val)
    // }

    @Watch('oldList', { immediate: true })
    watchOldList(val) {
        if (val) this.selectedList = val
    }

    created() {
        //query查询后获得api返回table数据，emit到这里
        Bus.on('setQueryTableResult', this.setQueryTableResult)
        this.getTableList(this.currentCondition)
        this.getAllTableList()
    }
    destroyed() {
        Bus.off('setQueryTableResult', this.setQueryTableResult)
    }
    handleCheckChange(data, isCheck) {
        //console.log(data, isCheck)
        this.$nextTick(() => {
            if (isCheck) {
                const searchParam = data.searchParam
                //市代表，只有一个checkbox，要么全选要么全不选
                if (searchParam == '' && data.value == 'all') {
                    this.selectedList = this.allTableList.map(item => Object.assign({}, item))
                } else if (searchParam == 'customGroup') {
                    //console.log(data, '分组')
                    this.allTableList.forEach(item => {
                        if (data.refTableIds && data.refTableIds.indexOf(item[this.keyProp]) > -1 && this.selectedList.map(v => v[this.keyProp]).indexOf(item[this.keyProp]) < 0)
                            this.selectedList.push(item)
                    })
                    //console.log('customGroup', this.selectedList, this.allTableList)
                } else {
                    this.allTableList.forEach(item => {
                        //if (item[searchParam] == data[this.selectedProp]) this.selectedList.push(item)

                        if (item[searchParam] && item[searchParam].indexOf(data[this.selectedProp]) > -1 && this.selectedList.indexOf(data[this.selectedProp]) < 0) this.selectedList.push(item)
                    })
                }
                this.limitSelectedNumber()
            } else {
                const searchParam = data.searchParam
                if (searchParam == '' && data.value == 'all') {
                    this.selectedList = []
                } else if (searchParam == 'customGroup') {
                    //分组
                    //console.log('分组', data, this.selectedList)
                    this.selectedList = this.selectedList.filter(item => {
                        //console.log('2222', item[this.keyProp], data.refTableIds, data.refTableIds.indexOf(item[this.keyProp]) < 0)
                        return data.refTableIds && data.refTableIds.indexOf(item[this.keyProp]) < 0
                    })
                } else {
                    this.selectedList = this.selectedList.filter(item => {
                        return item[searchParam].indexOf(data[this.selectedProp]) < 0
                    })
                }
                //console.log('去掉-最终', this.selectedList)
                this.limitSelectedNumber()
            }
        })
    }
    nodeClick(data, node, myself) {
        this.pagination.currentPage = 1
        const searchParam = data.searchParam
        //this.currentClickTreeNode = { prop: searchParam, value: data[searchParam] }
        //暂时一棵树的查询列表参数传值只在selectedProp配置
        //配置中的树的选中参数，对应接口的查询条件参数
        //value如果配置了就传value值，用于非叶子节点查询该节点下所有，跟后端约定，非叶子节点传all，已配置在value的值
        let condition = {}
        if (data.value) condition = { [searchParam]: data.value }
        else condition = { [searchParam]: data[this.selectedProp] }
        this.currentCondition = condition
        this.getTableList(this.currentCondition)
    }

    async loadNode(node, resolve) {
        console.log('loadNode', node.level)
        if (node.level === 0) {
            return resolve(this.treeOptions.dataSource.dataList)
        } else {
            if (node.data.from && node.data.from == 'json') {
                if (node.data.children) {
                    node.data.children.forEach(element => {
                        element.from = 'json'
                        element.searchParam = node.data.searchParam
                        element.isLeaf = element.children == null || element.children.length == 0 ? true : false
                    })
                    return resolve(node.data.children)
                } else return resolve([])
            } else if (node.data.from && node.data.from == 'dictionary') {
                const parentCode = node.data.code
                const { success, data } = await IasService.getDictionary(parentCode)
                if (success) {
                    if (data && data.length == 0) {
                        // node.parent.childNodes.forEach(element => {
                        //     if (element.data.code == parentCode) {
                        //         element.data.disabled = false
                        //     }
                        // })
                        return resolve([])
                    }
                    data.forEach(element => {
                        element.disabled = false
                        element.label = element.name
                        element.from = 'dictionary'
                        element.searchParam = node.data.searchParam
                        element.isLeaf = element.isdirectory == 0 ? true : false
                    })
                    resolve(data)
                }
            } else if (node.data.from && node.data.from == 'outApi') {
                const options = node.data.options
                console.log(options, options.params, options[options.params])
                let url = options.url
                if (options.url.indexOf('http') < 0) url = config.apiHost + url
                const { success, data } = await IasService.testQueryDictionayApi(url, options[options.params])
                if (success) {
                    if (data && data.length == 0) {
                        // node.parent.childNodes.forEach(element => {
                        //     if (element.data.code == parentCode) {
                        //         element.data.disabled = false
                        //     }
                        // })
                        return resolve([])
                    }
                    data.forEach(element => {
                        element.disabled = false
                        element.from = 'outApi'
                        element.label = element[options.label]
                        element.options = Object.assign({}, options)
                        this.$set(element.options, options.params, element[options.params])
                        element.searchParam = node.data.searchParam
                    })
                    console.log('data', data, options)
                    resolve(data)
                }
            }
        }
    }

    setQueryTableResult(data) {
        this.tableData = data.list
        this.pagination.total = data.total
        this.pagination.currentPage = 1
        this.pagination.pageSize = 10
    }
    // 获取table列表
    async getTableList(searchCondition) {
        console.log('getTableList', searchCondition)
        let params = {}
        if (searchCondition) params = searchCondition

        // params = {
        //     currentPage: this.pagination.currentPage,
        //     pageSize: this.pagination.pageSize
        // }
        this.$set(params, 'currentPage', this.pagination.currentPage)
        this.$set(params, 'pageSize', this.pagination.pageSize)
        Bus.emit(this.selectAreaOptions.handle, params, res => {
            //console.log('getTableList', res)
            const { success, data } = res
            if (success) {
                this.loading = false
                this.tableData = data.list
                this.pagination.total = data.total
            }
        })
    }
    //获取所有的成员列表
    async getAllTableList() {
        const params = {
            currentPage: 1,
            pageSize: 10000
        }
        Bus.emit(this.selectAreaOptions.handle, params, res => {
            const { success, data } = res
            if (success) {
                this.loading = false
                this.allTableList = data.list
            }
        })
    }
    //分页 页数
    handleCurrentChange(currentPage, condition) {
        this.pagination.currentPage = currentPage
        this.currentCondition = condition
        this.getTableList(this.currentCondition)
    }
    selectionChange(data) {
        if (data.error) {
            this.$emit('errorHandler')
        } else {
            if (data.isAddRow) {
                this.selectedList.push(data.row)
            } else {
                this.selectedList = this.selectedList.filter(element => {
                    return element[this.keyProp] != data.row[this.keyProp]
                })
            }
            //this.limitSelectedNumber()
            //console.log('selectionChange', this.selectedList)
        }
    }
    selectionAllChange(data) {
        //console.log('selectionAllChange', data)
        if (data.error) {
            this.$emit('errorHandler')
        }
        if (data.isCheckAll) {
            //全选
            const newArr = [] //数组中相同的元素
            for (let i = 0; i < data.list.length; i++) {
                for (let j = 0; j < this.selectedList.length; j++) {
                    if (this.selectedList[j][this.keyProp] === data.list[i][this.keyProp]) {
                        newArr.push(data.list[i])
                    }
                }
            }
            const diffArry = newArr.concat(data.list).filter(function(v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
            this.selectedList = this.selectedList.concat(diffArry)
        } else {
            // 非全选
            this.selectedList = this.getDiffArray(this.selectedList, data.list)
        }

        //console.log('selectionAllChange-selectedList', this.selectedList)
        this.limitSelectedNumber()
    }
    // 获取两个数组中的不同元素
    getDiffArray(peopleList, list) {
        const result = []
        for (let i = 0; i < peopleList.length; i++) {
            const obj = peopleList[i]
            const id = obj[this.keyProp]
            let isExist = false
            for (let j = 0; j < list.length; j++) {
                const aj = list[j]
                const n = aj[this.keyProp]
                if (n == id) {
                    isExist = true
                    break
                }
            }
            if (!isExist) {
                result.push(obj)
            }
        }
        return result
    }
    //点击已选人员的 删除选中的某个成员
    peopleDeleteItemHandle(item) {
        //console.log('peopleDeleteItemHandle', item)
        this.selectedList = this.selectedList.filter(element => {
            return element[this.keyProp] != item[this.keyProp]
        })
        this.peopleDeleteItem = item
    }
    // 清空
    peopleClearAllHandle() {
        this.selectedList = []
        this.$nextTick(() => {
            const tree = this.$refs.tree as any
            tree.setCheckedKeys([])
        })
    }
    confirm() {
        //this.$emit('setChooseUserValue', this.prop, this.myValue)
        //Bus.emit('setChooseUsersValue', this.selectedList)
        Bus.emit(this.myOptions.saveHandle, this.selectedList)
    }
    cancel() {
        this.$emit(this.myOptions.cancelHandle, false)
    }

    limitSelectedNumber() {
        //根据max控制最终选择结果集个数
        if (this.max && this.max < this.selectedList.length) {
            this.$emit('errorHandler')
            this.selectedList = this.selectedList.filter((item, index) => {
                return index < this.max
            })
            //console.log('this.selectedlist', this.selectedList)
        }
    }

    //删除分组
    delMemberGroup(node, data) {
        this.$confirm('确认删除分组【' + data.groupName + '】吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
        }).then(() => {
            Bus.emit(this.saveGroup['delHandler'], data.groupName)
            console.log('delMemberGroup', node, data)
            const parent = node.parent
            const children = parent.childNodes
            console.log('parent', parent, 'children', children)
            const index = children.findIndex(d => d.data.groupName === data.groupName)
            children.splice(index, 1)
        })
    }
}
</script>
