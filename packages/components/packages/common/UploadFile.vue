<template>
    <upload ref="upload2" :action="actionUrl" :file-list="uploadInfo.fileList" :ref-table-name="refTableName" :is-edit-file="!readOnly" @on-success="successUploadInfoHandler" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { IasService } from '../../services'
import Upload from './Upload.vue'
import config from '../../config'
@Component({
    components: {
        Upload
    }
})
export default class UploadFile extends Vue {
    @Prop() id: string
    @Prop() refTableName: string
    @Prop() prop: string
    @Prop() readOnly: boolean
    @Prop() fileList: []
    myId = ''
    @Watch('id', { immediate: true })
    watchId(val) {
        //console.log('attach,watchid:' + val, this.prop, this.fileList)
        if (val) {
            //如果filelist中有值，就用filelist的值,可能是entity变化导致upload组件重新加载，为了防止添加或删除过附件，重新加载回去重新getAttachments，导致刚才修改的附件丢失
            this.myId = val
            if (this.fileList) this.uploadInfo.fileList = this.fileList
            else this.getAttachments()
        }
    }
    //actionUrl = config.apiHost + `/sharedservice/blob/upload`
    actionUrl = config.attachApiHost + 'upload/add'
    //actionUrl = 'http://localhost:1203/unpc/upload/add'
    uploadInfo = {
        refTableId: '',
        fileList: [],
        ids: []
    }
    successUploadInfoHandler(list) {
        //console.log('successUploadInfoHandler', list, this.prop)
        this.$emit('successHandler', list, this.prop)
    }
    /**
     * 获取附件列表
     */
    async getAttachments() {
        const condition = { refTableName: this.refTableName, refTableId: this.myId }
        const { success, data } = await IasService.queryAttach(condition)
        if (success) {
            data.forEach(element => {
                element.url = config.attachDowloadPathPrefix + element.id
            })
            this.uploadInfo.fileList = data
        }
        //console.log('getAttachments', this.uploadInfo.fileList, config)
    }
}
</script>
