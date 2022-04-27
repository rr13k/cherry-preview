import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Head',
    inject: ['shows'],
    data() {
        return {
            name: '游客'
        }
    },
    mounted() {
    },
    methods: {
        sidebarTurn() {
            // @ts-ignore
            this.shows.sidebar = !this.shows.sidebar
        },
    }
})
