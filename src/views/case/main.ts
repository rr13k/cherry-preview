import { defineComponent } from 'vue'
import BaseCase from './baseCase/baseCase.vue'

const defineCaseConfig = {
    id: 0,
    case_id: 0,
    run_scene: 1,
    traceless: true,
    clear: false,
    debug: false,
    auto_exit: true,
    cookies: ''
}

export enum RunStatus {
    _,
    idle,
    running,
    error,
    success
}

export default defineComponent({
    name: 'Index',
    components: {
        baseCase: BaseCase,
    },
    data() {
        return {
            activeName: 'case',
        }
    },
    mounted() {
        console.log('显示case')
        this.activeName = this.$route.query.tab as string || 'case'
    },
    methods: {
        handleClick(tab: any, event: Event){
            this.$router.push({name:'Case',query:{tab:tab.props.name}})
        }
    }
})
