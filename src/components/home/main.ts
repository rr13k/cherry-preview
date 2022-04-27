import { defineComponent, computed, reactive, provide } from 'vue'
import Headline from '@/components/head/head.vue'

export default defineComponent({
    name: 'Home',
    components: {
        Headline
    },
    provide() {
        return {
            shows: this.show
        }
    },
    setup() {
        // const homeHeritage = reactive({
        // 	sidebarShow: true,
        // })
        // provide('sidebarShow',homeHeritage)
    },
    data() {
        return {
            show: reactive({
                sidebar: true
            })
        }
    }
})
