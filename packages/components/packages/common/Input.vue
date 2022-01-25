<template>
    <div class="deafult">
        <template v-if="readOnly">
            <span v-html="myValue"></span>
        </template>
        <template v-else>
            <el-input
                v-model="myValue"
                :type="basic.type"
                :placeholder="basic.placeholder"
                :rows="basic.rows"
                :readonly="basic.readonly != null && basic.readonly"
                @input="handleInput"
                :maxlength="basic.maxlength"
                :minlength="basic.minlength"
            >
                <template v-if="basic.slot && basic.slot.length">
                    <template v-for="(slot, index) in basic.slot" :slot="slot.position">{{ mySlotValue.length > 0 ? mySlotValue[index] : slot.slotText }}</template>
                </template>
            </el-input>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({})
export default class Input extends Vue {
    @Prop() prop: string
    @Prop() readOnly: boolean
    @Prop() basic: Record<string, any>
    @Prop() value: string
    @Prop() slotValue: []
    myValue = ''
    readonly = false
    mySlotValue = ''
    @Watch('value', { immediate: true })
    WatchValue(val) {
        this.myValue = val
        this.$emit('setCurrentOpProp', this.prop)
    }

    @Watch('slotValue', { immediate: true })
    watchSlotValue(val) {
        if (val) this.mySlotValue = val
    }
    handleInput(val) {
        this.$emit('input', val)
    }
}
</script>
