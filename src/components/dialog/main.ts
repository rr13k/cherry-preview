import { defineComponent, computed } from 'vue'

export default defineComponent({
    name: 'Dialog',
    props: {
        width: String,
        fullscreen: Boolean,
        beforClose: Function,
        title: {
            type: String,
            default: ''
        },
        top: {
            type: String,
            default: '15vh'
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['open', 'close', 'update:visible'],
    data() {
        return {
            closed: false
        }
    },
    computed: {
        style() {
            let style: any = {}
            if (!this.fullscreen) {
                style.marginTop = this.top
                if (this.width) {
                    style.width = this.width
                }
            }
            return style
        }
    },

    watch: {
        visible(val: boolean) {
            if (val) {
                this.closed = false
                this.$emit('open')
            } else {
                if (!this.closed) this.$emit('close')
            }
        }
    },
    mounted() {
        if (this.visible) {
            console.log('asdasd', this.visible)
        }
    },
    methods: {
        handleClose() {
            if (typeof this.beforClose === 'function') {
                this.beforClose(this.hide)
            } else {
                this.hide()
            }
        },
        hide(cancel?: boolean) {
            if (cancel !== false) {
                this.$emit('update:visible', false)
                this.$emit('close')
                this.closed = true
            }
        }
    }
})
