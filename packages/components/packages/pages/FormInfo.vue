<template>
    <div class="infoBox">
        <el-form
            ref="form"
            :model="myEntity"
            :label-width="labelWidth"
            :rules="rules"
            v-loading="myLoading"
            :element-loading-text="loadingText"
            :element-loading-background="loadingBackground"
            element-loading-spinner="el-icon-loading"
        >
            <el-row>
                <el-col :span="item.col ? item.col : 24" :key="index" v-for="(item, index) in formProperty">
                    <el-form-item
                        :label="getShowLabel(item.showLabel, item.label)"
                        :prop="item.category == 'cascader' || item.category == 'checkbox' ? item.model : item.prop"
                        :label-width="item.labelWidth"
                        :style="item.style"
                    >
                        <!--label的slot-->
                        <span slot="label" v-if="item.labelSlotName">
                            <slot :name="item.labelSlotName"></slot>
                        </span>
                        <template v-if="item.category == 'area'">
                            <span class="areaLine"></span>
                            <span class="areaName">{{ item.label }}</span>
                        </template>
                        <template v-if="item.category == 'input'">
                            <input-component
                                v-model="entity[item.prop]"
                                :basic="item.basic"
                                :readOnly="computedReadOnly(item.readOnly)"
                                :prop="item.prop"
                                :slotValue="computedSlotValue(entity, item.basic.slot)"
                                @setCurrentOpProp="setCurrentOpProp"
                            ></input-component>
                        </template>
                        <template v-if="item.category == 'number'">
                            <input-number v-model="entity[item.prop]" :basic="item.basic" :readOnly="computedReadOnly(item.readOnly)" :prop="item.prop" @setCurrentOpProp="setCurrentOpProp">
                            </input-number>
                        </template>
                        <template v-if="item.category == 'label'">
                            <div :style="item.style" :class="item.class" v-html="entity[item.prop] ? entity[item.prop] : item.text"></div>
                        </template>
                        <!-- 日期 -->
                        <template v-if="item.category == 'date'">
                            <date-picker
                                v-model="entity[item.prop]"
                                :basic="item.basic"
                                :readOnly="computedReadOnly(item.readOnly)"
                                :prop="item.prop"
                                @setCurrentOpProp="setCurrentOpProp"
                            ></date-picker>
                        </template>
                        <!-- 时间 -->
                        <template v-if="item.category == 'time'">
                            <time-picker v-model="entity[item.prop]" :basic="item.basic" :readOnly="computedReadOnly(item.readOnly)" :prop="item.prop" @setCurrentOpProp="setCurrentOpProp">
                            </time-picker>
                        </template>
                        <!-- 单个下拉框 -->
                        <template v-if="item.category == 'select'">
                            <select-component
                                :datasource="item.dataSource"
                                :options="item.options"
                                v-model="entity[item.prop]"
                                :prop="item.prop"
                                :basic="item.basic"
                                :readOnly="computedReadOnly(item.readOnly)"
                                @setCurrentOpProp="setCurrentOpProp"
                            ></select-component>
                        </template>
                        <!--级联下拉框 -->
                        <template v-if="item.category == 'cascader'">
                            <select-cascader
                                :code="item.code"
                                v-model="entity[item.model]"
                                :basic="item.basic"
                                :datasource="item.dataSource"
                                :options="item.options"
                                :readOnly="computedReadOnly(item.readOnly)"
                                :prop="item.prop"
                                @setCurrentOpProp="setCurrentOpProp"
                            ></select-cascader>
                        </template>
                        <!-- 多选框 -->
                        <template v-if="item.category == 'checkbox'">
                            <checkbox
                                v-model="entity[item.model]"
                                :datasource="item.dataSource.dataList"
                                :separator="item.separator"
                                :options="item.options"
                                :prop="item.prop"
                                :disabled="item.disabled"
                                @setCurrentOpProp="setCurrentOpProp"
                                :readOnly="computedReadOnly(item.readOnly)"
                            ></checkbox>
                        </template>
                        <!-- 单选框 -->
                        <template v-if="item.category == 'radio'">
                            <radio
                                class="radioChoose"
                                :datasource="item.dataSource.dataList"
                                :options="item.options"
                                :prop="item.prop"
                                :disabled="item.disabled"
                                @setCurrentOpProp="setCurrentOpProp"
                                v-model="entity[item.prop]"
                                :readOnly="computedReadOnly(item.readOnly)"
                            ></radio>
                        </template>
                        <!-- 开关 -->
                        <template v-if="item.category == 'switch'">
                            <switch-component :basic="item.basic" v-model="entity[item.prop]" :readOnly="computedReadOnly(item.readOnly)" :prop="item.prop" @setCurrentOpProp="setCurrentOpProp">
                            </switch-component>
                        </template>
                        <!--富文本编辑器-->
                        <template v-if="item.category == 'editor'">
                            <tinymce-editor
                                v-if="!computedReadOnly(item.readOnly)"
                                :tinymceHtml="entity[item.prop] != 'undefined' ? entity[item.prop] : ''"
                                v-model="entity[item.prop]"
                                class="resize-none"
                                :imageUploadUrl="tinymceImageUploadUrl"
                            ></tinymce-editor>
                            <div v-else v-html="entity[item.prop]"></div>
                        </template>
                        <!-- 选择机关人员（废弃）-->
                        <!-- <template v-if="item.category == 'choose'">
                            <choose-people v-model="entity[item.prop]" :options="item.basic" @setChooseUserValue="setChooseUserValue" :prop="item.prop"></choose-people>
                        </template> -->
                        <!--附件-->
                        <template v-if="item.category == 'file'">
                            <upload-file
                                :id="myId"
                                :refTableName="item.refTableName"
                                :prop="item.prop"
                                @successHandler="attachSuccessHandler"
                                :readOnly="computedReadOnly(item.readOnly)"
                                :fileList="entity[item.prop + '_fileList']"
                            ></upload-file>
                        </template>
                        <!--插槽-->
                        <template v-if="item.category == 'slot'">
                            <slot :name="item.slotName"></slot>
                        </template>
                        <!-- 按钮 -->
                        <template v-if="item.category == 'button'">
                            <el-button v-if="!computedReadOnly(item.readOnly)" :type="item.basic.type" :size="item.basic.size" @click="btnClick(item.handle)" :style="item.basic.style">{{
                                item.basic.label
                            }}</el-button>
                        </template>
                        <!--头像-->
                        <template v-if="item.category == 'avatar'">
                            <avatar :item="item" @successHandler="avatarSuccessHandler" :value="entity[item.prop]" :style="item.style" :readOnly="computedReadOnly(item.readOnly)"></avatar>
                        </template>
                        <!-- <template v-if="item.category == 'button'">
                                <span v-if="item.basic.button.placeholder" style="color:red">{{ item.basic.button.placeholder }}</span>
                            </template> -->
                        <template v-if="item.category == 'span'">
                            <div :style="item.style"></div>
                        </template>
                        <template v-if="item.category == 'nodeplan'">
                            <node-plan :prop="item.prop" :tableData="entity[item.prop]" @updateNodePlan="updateNodePlan" :readOnly="computedReadOnly(item.readOnly)"></node-plan>
                        </template>
                    </el-form-item>
                    <div style="clear:both;" :key="`clearDiv${index}`" v-if="item.category == 'avatar'"></div>
                </el-col>
            </el-row>
            <el-row v-if="operatorBtns && operatorBtns.length > 0">
                <el-col :span="24">
                    <el-form-item>
                        <span v-for="(btn, index) in operatorBtns" :key="index" style="margin: 0 5px">
                            <button :class="`el-button el-button--${btn.class}`" type="button" @click="handleMethod(btn.handle, btn.validate)">
                                {{ btn.label }}
                            </button>
                        </span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script lang="ts">
import IasService from '../../services/IasService'
import { Vue, Watch, Component, Prop } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import 'element-ui/lib/theme-chalk/index.css'
import { Message } from 'element-ui'
//import { TinymceEditor } from '@belvoly-vue-aioa/tinymce'
import {
    TimePicker,
    DatePicker,
    Radio,
    Checkbox,
    SelectCascader,
    SelectComponent,
    Avatar,
    InputComponent,
    SwitchComponent,
    InputNumber,
    UploadFile,
    NodePlan,
    Editor as TinymceEditor
} from '../common'
import { Bus } from '../../common/bus'
import SlotList from '@/apps/demo/views/demo/DemoListSlot.vue'
@Component({
    components: {
        TinymceEditor,
        SelectComponent,
        SelectCascader,
        Checkbox,
        Radio,
        UploadFile,
        DatePicker,
        TimePicker,
        Avatar,
        InputComponent,
        SwitchComponent,
        NodePlan,
        InputNumber
    }
})
export default class FormInfo extends Vue {
    @Prop() id: string
    @Prop() propertyData: Record<string, any>
    @Prop() entity: Record<string, any>
    @Prop() loading: boolean
    @Prop() readOnly: boolean
    channel = ''
    labelWidth = ''
    formProperty = []
    rules = {}
    operatorBtns = []
    myLoading = null
    loadingTextArr = []
    loadingText = ''
    loadingBackground = null
    myReadOnly = false
    dateRangeProps = []
    cascaderProps = []
    checkboxProps = []
    selectPropsHasHandle = []
    radioPropsHasHandle = []
    tinymceImageUploadUrl = ''
    currentOpProp = ''
    myEntity = {}
    myId = ''
    //按钮点击次数，默认只能点击一次
    btnClickNum = 0
    @Watch('id', { immediate: true })
    watchId(val) {
        if (val) {
            this.myId = val
        }
    }
    @Watch('propertyData', { immediate: true, deep: true })
    watchPropertyData(val) {
        //console.log('propertyData', val, val.form)
        if (val) {
            //左侧label的宽度
            if (val.labelWidth) this.labelWidth = val.labelWidth

            //form的各种属性设置
            if (val.form && val.form.length > 0) {
                this.formProperty = val.form.filter(item => {
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
                //所有select并且有handle的配置节点
                this.selectPropsHasHandle = this.formProperty.filter(item => {
                    return item.category == 'select' && item.handle
                })
                //所有radio并且有handle的配置节点
                this.radioPropsHasHandle = this.formProperty.filter(item => {
                    return item.category == 'radio' && item.handle
                })
                this.formProperty.forEach(item => {
                    //处理radio、checkbox、select的数据源
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
            //表单验证
            this.getRules()
            //按钮
            if (val.operatorBtns) {
                this.operatorBtns = val.operatorBtns.filter(item => {
                    return item.visible == true
                })
            }
            //loading文字
            if (val.loadingText) this.loadingTextArr = val.loadingText
            if (val.loadingBackground) this.loadingBackground = val.loadingBackground
            this.changeEntity(this.myEntity)
        }
    }

    @Watch('readOnly', { immediate: true })
    WatchReadOnly(val) {
        if (val) this.myReadOnly = val
        //console.log('watchReadOnly', this.myReadOnly)
    }

    computedReadOnly(val) {
        if (val) {
            return val
        } else {
            return this.myReadOnly
        }
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

    getShowLabel(showLabel, label) {
        if (showLabel != null && !showLabel) return ''
        else return label
    }

    async getDictionaryList(code, callback) {
        const { success, data } = await IasService.getDictionary(code)
        if (success) {
            callback(data)
        } else callback
    }

    @Watch('loading', { immediate: true })
    watchLoading(val) {
        if (val != null) {
            this.myLoading = true
            this.loadingText = this.loadingTextArr[val]
        } else {
            this.myLoading = false
        }
    }

    @Watch('entity', { immediate: true, deep: true })
    watchEntity(val) {
        if (val) {
            this.myEntity = val
            this.changeEntity(this.myEntity)
        }
    }
    // @Watch('id')
    // wathcEntityId(val) {
    //     if (val) {
    //         console.log('watchid:', val)
    //         this.myEntity = val
    //         this.changeEntity(this.myEntity)
    //     }
    // }

    changeEntity(val) {
        //console.log('changeEntity', val)
        //时间range将开始结束时间分开存储，存在startProp和endProp中
        //console.log('entity', val, this.propertyData)
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

        this.checkboxProps.forEach(item => {
            //多选框初始化的时候分为一个数组，用separator拆分，赋值的时候将数组拼接成字符串
            if (val[item.model]) {
                this.$set(val, item.prop, val[item.model].join(item.separator))
            } else {
                if (val[item.prop]) this.$set(val, item.model, val[item.prop].split(item.separator))
            }
            //如果定义了handle那么emit该方法出去
            //只有当前操作的prop才能emit出去
            this.$nextTick(() => {
                if (item.handle && this.currentOpProp == item.prop) {
                    this.$emit(item.handle, val[item.prop], val[item.model])
                    Bus.emit(item.handle, val[item.prop], val[item.model])
                }
            })
        })

        //select如果定义了handle那么emit该方法出去
        this.selectPropsHasHandle.forEach(item => {
            //console.log('selectPropsHasHandle', this.selectPropsHasHandle.length, item.handle, item, val[item.prop], val)
            //只有当前操作的prop才能emit出去

            this.$nextTick(() => {
                if (this.currentOpProp == item.prop) {
                    this.$emit(item.handle, val[item.prop])
                    Bus.emit(item.handle, val[item.prop])
                }
            })
        })
        //radio如果定义了handle那么emit该方法出去
        this.radioPropsHasHandle.forEach(item => {
            //只有当前操作的prop才能emit出去

            this.$nextTick(() => {
                if (this.currentOpProp == item.prop) {
                    this.$emit(item.handle, val[item.prop])
                    Bus.emit(item.handle, val[item.prop])
                }
            })
        })
    }
    setCurrentOpProp(prop) {
        this.currentOpProp = prop
        //console.log('setCurrentOpProp', prop)
    }
    async handleMethod(methodName, validateValue) {
        if (validateValue) {
            const isValid = await (this.$refs.form as ElForm).validate().tryResolve(false)
            if (!isValid) {
                Message.error('数据尚不准确，请检查后再提交')
                return
            }
        }
        // this.btnClickNum++
        // if (this.btnClickNum < 2) this.$emit(methodName)
        this.$emit(methodName)
    }

    setChooseUserValue(prop, val) {
        this.$set(this.entity, prop, JSON.stringify(val))
    }
    getRules() {
        if (this.propertyData && this.propertyData.form) {
            this.propertyData.form.forEach(element => {
                if (element.rules) {
                    //如果rules是数组
                    // let isRequired = false
                    // if (element.rules.length > 0) {
                    //     isRequired =
                    //         element.rules.filter(v => {
                    //             return v.required == 'undefined' || v.required != false
                    //         }).length > 0
                    // }
                    if (element.rules.required || element.rules.length > 0) {
                        if (element.category == 'cascader' || element.category == 'checkbox') {
                            this.$set(this.rules, element.model, element.rules)
                        } else {
                            console.log(element.prop, element.rules, this.rules)
                            this.$set(this.rules, element.prop, element.rules)
                            console.log('thisrules', this.rules)
                        }
                    }
                }
            })
        }
        console.log('gerules', this.rules)
    }
    btnClick(methodName) {
        this.$emit(methodName)
    }
    //获取到附件传入实体中，奉贤人大现在是放在业务表中的attachmentId中
    attachSuccessHandler(files, prop) {
        const { ids, fileList } = files
        this.$set(this.entity, prop, ids.join(','))
        //把整个files放入prop_fileList中,如果select导致entity更新，导致重新加载附件组件，那么附件组件中会看是否存在fileList属性，存在的话就不会去重新请求getAttachments
        this.$set(this.entity, prop + '_fileList', fileList)
        //console.log(files, this.entity[prop])
    }

    //获取图片信息传到实体中，奉贤人大现在是放在memPhoto中
    avatarSuccessHandler(file, prop) {
        //console.log('avatarSuccessHandler', file)
        this.$set(this.entity, prop, file.id)
    }

    //获取nodeplan放到实体中
    updateNodePlan(list, prop) {
        this.$set(this.entity, prop, list)
    }
}
</script>
