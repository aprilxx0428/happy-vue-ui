<template>
    <div :class="{ [$style.search]: true, [$style['search-adv']]: !!$scopedSlots.content, [$style['search-adv-content']]: advContentVisible }">
        <div :class="$style['search__box']">
            <el-input v-model="key" :placeholder="placeholder" v-on:keyup.enter.native="enterKeyupHandler">
                <template #suffix>
                    <i class="fc fc-search" style="cursor: pointer" @click="simpleSearchHandler" />
                </template>
            </el-input>
            <el-button :class="$style['search__advbutton']" type="button" icon="fc fc-text-multi" @click="toggleContentVisibleHandler"></el-button>
        </div>
        <span :class="$style.advarrow"> </span>
        <div :class="$style.advbox" :style="{ width: contentWidth, ...contentStyle }">
            <slot name="content" :close="closeContent" />
        </div>
        <div v-if="modal" :class="$style.wapper"></div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class Search extends Vue {
    @Prop({ type: String, default: '请输入关键字进行查询' }) placeholder: string
    @Prop({}) contentStyle
    @Prop({ type: Boolean, default: false }) contentVisible: boolean
    @Prop({ type: Boolean, default: true }) modal: boolean

    advContentVisible = false
    contentWidth = ''

    key = ''

    mounted() {
        this.watchContentVisible()
        this.contentWidth = document.querySelector('body').clientWidth - 60 + 'px'
    }

    @Watch('contentVisible')
    watchContentVisible() {
        this.advContentVisible = this.contentVisible
        if (this.advContentVisible) {
            this.contentWidth = document.querySelector('body').clientWidth - 60 + 'px'
        }
    }

    toggleContentVisibleHandler() {
        const visible = !this.advContentVisible
        this.advContentVisible = visible
        this.$emit('update:contentVisible', visible)
    }

    closeContent() {
        this.advContentVisible = false
        this.$emit('update:contentVisible', false)
    }

    enterKeyupHandler() {
        this.$emit('search', this.key)
    }

    simpleSearchHandler() {
        this.$emit('search', this.key)
    }
}
</script>

<style lang="less" module>
@import '~@/assets/css/base/variables.less';
.search {
    display: inline-block;
    white-space: nowrap;
    position: relative;
    height: 38px;
    line-height: 38px;
    vertical-align: middle;
    margin-top: -3px;

    .search__box {
        display: flex;

        :global {
            .el-input {
                width: auto;
            }
            .el-input__inner {
                padding-right: 40px;
                height: 38px;
                line-height: 38px;
            }
            .el-input__suffix {
                right: 10px;
            }
            .el-input__suffix-inner {
                color: #666;
                font-size: 16px;
                margin-top: 1px;
            }
            .el-button {
                margin-top: 0;
            }
        }
    }

    .search__advbutton {
        display: none;
        &:hover {
            // color: inherit;
            background: transparent;
        }
        &:focus {
            color: #666;
            background: transparent;
        }
    }

    &-adv {
        .search__box {
            :global {
                .el-input__inner {
                    border-right: 0;
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                .el-button {
                    border-color: #ccc;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }
            }
        }
        &-content {
            .advbox,
            .advarrow,
            .wapper {
                display: block;
            }

            .search__advbutton {
                color: @brand-primary;
                &:hover {
                    color: @brand-primary;
                }
                &:focus {
                    color: @brand-primary;
                }
            }
        }

        .search__advbutton {
            display: inline-block;
        }
    }
}

.advbox {
    display: none;
    line-height: initial;
    position: absolute;
    top: 60px;
    right: -35px;
    min-height: 100px;
    z-index: 100;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 20px 0px #ccc;
    padding: 10px;
}

.advarrow {
    display: none;

    position: absolute;
    top: 52px;
    right: 15px;
    border: 1px solid #eeeeee;
    border-bottom: none;
    border-right: none;
    background: #fff;
    width: 14px;
    height: 14px;
    transform: rotate(45deg);
    z-index: 101;
}
.wapper {
    display: none;
    position: fixed;
    bottom: 5px;
    left: 5px;
    right: 5px;
    top: 60px;
    background: rgba(0, 0, 0, 0.2);
    z-index: 10;
}
</style>
