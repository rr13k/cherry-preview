import { defineComponent, ref, Ref } from 'vue'

export default defineComponent({
    name: 'FastInput',
    props: {
        label: {
            type: String,
            default: ''
        },
        id: {
            type: Number,
            default: 0
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['change','click'],
    data() {
        return {
            show: true,
            closed: false,
            newLabel: '',
            itemRefs: []
        }
    },
    computed: {},
    watch: {},
    methods: {
        startEdit(): void {
            this.newLabel = this.label
            this.show = false
            this.$nextTick(() => {
                let dom = document.getElementById('setItemRef')
                dom?.focus()
            })
        },
        cancel() {
            this.show = true
        },
        /**
         * @method 监听失去焦点，直接取消将导致无法提交
         */
        blur() {
            setTimeout(() => {
                this.cancel()
            }, 100)
        },
        click(){
            this.$emit('click')
        },
        submit() {
            if (this.label !== this.newLabel) {
                this.$emit('change', this.newLabel, this.id)
            }
            this.show = true
        }
    }
})
