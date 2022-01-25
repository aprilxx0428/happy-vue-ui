<template>
    <el-upload class="avatar-uploader" :action="uploadAction" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <el-avatar :shape="item.basic.shape" :size="item.basic.size" :src="imageSrc"></el-avatar>
    </el-upload>
</template>
<script lang="ts">
import { Vue, Watch, Component, Prop } from 'vue-property-decorator'
import 'element-ui/lib/theme-chalk/index.css'
import config from '../../config'
@Component({})
export default class Avatar extends Vue {
    @Prop() item: Record<string, any>
    @Prop() value: string
    @Prop() defaultImgSrc: string
    //默认头像图片
    defaultAvatarSrc = config.defaultAvatarSrc
    //图片上传路径
    uploadAction = config.attachApiHost + 'upload/add'
    imageUrl = ''
    //imageUrl = 'http://localhost:1203/unpc/upload/getHeadPhoto?id=5d936d3c-6f4a-4bb7-8e16-62bf3d8d4b03'
    @Watch('value', { immediate: true })
    WatchValue(id) {
        if (id) this.imageUrl = config.attachApiHost + 'upload/getHeadPhoto?id=' + id
    }
    get imageSrc() {
        return this.imageUrl != '' ? this.imageUrl : this.item.basic.src ? this.item.basic.src : this.defaultAvatarSrc
    }
    handleAvatarSuccess(res, file) {
        const { flag, data } = res
        this.imageUrl = URL.createObjectURL(file.raw)
        let result = ''
        if (flag == 0) result = res.data
        this.$emit('successHandler', result, this.item.prop)
    }
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
    }
}
</script>
