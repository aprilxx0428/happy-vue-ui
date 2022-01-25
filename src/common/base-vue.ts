import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { User } from '@/store'

@Component
export default class BaseVue extends Vue {
    /**
     * 当前用户
     */
    @State('user') user!: User
}
