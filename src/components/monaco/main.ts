import { defineComponent, computed, reactive, provide } from 'vue'
import * as monaco from 'monaco-editor'
import parse from '../../utils/parse.d.ts?raw'


interface MonacoInstances {
    [key: string]: monaco.editor.IStandaloneCodeEditor
}
const monacoInstances: MonacoInstances = {}

export default defineComponent({
    name: 'monaco',
    components: {},
    props: {
        script: {
            type: String,
            default: '',
        },
        language: {
            type: String,
            required: true
        },
        config: {
            type: Object, // IEditorOptions
            default: {}
        },
        id: {
            type: String,
            default: 'monaco',
        }
    },
    emits: ['save'],
    watch: {
        script: function (text) {
            monacoInstances[this.id].setValue(text)
        }
    },
    methods: {
        getScriptValue() {
            return monacoInstances[this.id].getValue()
        }
    },
    mounted() {
        const monacoNode = document.getElementById(this.id) as HTMLElement
        if (monacoNode) {
            if (this.language === 'javascript') {
                // extra libraries
                var libSource = [parse,
                    `
                declare const page :FCherryPage
                declare const cookies :FCherryCookies
                declare const keyboard :FCherryKeyboard
                declare const mouse :FCherryMouse
                declare const dom :FCherryDom
                declare const browser :FCherryBrowser
                declare const assert :FCherryAssert
                declare const sleep :(ms:number)=> Promise<void>
                declare const execJavaScript :(script:string) => Promise<any>
                `
                ].join('\n');
                var libUri = 'ts:filename/cherry.d.ts';
                monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
            }
            monacoInstances[this.id] = monaco.editor.create(monacoNode, {
                value: this.script,
                language: this.language,
                scrollBeyondLastLine: false,
                fixedOverflowWidgets: true,
                ...this.config
            })

            if(this.id == 'monaco') {
                monacoInstances[this.id].addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,() =>{
                    this.$emit('save',[this.getScriptValue()])
                })
            }
          
            if (this.config.readOnly) {
                const messageContribution = monacoInstances[this.id].getContribution('editor.contrib.messageController');
                monacoInstances[this.id].onDidAttemptReadOnlyEdit(() => {
                    messageContribution?.dispose();
                });
            }
        }
    },
    data() {
        return {
            monacoInstance: <any>{}
        }
    }
})
