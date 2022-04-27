/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineComponent } from 'vue'
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup'
import { keymap } from '@codemirror/view'
import { cherry } from 'codemirror-lang-cherry'
// import { defaultTabBinding } from '@codemirror/commands'

export default defineComponent({
    name: 'Codemirror',
    props: {
        script: {
            type: String,
            default: ''
        },
        onSave: {
            type: Function,
            default: undefined
        }
    },
    data() {
        return {
            name: '游客',
            editorState: undefined
        }
    },
    mounted() {
        this.init()
    },
    // warning! don't  be delete this, it hold back doubel window!
    unmounted(){ },
    methods: {
        test() {
            console.log(this.script)
        },
        save(): boolean {
            const change = (window as any).view.state.update()
            let newDoc = change.newDoc.toString()
            if (this.onSave !== undefined) {
                this.onSave(newDoc)
            }
            return true
        },
        init() {
            let save = { key: 'Ctrl-s', mac: 'Cmd-s', run: this.save }
            let state = EditorState.create({
                doc: this.script,
                extensions: [basicSetup, keymap.of([save]), cherry()]
            })
            ;(window as any).view = new EditorView({
                state,
                parent: document.querySelector('#editor')!
            })
        },
        sidebarTurn() {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
        }
    }
})
