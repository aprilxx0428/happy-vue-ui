<template>
    <div>
        <div class="search clearfix" v-if="propertyData.isSearchShow">
            <div class="searchLeft float-l">
                <el-input v-model="condition[searchContent.prop]" :placeholder="searchContent.placeholder"></el-input>
                <p class="searchBth bg-com-color colorF font15" @click="handleSearchMethod(searchContent.handle)">搜索</p>
                <span class="com-color font14" style="cursor: pointer;" v-if="propertyData.isAdvanceSearchShow" @click="isShowAdvanceSearchClick">高级搜索</span>
            </div>
            <div class="searchBtns float-r">
                <el-button v-for="(bth, index) of searchBthList" :key="`search${index}`" :type="bth.type" size="mini" @click="handleOperateMethod(bth.handle)">{{ bth.label }}</el-button>
            </div>
        </div>
        <div class="AdvanceSearch" v-if="isAdvanceSearchShow">
            <el-form
                ref="form"
                :model="condition"
                :label-width="labelWidth"
                v-loading="myLoading"
                :element-loading-text="loadingText"
                :element-loading-background="loadingBackground"
                element-loading-spinner="el-icon-loading"
            >
                <el-row>
                    <el-col :span="item.col ? item.col : 24" :key="index" v-for="(item, index) in formProperty">
                        <el-form-item :label="item.label" :prop="item.category == 'cascader' || item.category == 'checkbox' ? item.model : item.prop">
                            <template v-if="item.category == 'input'">
                                <el-input v-model="condition[item.prop]" :type="item.basic.type" :placeholder="item.basic.placeholder" :rows="item.basic.rows"></el-input>
                            </template>
                            <!-- 日期 -->
                            <template v-if="item.category == 'date'">
                                <date-picker v-model="condition[item.prop]" :basic="item.basic"></date-picker>
                            </template>
                            <!-- 时间 -->
                            <template v-if="item.category == 'time'">
                                <time-picker v-model="condition[item.prop]" :basic="item.basic"> </time-picker>
                            </template>
                            <!-- 单个下拉框 -->
                            <template v-if="item.category == 'select'">
                                <select-component :datasource="item.dataSource" :options="item.options" v-model="condition[item.prop]" :basic="item.basic"></select-component>
                            </template>
                            <!--级联下拉框 -->
                            <template v-if="item.category == 'cascader'">
                                <select-cascader :code="item.code" v-model="condition[item.model]" :basic="item.basic" :datasource="item.dataSource" :options="item.options"></select-cascader>
                            </template>
                            <!-- 多选框 -->
                            <template v-if="item.category == 'checkbox'">
                                <checkbox v-model="condition[item.model]" :datasource="item.dataSource.dataList" :options="item.options"></checkbox>
                            </template>
                            <!-- 单选框 -->
                            <template v-if="item.category == 'radio'">
                                <radio class="radioChoose" :datasource="item.dataSource.dataList" :options="item.options" v-model="condition[item.prop]"></radio>
                            </template>
                            <!-- 开关 -->
                            <template v-if="item.category == 'switch'">
                                <el-switch
                                    v-model="condition[item.prop]"
                                    :disabled="item.basic.disabled"
                                    :active-text="item.basic.activeText"
                                    :inactive-text="item.basic.inactiveText"
                                    :active-color="item.basic.activeColor"
                                    :inactive-color="item.basic.inactiveColor"
                                    :active-value="item.basic.activeValue"
                                    :inactive-value="item.basic.inactiveValue"
                                >
                                </el-switch>
                            </template>
                            <!--富文本编辑器-->
                            <template v-if="item.category == 'editor'">
                                <tinymce-editor
                                    :tinymceHtml="condition[item.prop] != 'undefined' ? condition[item.prop] : ''"
                                    v-model="condition[item.prop]"
                                    class="resize-none"
                                    :imageUploadUrl="tinymceImageUploadUrl"
                                ></tinymce-editor>
                            </template>
                            <!-- <template v-if="item.category == 'file'">
                                <upload-file :id="id" :refTableName="item.refTableName"></upload-file>
                            </template> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item class="advanceSearchBthClass">
                            <el-button v-for="(bth, index) of advanceSearchBtns" :key="`search${index}`" :type="bth.type" size="mini" @click="handleSearchMethod(bth.handle)">{{
                                bth.label
                            }}</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Watch, Component, Prop } from 'vue-property-decorator'
import 'element-ui/lib/theme-chalk/index.css'
import { TinymceEditor } from '@belvoly-vue-aioa/tinymce'
import { TimePicker, DatePicker, Radio, Checkbox, SelectCascader, SelectComponent } from '../common'
import { Bus } from '../../common/bus'
import { IasService } from '../../services'
@Component({
    components: {
        TinymceEditor,
        SelectComponent,
        SelectCascader,
        Checkbox,
        Radio,
        //UploadFile,
        DatePicker,
        TimePicker
    }
})
export default class ChoosePeopleQuery extends Vue {
    @Prop() propertyData: Record<string, any>
    // @Prop() entity: Record<string, any>
    @Prop() chooseTableColumn: Array<Record<string, any>>
    labelWidth = ''
    formProperty = []
    searchBthList = []
    isAdvanceSearchShow = false
    advanceSearchBtns = []
    myLoading = null
    loadingTextArr = []
    loadingText = ''
    loadingBackground = null
    dateRangeProps = []
    cascaderProps = []
    checkboxProps = []
    tinymceImageUploadUrl = ''
    searchContent = {}
    //查询条件
    condition = {}
    //选择的table行
    myChooseTableColumn = []
    @Watch('propertyData', { immediate: true })
    watchPropertyData(val) {
        if (val) {
            //左侧label的宽度
            if (val.advanceSearchLable) this.labelWidth = val.advanceSearchLable
            //简单搜索框相关配置
            if (val.searchContent) this.searchContent = val.searchContent
            //搜索右侧按钮
            if (val.searchBtns) {
                this.searchBthList = val.searchBtns.filter(item => {
                    return item.visible == true
                })
            }
            //搜索的各种属性设置
            if (val.advanceSearchContent && val.advanceSearchContent.length > 0) {
                this.formProperty = val.advanceSearchContent.filter(item => {
                    return item.visible == true
                })
                //所有的日期时间段配置节点
                this.dateRangeProps = this.formProperty.filter(item => {
                    return (item.category == 'date' || item.category == 'time') && (item.basic.type == 'daterange' || item.basic.type == 'datetimerange' || item.basic.type == 'datetimerange')
                })
                //所有的级联下拉框配置节点
                this.cascaderProps = this.formProperty.filter(item => {
                    return item.category == 'cascader'
                })
                //所有checkbox的配置节点
                this.checkboxProps = this.formProperty.filter(item => {
                    return item.category == 'checkbox'
                })
                //处理radio、checkbox、select的数据源
                this.formProperty.forEach(item => {
                    const dataSource = item.dataSource
                    if (dataSource) {
                        if (!dataSource.dataList || dataSource.dataList.length == 0) {
                            //从数据字典获取
                            if (dataSource.from == 'dictionary' && dataSource.code && dataSource.code != '') {
                                this.getDictionaryList(dataSource.code, callback => {
                                    this.$set(dataSource, 'dataList', callback)
                                })
                            }
                        }
                    }
                })
            }
            //按钮
            if (val.advanceSearchBtns) {
                this.advanceSearchBtns = val.advanceSearchBtns.filter(item => {
                    return item.visible == true
                })
            }

            //loading文字
            if (val.loadingText) this.loadingTextArr = val.loadingText
            if (val.loadingBackground) this.loadingBackground = val.loadingBackground
        }
    }

    async getDictionaryList(code, callback) {
        const { success, data } = await IasService.getDictionary(code)
        if (success) {
            callback(data)
        } else callback
    }
    @Watch('chooseTableColumn', { immediate: true })
    watchChooseTableColumn(val) {
        this.myChooseTableColumn = val || []
    }

    @Watch('condition', { immediate: true, deep: true })
    watchCondition(val) {
        //时间range将开始结束时间分开存储，存在startProp和endProp中
        this.dateRangeProps.forEach(item => {
            if (val[item.prop]) {
                //根据dateRange控件的获取值，来拆分start字段和end字段的赋值
                this.$set(val, item.startProp, val[item.prop][0])
                this.$set(val, item.endProp, val[item.prop][1])
            }
            if (!val[item.prop] && val[item.startProp] && val[item.endProp]) {
                //初始化range值
                this.$set(val, item.prop, [JSON.parse(JSON.stringify(val[item.startProp])), JSON.parse(JSON.stringify(val[item.endProp]))])
            }
        })

        //级联下拉框把几级都放在一个字段中返回，初始化的时候分为一个数组，用seperator拆分
        this.cascaderProps.forEach(item => {
            if (val[item.model]) {
                //把数组合并为一个字符串
                this.$set(val, item.prop, val[item.model].join(item.basic.separator))
            } else {
                if (val[item.prop]) {
                    this.$set(val, item.model, val[item.prop].split(item.basic.separator))
                } else this.$set(val, item.model, [])
            }
        })

        //多选框初始化的时候分为一个数组，用separator拆分，赋值的时候将数组拼接成字符串
        this.checkboxProps.forEach(item => {
            if (val[item.model]) {
                this.$set(val, item.prop, val[item.model].join(item.separator))
            } else {
                if (val[item.prop]) this.$set(val, item.model, val[item.prop].split(item.separator))
            }
        })
    }

    handleSearchMethod(methodName) {
        if (methodName == 'handleReset') {
            //重置
            this.condition = {}
        }
        Bus.emit(methodName, this.condition, res => {
            const { success, data } = res
            if (success) Bus.emit('setQueryTableResult', data)
        })
        //传给pageList分页查询condition
        this.$emit('setCondition', this.condition)
    }
    isShowAdvanceSearchClick() {
        this.isAdvanceSearchShow = !this.isAdvanceSearchShow
    }
    //搜索右侧按钮
    handleOperateMethod(methodName) {
        //批量删除
        Bus.emit(methodName, this.myChooseTableColumn)
    }
}
</script>
