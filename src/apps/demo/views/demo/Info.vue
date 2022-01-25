<template>
    <page-dialog-layout minHeight="400px" ref="page">
        <div style="margin:15px">
            <form-info
                :propertyData="propertyData"
                :entity="entity"
                :id="id"
                :loading="loading"
                :readOnly="false"
                @saveHandler="saveHandler"
                @deleteHandler="deleteHandler"
                @cancelHandler="cancelHandler"
                @disiableNext="disiableNext"
                @changeInputStatus="changeInputStatus"
                @pickOfficeUser="pickOfficeUser"
                @pickTownUser="pickTownUser"
                @pickDept="pickDept"
                @pickMainMeeting="pickMainMeeting"
                @pickCityMember="pickCityMember"
                @pickMember="pickMember"
                @pickContact="pickContact"
            >
                <template #labelSlot> 这是我slot的<span style="color:red">label</span> </template>
                <template #list>
                    <slot-list :uuid="uuid"></slot-list>
                </template>
                <template #list2>
                    <div style="margin-left:-100px;margin-top:-30px;">
                        <div>这种slot的label设为空，并且设置margin-left，根据实际情况调整，并且可以自定义一些其他内容</div>
                        <slot-list></slot-list>
                    </div>
                </template>
                <template #townUserlist v-if="townUsersList && townUsersList.length > 0">
                    <town-member-slot :listData="townUsersList"></town-member-slot>
                </template>
                <template #contactResult v-if="contactPickList && contactPickList.length > 0">
                    <writeable-grid :listData="contactPickList" @handleDelete="deleteContactRow()"></writeable-grid>
                </template>
            </form-info>
            <el-dialog
                v-if="officePickerVisible"
                :visible="officePickerVisible"
                title="选择机关人员"
                custom-class="dialog-position dialog-position-auto dialog-position-auto--nopadding"
                :append-to-body="true"
                width="90%"
                @close="changeDialog(false)"
            >
                <user-picker
                    :options="officeUserPickerDialogProperyData"
                    :oldList="officeUserPickList"
                    @cancelOfficeUser="cancelOfficeUser"
                    :max="1"
                    @errorHandler="officeUserPickerErrorHandler"
                ></user-picker>
            </el-dialog>
            <el-dialog
                v-if="memberPickerVisible"
                :visible="memberPickerVisible"
                title="选择区代表/邀请代表"
                custom-class="dialog-position dialog-position-auto dialog-position-auto--nopadding"
                :append-to-body="true"
                width="90%"
                @close="changeMemberPickerDialog(false)"
            >
                <user-picker
                    :options="memberPickerDialogPropertyData"
                    :oldList="memberPickList"
                    @cancelMember="cancelMember"
                    :max="15"
                    @errorHandler="memberPickerErrorHandler"
                    :reloadTree="reloadTree"
                ></user-picker>
            </el-dialog>
            <el-dialog
                v-if="townUserPickerVisible"
                :visible="townUserPickerVisible"
                title="选择镇代表"
                custom-class="dialog-position dialog-position-auto dialog-position-auto--nopadding"
                :append-to-body="true"
                width="90%"
                @close="changeTownPickerDialog(false)"
            >
                <user-picker :options="townUserPickerDialogPropertyData" :oldList="townUserPickList" @cancelTownUsers="cancelTownUsers"></user-picker>
            </el-dialog>
            <el-dialog
                v-if="cityMemberPickerVisible"
                :visible="cityMemberPickerVisible"
                title="选择市代表"
                custom-class="dialog-position dialog-position-auto dialog-position-auto--nopadding"
                :append-to-body="true"
                width="90%"
                @close="changeCityPickerDialog(false)"
            >
                <user-picker :options="cityMemberPickerDialogPropertyData" :oldList="cityMemberPickList" @cancelCityMember="cancelCityMember"></user-picker>
            </el-dialog>
            <el-dialog
                v-if="deptPickerVisible"
                :visible="deptPickerVisible"
                title="选组织"
                custom-class="dialog-position dialog-position-auto dialog-position-auto--nopadding"
                :append-to-body="true"
                width="60%"
                @close="changeDeptPickerDialog(false)"
            >
                <dept-picker :options="deptPickerDialogPropertyData" :oldList="deptPickList" @cancelDept="cancelDept"></dept-picker>
            </el-dialog>
            <el-dialog
                v-if="mainMeetingPickerVisible"
                :visible="mainMeetingPickerVisible"
                title="主办会办单位"
                custom-class="dialog-position dialog-position-auto dialog-position-auto--nopadding"
                :append-to-body="true"
                width="60%"
                @close="changeMainMeetingPickerDialog(false)"
            >
                <dept-picker :options="mainMeetingPickerDialogPropertyData" :oldList="mainMeetingPickList" @cancelMainMeeting="cancelMainMeeting"></dept-picker>
            </el-dialog>
            <el-dialog
                v-if="contackPickerVisible"
                :visible="contackPickerVisible"
                title="联络人"
                custom-class="dialog-position dialog-position-auto dialog-position-auto--nopadding"
                :append-to-body="true"
                width="90%"
                @close="changeContackPickerDialog(false)"
            >
                <user-picker :options="contactPropertyData" :oldList="contactPickList" @cancelContact="cancelContact"></user-picker>
            </el-dialog>
        </div>
    </page-dialog-layout>
</template>
<script lang="ts">
import { BaseVue, IasService } from '@/common'
import { Component, Prop } from 'vue-property-decorator'
import { PageDialogLayout } from '@/components'
import FormInfo from '../../../../../packages/components/packages/pages/FormInfo.vue'
import SlotList from './DemoListSlot.vue'
import UserPicker from '../../../../../packages/components/packages/dialog/UserPicker.vue'
import TownMemberSlot from './TownMemberSlot.vue'
import DeptPicker from '../../../../../packages/components/packages/dialog/DeptPicker.vue'

import WriteableGrid from './WriteableGrid.vue'
import { Message } from 'element-ui'
import { Bus } from '../../../../../packages/components/common/bus'
// MainMeeting
@Component({
    components: {
        PageDialogLayout,
        FormInfo,
        SlotList,
        TownMemberSlot,
        UserPicker,
        DeptPicker,
        WriteableGrid
    }
})
export default class Info extends BaseVue {
    @Prop() id: string
    propertyData = { form: [] }
    memberPickerDialogPropertyData = {}
    townUserPickerDialogPropertyData = {}
    deptPickerDialogPropertyData = {}
    // mainmeeting
    mainMeetingPickerDialogPropertyData = {}
    cityMemberPickerDialogPropertyData = {}
    officeUserPickerDialogProperyData = {}
    contactPropertyData = {}
    uuid = '123456789abcde3'
    townUsersList = []
    entity = { demo_chooseTownUsers: '' }
    officePickerVisible = false
    townUserPickerVisible = false
    deptPickerVisible = false
    mainMeetingPickerVisible = false
    cityMemberPickerVisible = false
    memberPickerVisible = false
    contackPickerVisible = false
    editEntity = {
        demo_input: '2234',
        slotValue: '0502',
        demo_input_prepred: 'www.beyondbit.com',
        demo_input_append: 'www.baidu.com',
        demo_input2:
            '区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会区人大常委会组织活动-参加区人代会',
        demo_date: '2021-04-01',
        demo_datetime: '2021-04-02 16:52:22',
        demo_dateRangeStart: '2021-04-01',
        demo_dateRangeEnd: '2021-05-23',
        demo_dateTimeRangeStart: '2021-04-02 09:30:00',
        demo_dateTimeRangeEnd: '2021-04-28 17:30:30',
        demo_timeStart: '9:00:00',
        demo_timeEnd: '17:30:00',
        demo_radio: 'All',
        demo_radio2: 'UNPC_DutyType_StandComm',
        demo_radio3: '2',
        demo_radio4: 0,
        demo_switch: 1,
        demo_switch2: 1,
        demo_select: '2',
        demo_select2: '办理态度',
        demo_cascader: '区人大常委会组织活动-参加区人代会',
        demo_checkbox: '0,1',
        demo_checkbox2: '2,3',
        demo_chooseTownUsers: '[{ "id": 20, "memName": "老王", "mobile": "xxxxxxxxxxx" }]',
        demo_chooseCityMember: '[]',
        demo_officeUser: [
            {
                id: '61',
                name: '张群欢',
                userGuid: '2333d06d-fcd8-4b95-a78e-03c9d21aa42b',
                mobilePhone: '18018826290'
            }
        ],
        demo_dept: [
            { name: '办公室', code: 'UNPC_ZZDW_RD_CWHBGS' },
            { name: '代表工作室', code: 'UNPC_ZZDW_RD_CWHDBGZS' },
            { name: '法制委员会', code: 'UNPC_ZZDW_RD_FZW' },
            { name: '财经委员会', code: 'UNPC_ZZDW_RD_CJW' },
            { name: '海湾镇人大', code: 'UNPC_ZZDW_JZ_HWZ' }
        ],
        demo_mainMeeting: [
            {
                name: '区纪委（监委）',
                code: 'QJWJW'
            },
            {
                name: '区委组织部',
                code: 'QWZZB'
            }
        ],
        demo_chooseMember: '[]',
        memPhoto: '7d186e37-8c1c-4016-abd4-05ec5f690734',
        content: `<div style='color:red'>123123123</div>`,
        demo_label: '-----这里是entity里面的值-----',
        demo_number: 88,
        nodeplanList: [
            {
                date: ['2021-06-30T16:00:00.000Z', '2022-08-31T16:00:00.000Z'],
                content: '2222'
            }
        ],
        demo_select_multiple: ['1', '2']
    }
    townUserPickList = []
    cityMemberPickList = []
    memberPickList = []
    deptPickList = []
    // mainMeeting
    mainMeetingPickList = []
    officeUserPickList = []
    contactPickList = []
    loading = null
    isEdit = false
    //重新加载选人树
    reloadTree = true

    getPropertyDataJson() {
        IasService.getDemoJsonProperty('demo/Info.json', res => {
            this.propertyData = res
        })
    }
    getMemberPickerPropertyDataJson() {
        IasService.getDemoJsonProperty('picker/MemberPicker.json', res => {
            this.memberPickerDialogPropertyData = res
        })
    }
    //镇代表的json
    getTownUserPickerPropertyDataJson() {
        IasService.getDemoJsonProperty('picker/TownMemberPicker.json', res => {
            this.townUserPickerDialogPropertyData = res
        })
    }
    //选主办会办单位json
    getMainMeetingPickerPropertyDataJson() {
        IasService.getDemoJsonProperty('picker/MainMeetingPicker.json', res => {
            this.mainMeetingPickerDialogPropertyData = res
        })
    }
    //选组织json
    getDeptPickerPropertyDataJson() {
        IasService.getDemoJsonProperty('picker/DeptPicker.json', res => {
            this.deptPickerDialogPropertyData = res
        })
    }
    //市代表json
    getCityMemberPickerPropertyDataJson() {
        IasService.getDemoJsonProperty('picker/CityMemberPicker.json', res => {
            this.cityMemberPickerDialogPropertyData = res
        })
    }

    //机关人员json
    getOfficePickerPropertyDataJson() {
        IasService.getDemoJsonProperty('picker/OfficeUserPicker.json', res => {
            this.officeUserPickerDialogProperyData = res
        })
    }

    //联系人
    getContactPropertyDataJson() {
        IasService.getDemoJsonProperty('picker/ContactPicker.json', res => {
            //需要根据主办会办单位来添加左侧tree节点数据
            const depts = [
                { code: 'FX_FGW', name: '发改委' },
                { code: 'FX_JJW', name: '建交委' }
            ]
            const dataList = []
            depts.forEach((item, index) => {
                const dataOne = { id: index, label: item.name, disabled: false, from: 'json', searchParam: 'unitCode', value: item.code, isLeaf: true }
                dataList.push(dataOne)
            })
            res.tree.dataSource.dataList = dataList
            this.contactPropertyData = res
        })
    }

    //机关人员失败事件//设置只能选择一个人
    officeUserPickerErrorHandler() {
        Message.error('只能选择一个人')
    }

    memberPickerErrorHandler() {
        Message.error('最多选15位')
    }

    created() {
        Bus.on('queryOfficeUsers', this.queryOfficeUser)
        Bus.on('saveOfficeUsers', this.saveOfficeUsers)

        Bus.on('queryTownUsers', this.queryTownUsers)
        Bus.on('saveTownUsers', this.saveTownUsers)

        Bus.on('queryCityMember', this.queryCityMember)
        Bus.on('saveCityMember', this.saveCityMember)

        Bus.on('queryMember', this.queryMember)
        Bus.on('saveMember', this.saveMember)

        Bus.on('saveDept', this.saveDept)

        Bus.on('saveMainMeeting', this.saveMainMeeting)
        Bus.on('queryContact', this.queryContact)
        Bus.on('saveContact', this.saveContact)
        Bus.on('handleDeleteContact', this.handleDeleteContact)

        //保存选人分组
        Bus.on('saveMemGroup', this.saveMemGroup)
        //删除选人分组
        Bus.on('delMemGroup', this.delMemGroup)
        this.getPropertyDataJson()
        this.getMemberPickerPropertyDataJson()
        this.getTownUserPickerPropertyDataJson()
        this.getDeptPickerPropertyDataJson()
        this.getMainMeetingPickerPropertyDataJson()
        this.getCityMemberPickerPropertyDataJson()
        this.getOfficePickerPropertyDataJson()
        this.getContactPropertyDataJson()
    }
    destroyed() {
        Bus.off('queryOfficeUsers', this.queryOfficeUser)
        Bus.off('saveOfficeUsers', this.saveOfficeUsers)

        Bus.off('queryTownUsers', this.queryTownUsers)
        Bus.off('saveTownUsers', this.saveTownUsers)

        Bus.off('queryCityMember', this.queryCityMember)
        Bus.off('saveCityMember', this.saveCityMember)

        Bus.off('queryMember', this.queryMember)
        Bus.off('saveMember', this.saveMember)

        Bus.off('saveDept', this.saveDept)

        Bus.off('saveMainMeeting', this.saveMainMeeting)
        Bus.off('queryContact', this.queryContact)
        Bus.off('saveContact', this.saveContact)
        Bus.off('handleDeleteContact', this.handleDeleteContact)

        //保存选人分组
        Bus.off('saveMemGroup', this.saveMemGroup)
        //删除选人分组
        Bus.off('delMemGroup', this.delMemGroup)
    }
    //提交按钮的事件
    async saveHandler() {
        this.$set(this.entity, 'contacts', this.contactPickList)
        console.log(this.entity)
        //把userPickList存储到字段demo_userPicker中
        this.$set(this.entity, 'demo_officeUser', JSON.stringify(this.officeUserPickList))
        //把townUserPickList存储到字段demo_chooseTownUsers 中
        this.$set(this.entity, 'demo_chooseTownUsers', JSON.stringify(this.townUserPickList))
        this.$set(this.entity, 'demo_chooseCityMember', JSON.stringify(this.cityMemberPickList))
        this.$set(this.entity, 'demo_chooseMember', JSON.stringify(this.memberPickList))
        this.$set(this.entity, 'demo_dept', this.deptPickList)
        this.$set(this.entity, 'demo_mainMeeting', this.mainMeetingPickList)
        this.loading = 0
        if (!this.isEdit) {
            await this.add()
        } else {
            await this.edit()
        }
        // this.loading = false
    }
    mounted() {
        console.log('id', this.id)
        if (this.id) {
            this.initEdit()
        }
    }
    async initEdit() {
        this.isEdit = true
        this.entity = this.editEntity
        console.log('nodeplanList', this.entity['nodeplanList'], this.entity)
        //回显----主办会办------单位，设置主办会办mainmeetinglist的值，保存的是string，传输的prop为array
        this.$set(
            this.entity,
            'demo_mainMeetingInput',
            this.editEntity.demo_mainMeeting
                .map(item => {
                    return item.name
                })
                .join(',')
        )
        this.mainMeetingPickList = this.editEntity.demo_mainMeeting
        //回显选择组织，设置组织deptlist的值，保存的是string，传输的prop为array
        this.$set(
            this.entity,
            'demo_deptInput',
            this.editEntity.demo_dept
                .map(item => {
                    return item.name
                })
                .join(',')
        )
        this.deptPickList = this.editEntity.demo_dept
        //回显选择镇代表,设置town的input
        this.townUserPickList = JSON.parse(this.editEntity.demo_chooseTownUsers) || []

        this.$set(
            this.entity,
            'demo_chooseTownUsersInput',
            this.townUserPickList
                .map(element => {
                    return element.memName
                })
                .join(',')
        )
        //镇代表下的代表列表slot数据赋值
        this.townUsersList = this.townUserPickList

        //回显选择市代表、市代表input
        this.cityMemberPickList = JSON.parse(this.editEntity.demo_chooseCityMember) || []
        this.$set(
            this.entity,
            'demo_chooseCityMemberInput',
            this.cityMemberPickList
                .map(element => {
                    return element.memName
                })
                .join(',')
        )

        //回显邀请代表、区代表以及input
        this.memberPickList = JSON.parse(this.editEntity.demo_chooseMember) || []
        this.$set(
            this.entity,
            'pickUserInput',
            this.memberPickList
                .map(element => {
                    return element.memName
                })
                .join(',')
        )

        //回显机关人员
        this.officeUserPickList = this.editEntity.demo_officeUser || []
        this.$set(
            this.entity,
            'pickOfficeUserInput',
            this.officeUserPickList
                .map(element => {
                    return element.name
                })
                .join(',')
        )
    }

    async queryOfficeUser(params, callback) {
        const result = await IasService.queryOfficeUser(params)
        callback(result)
    }
    async queryTownUsers(params, callback) {
        const result = await IasService.queryTownMember(params)
        callback(result)
    }
    async queryCityMember(params, callback) {
        const result = await IasService.queryCityMember(params)
        callback(result)
    }

    async queryMember(params, callback) {
        console.log('queryMember', params)
        const result = await IasService.queryMember(params)
        callback(result)
    }
    saveOfficeUsers(list) {
        this.officePickerVisible = false
        //回显
        const names = list
            .map(element => {
                return element.name
            })
            .join(',')
        this.$set(this.entity, 'pickOfficeUserInput', names)
        this.officeUserPickList = list
    }
    saveTownUsers(list) {
        //至少选一个
        if (list.length < 1) {
            Message.error('至少选择一个')
            return false
        }
        this.townUserPickerVisible = false
        //镇代表下面的列表slot赋值
        this.townUsersList = list.map(item => Object.assign({}, item))
        this.townUserPickList = list
        //input的回显
        const names = list
            .map(element => {
                return element.memName
            })
            .join(',')
        this.$set(this.entity, 'demo_chooseTownUsersInput', names)
    }

    saveCityMember(list) {
        this.cityMemberPickerVisible = false
        this.cityMemberPickList = list
        //input的回显
        const names = list
            .map(element => {
                return element.memName
            })
            .join(',')
        this.$set(this.entity, 'demo_chooseCityMemberInput', names)
    }

    saveMember(list) {
        console.log('saveMember', list)
        this.memberPickerVisible = false
        this.memberPickList = list
        //input的回显
        const names = list
            .map(element => {
                return element.memName
            })
            .join(',')
        this.$set(this.entity, 'pickUserInput', names)
    }

    saveDept(list) {
        this.deptPickerVisible = false
        this.deptPickList = list
        //input回显
        this.$set(
            this.entity,
            'demo_deptInput',
            list
                .map(item => {
                    return item.name
                })
                .join(',')
        )
    }
    saveMainMeeting(list) {
        this.mainMeetingPickerVisible = false
        this.mainMeetingPickList = list
        console.log('saveMainMeeting', list)
        //input回显
        this.$set(
            this.entity,
            'demo_mainMeetingInput',
            list
                .map(item => {
                    return item.name
                })
                .join(',')
        )
    }
    queryContact(params, callback) {
        const data = [
            { id: 1, contactUserName: 'april', contactPost: '主任', unitCode: 'FX_FGW', unitName: '发改委' },
            { id: 2, contactUserName: 'april2', contactPost: '主任2', unitCode: 'FX_FGW', unitName: '发改委' },
            { id: 3, contactUserName: 'april3', contactPost: '主任', unitCode: 'FX_JJW', unitName: '建交委' }
        ]
        let result = data
        if (params.unitCode && params.unitCode != '') {
            //改为调用联系人信息接口
            result = result.filter(item => {
                return item.unitCode == params.unitCode
            })
        }
        if (params.contactUserName && params.contactUserName != '') {
            result = result.filter(item => {
                return item.contactUserName.indexOf(params.contactUserName) > -1
            })
        }
        callback({ success: true, data: { currentPage: 1, pageSize: 10, total: result.length, list: result } })
    }
    saveContact(list) {
        console.log('saveContact', list)
        this.changeContackPickerDialog(false)
        this.contactPickList = list
    }

    handleDeleteContact(clickParams) {
        this.contactPickList.forEach((element, index) => {
            if (index == clickParams.index) this.contactPickList.splice(index, 1)
        })
    }
    async add() {
        const success = true
        alert('提交')
        console.log('新增', this.entity)
        //const { success } = await demoService.add(this.entity)
        // if (success) {
        //     Message({
        //         showClose: true,
        //         message: '新增成功',
        //         type: 'success'
        //     })
        //     this.close('ok')
        // }
    }

    async edit() {
        //const { success } = await userService.update(this.id, this.entity)
        console.log('编辑', this.entity)
        const success = true
        setTimeout(() => {
            if (success) {
                Message({
                    showClose: true,
                    message: '修改成功',
                    type: 'success'
                })
                this.close('ok')
            }
        }, 3000)
    }

    deleteHandler() {
        this.loading = 1
        const success = true
        setTimeout(() => {
            if (success) {
                this.loading = null
                Message({
                    showClose: true,
                    message: '删除成功',
                    type: 'success'
                })
                this.close('ok')
            }
        }, 3000)
    }

    cancelHandler() {
        this.close('cancel')
    }

    close(flag: 'ok' | 'cancel', item?) {
        ;(this.$refs.page as PageDialogLayout).close()
        this.$emit('close', flag, item)
    }
    disiableNext(val) {
        //console.log('disableNext', val)
        this.propertyData.form.forEach(element => {
            if (element.prop == 'demo_funselect1') this.$set(element, 'visible', val == 1 ? true : false)
            if (element.prop == 'demo_funselect2') this.$set(element, 'visible', val == 1 ? true : false)
            if (element.prop == 'demo_input') this.$set(this.entity, 'demo_input', '根据select下拉来显示的内容哦')
        })
    }
    // 事件联动单选框
    changeInputStatus(val) {
        //console.log('changeInputStatus', val)
        this.propertyData.form.forEach(element => {
            if (element.prop == 'demo_inputWithRadio') this.$set(element, 'visible', val == 'SpecifiedUser' ? true : false)
        })
    }
    pickOfficeUser() {
        this.changeDialog(true)
    }
    cancelOfficeUser() {
        this.changeDialog(false)
    }
    changeDialog(val) {
        this.officePickerVisible = val
    }
    // changeDialog 选人结束
    // pickTownUser 选择镇代表
    pickTownUser() {
        this.changeTownPickerDialog(true)
    }
    cancelTownUsers() {
        this.changeTownPickerDialog(false)
    }
    changeTownPickerDialog(val) {
        this.townUserPickerVisible = val
    }

    pickCityMember() {
        this.changeCityPickerDialog(true)
    }
    cancelCityMember() {
        this.changeCityPickerDialog(false)
    }
    changeCityPickerDialog(val) {
        this.cityMemberPickerVisible = val
    }

    pickMember() {
        this.changeMemberPickerDialog(true)
    }
    cancelMember() {
        this.changeMemberPickerDialog(false)
    }
    changeMemberPickerDialog(val) {
        this.memberPickerVisible = val
    }
    cancelDept() {
        this.changeDeptPickerDialog(false)
    }
    pickDept() {
        this.changeDeptPickerDialog(true)
    }
    changeDeptPickerDialog(val) {
        this.deptPickerVisible = val
    }
    cancelMainMeeting() {
        this.changeMainMeetingPickerDialog(false)
    }
    pickMainMeeting() {
        this.changeMainMeetingPickerDialog(true)
    }
    changeMainMeetingPickerDialog(val) {
        this.mainMeetingPickerVisible = val
    }

    changeContackPickerDialog(val) {
        this.contackPickerVisible = val
    }
    pickContact() {
        this.changeContackPickerDialog(true)
    }
    cancelContact() {
        this.changeContackPickerDialog(false)
    }

    //保存选人分组
    async saveMemGroup(groupName, list) {
        console.log('saveMemGroup', groupName, list)
        const refTableIds = list.map(item => {
            return item.memGuid
        })
        this.reloadTree = false
        const { success, response } = await IasService.saveMemberGroup(groupName, refTableIds)
        const message = response.data.message
        if (success) {
            if (message.indexOf('成功') > -1) {
                Message({
                    showClose: true,
                    message: '保存分组成功',
                    type: 'success'
                })
            } else {
                Message({
                    showClose: true,
                    message: '该分组已存在，请换一个分组名称，或者删除原有分组再次添加',
                    type: 'error'
                })
            }
            this.reloadTree = true
        }
    }
    //删除选人分组
    async delMemGroup(groupName) {
        const { success } = await IasService.delMemberGroup(groupName)
        if (success) {
            Message({
                showClose: true,
                message: '删除分组成功',
                type: 'success'
            })
        }
    }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog {
    height: 100%;
}

/deep/.el-dialog__body {
    padding: 0 !important;
    height: calc(100% - 71px);
}
/deep/.el-dialog__footer {
    background: white;
}
</style>
