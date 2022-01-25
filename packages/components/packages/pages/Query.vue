<template>
    <div class="query">
        <div class="search clearfix" v-if="propertyData.isSearchShow">
            <div v-if="isShowSearchContentLabel" :style="propertyData.searchContentLabel.style" class="searchLabel float-l">
                <span>{{ propertyData.searchContentLabel.text }}</span>
            </div>
            <div class="searchLeft float-l" v-if="isSearchContentShow">
                <el-input v-model="condition[searchContent.prop]" :placeholder="searchContent.placeholder"></el-input>
                <p class="searchBth bg-com-color colorF font15" @click="handleSearchMethod(searchContent.handle)">搜索</p>
                <span class="com-color font14" style="cursor: pointer;" v-if="propertyData.isAdvanceSearchShow" @click="isShowAdvanceSearchClick">高级搜索</span>

                <slot name="querySlot"></slot>
            </div>
            <div class="searchBtns float-r">
                <slot name="queryBtnLeftSlot"></slot>
                <el-button v-for="(bth, index) of searchBthList" :key="`search${index}`" :type="bth.type" size="mini" @click="handleOperateMethod(bth.handle)">{{ bth.label }}</el-button>
                <slot name="queryBtnRightSlot"></slot>
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
                        <el-form-item
                            :label="item.label"
                            :prop="item.category == 'cascader' || item.category == 'checkbox' ? item.model : item.prop"
                            :label-width="item.labelWidth"
                            :style="item.style"
                        >
                            <!--label的slot-->
                            <template slot="label" v-if="item.labelSlotName">
                                <slot :name="item.labelSlotName"></slot>
                            </template>
                            <template v-if="item.category == 'input'">
                                <!-- <el-input v-model="condition[item.prop]" :type="item.basic.type" :placeholder="item.basic.placeholder" :rows="item.basic.rows"> </el-input> -->
                                <template v-if="item.category == 'input'">
                                    <input-component v-model="condition[item.prop]" :basic="item.basic" :prop="item.prop" :slotValue="computedSlotValue(condition, item.basic.slot)"></input-component>
                                </template>
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
                                <select-component
                                    :datasource="item.dataSource"
                                    :options="item.options"
                                    v-model="condition[item.prop]"
                                    :basic="item.basic"
                                    :prop="item.prop"
                                    @setCurrentOpProp="setCurrentOpProp"
                                ></select-component>
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
                            <!--插槽-->
                            <template v-if="item.category == 'slot'">
                                <slot :name="item.slotName"></slot>
                            </template>
                            <!-- <template v-if="item.category == 'file'">
                                <upload-file :id="id" :refTableName="item.refTableName"></upload-file>
                            </template> -->
                            <!-- 按钮 -->
                            <template v-if="item.category == 'button'">
                                <el-button :type="item.basic.type" :size="item.basic.size" @click="btnClick(item.handle)" :style="item.basic.style">{{ item.basic.label }}</el-button>
                            </template>
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
import IasService from '../../services/IasService'
import { Vue, Watch, Component, Prop } from 'vue-property-decorator'
import 'element-ui/lib/theme-chalk/index.css'
//import { TinymceEditor } from '@belvoly-vue-aioa/tinymce'
import { TimePicker, DatePicker, Radio, Checkbox, SelectCascader, SelectComponent, Editor as TinymceEditor, InputComponent } from '../common'
import { Bus } from '../../common/bus'
@Component({
    components: {
        TinymceEditor,
        SelectComponent,
        SelectCascader,
        Checkbox,
        Radio,
        //UploadFile,
        DatePicker,
        TimePicker,
        InputComponent
    }
})
export default class Query extends Vue {
    @Prop() propertyData: Record<string, any>
    // @Prop() entity: Record<string, any>
    //@Prop() chooseTableColumn: Array<Record<string, any>>
    labelWidth = ''
    formProperty = []
    searchBthList = []
    isSearchContentShow = true
    isAdvanceSearchShow = false
    advanceSearchBtns = []
    myLoading = null
    loadingTextArr = []
    loadingText = ''
    loadingBackground = null
    dateRangeProps = []
    cascaderProps = []
    checkboxProps = []
    selectPropsHasHandle = []
    tinymceImageUploadUrl = ''
    searchContent = {}
    isShowSearchContentLabel = false
    condition = {}
    currentOpProp = ''
    //查询条件
    //选择的table行
    myChooseTableColumn = []
    created() {
        //从业务页面过来控制高级检索，选人等控件的回显设置
        Bus.on('setCondition', this.setCondition)
        //从tab的slot中传过来的ChooseTableColumn
        Bus.on('setChooseTableColumn', this.setChooseTableColumn)
    }
    destroyed() {
        Bus.off('setCondition', this.setCondition)
        Bus.off('setChooseTableColumn', this.setChooseTableColumn)
    }
    setCondition(prop, val) {
        console.log('setCondition', val)
        this.$set(this.condition, prop, val)
    }
    setChooseTableColumn(val) {
        this.myChooseTableColumn = JSON.parse(JSON.stringify(val))
    }
    @Watch('propertyData', { immediate: true, deep: true })
    watchPropertyData(val) {
        //console.log(val)
        if (val) {
            //左侧label的宽度
            if (val.advanceSearchLable) this.labelWidth = val.advanceSearchLable
            //如果没有配置搜索框以及搜索框右侧按钮是否可见，默认可见
            if (val.searchContent && val.searchContent.visible != null) this.isSearchContentShow = val.searchContent.visible
            //如果没有配置advanceSearchDisplayStatus，默认不可见
            if (val.advanceSearchDisplayStatus && val.isAdvanceSearchShow) this.isAdvanceSearchShow = val.advanceSearchDisplayStatus
            //如果没有配置SearchContentLabel，默认不可见
            if (val.searchContentLabel && val.searchContentLabel.visible != null) this.isShowSearchContentLabel = val.searchContentLabel.visible
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
                //所有select并且有handle的配置节点
                this.selectPropsHasHandle = this.formProperty.filter(item => {
                    return item.category == 'select' && item.handle
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
        //console.log('condition', val)
        //时间range将开始结束时间分开存储，存在startProp和endProp中
        this.dateRangeProps.forEach(item => {
            //console.log('val[item.prop]', val[item.prop])
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

        //select如果定义了handle那么emit该方法出去
        this.selectPropsHasHandle.forEach(item => {
            this.$nextTick(() => {
                if (this.currentOpProp == item.prop) {
                    this.$emit(item.handle, val[item.prop])
                    Bus.emit(item.handle, val[item.prop])
                }
            })
        })
    }

    handleSearchMethod(methodName) {
        if (methodName == 'handleReset') {
            //重置
            // Object.keys(this.condition).forEach(keys => {
            //     this.$set(this.condition, keys, '')
            // })
            this.condition = {}
        }
        Bus.emit(methodName, this.condition)
    }
    isShowAdvanceSearchClick() {
        this.isAdvanceSearchShow = !this.isAdvanceSearchShow
    }
    //搜索右侧按钮
    handleOperateMethod(methodName) {
        //批量删除
        Bus.emit(methodName, this.myChooseTableColumn)
    }
    btnClick(methodName) {
        Bus.emit(methodName)
    }
    computedSlotValue(entity, slotList) {
        const slotPropValueList = []
        if (slotList && slotList.length > 0) {
            //console.log('computedSlotValue', entity, slotList)

            slotList.map(slot => {
                if (entity[slot.slotProp]) slotPropValueList.push(entity[slot.slotProp])
            })
            //console.log('slotPropValueList', slotPropValueList)
        }
        return slotPropValueList
    }

    setCurrentOpProp(prop) {
        this.currentOpProp = prop
        //console.log('setCurrentOpProp', prop)
    }
}
</script>
