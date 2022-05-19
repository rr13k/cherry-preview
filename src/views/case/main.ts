import { defineComponent } from 'vue'
import BaseCase from './baseCase/baseCase.vue'

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
        this.activeName = this.$route.query.tab as string || 'case'
    },
    methods: {
        handleClick(tab: any, event: Event){
            this.$router.push({name:'Case',query:{tab:tab.props.name}})
        }
    }
})
