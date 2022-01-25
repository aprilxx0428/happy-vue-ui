<template>
    <div class="aioa-page-main-layout">
        <div v-if="currentShowHeader" class="aioa-page-main-layout__header">
            <el-row :gutter="20">
                <el-col :span="10">
                    <div class="aioa-page-main-layout__title">
                        <h3 class="aioa-page-main-layout__title-text">{{ currentPageTitle }}</h3>
                        <div class="aioa-page-main-layout__title-assisted">
                            <slot name="titleAssisted"></slot>
                        </div>
                    </div>
                </el-col>
                <el-col :span="14" class="aioa-page-main-layout__header-buttons">
                    <slot name="buttons"></slot>
                    <slot name="refreshBtn">
                        <el-button v-show="btnRefresh" :disabled="isPreview" title="刷新" @click="refresh">
                            <i class="fc fc-recover"></i>
                        </el-button>
                    </slot>
                </el-col>
            </el-row>
        </div>
        <div class="aioa-page-main-layout__content">
            <div class="aioa-page-main-layout__side" v-if="$slots.side">
                <slot name="side" />
            </div>
            <div class="aioa-page-main-layout__body">
                <div class="aioa-page-main-layout__list">
                    <slot></slot>
                </div>
                <div v-if="$slots.pagination" class="aioa-page-main-layout__pagination">
                    <slot name="pagination"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        pageTitle: {
            default: '',
            type: String
        },
        isPreview: {
            default: false,
            type: Boolean
        },
        btnRefresh: {
            default: true,
            type: Boolean
        },
        isShowHeader: {
            default: true,
            type: Boolean
        }
    },
    data() {
        return {
            currentShowHeader: this.isShowHeader,
            currentPageTitle: this.pageTitle
        }
    },
    watch: {
        pageTitle(newValue) {
            this.currentPageTitle = newValue
        }
    },
    mounted() {
        if (this.$route.query.isShowHeader === '0') {
            this.currentShowHeader = false
        }
    },
    methods: {
        previousStep() {
            if (!this.$route.meta.isGoIndex) {
                this.$router.go(-1)
            }
        },
        nextStep() {
            this.$router.go(1)
        },
        refresh() {
            this.$emit('refresh')
            // location.reload()
        }
    }
}
</script>

<style lang="less">
@import '../../assets/css/base/variables.less';
.aioa-page-main-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
    &__header {
        text-align: right;
        font-size: 12px;
        line-height: 60px;
        padding: 0 20px;

        &-buttons {
            position: relative;

            .el-button {
                font-size: @middle-font-size !important;
                padding: 9px 15px;
                margin-top: -3px;
                vertical-align: middle;
                height: 38px;
            }

            .el-dropdown {
                height: 47px;
            }
        }
    }

    &__title {
        display: flex;
        &-text {
            text-align: left;
            font-size: 16px;
            min-height: 10px;
        }
        &-assisted {
            margin-left: 10px;
        }
    }

    &__content {
        flex: 1;
        border: 1px solid @border-primary;
        padding: 0;
        margin: 5px;
        margin-top: 0;
        display: flex;
        height: 100px;
        overflow: hidden;
    }

    &__side {
        height: 100%;
        border-right: 1px solid @border-primary;
    }

    &__body {
        height: 100%;
        width: 100px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    &__list {
        flex: 1;
        box-sizing: content-box;
        overflow: auto;
        padding: 6px;
        .tabs-horizontal {
            margin-bottom: 0;
        }

        .el-table__fixed::before,
        .el-table::before {
            display: none;
        }
    }

    &__pagination {
        border-top: 1px solid @border-primary;
        padding: 20px;
        text-align: center;
    }
}
</style>
