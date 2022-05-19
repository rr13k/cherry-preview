import { defineComponent } from 'vue'
import Monaco from '../../components/monaco/monaco.vue'
import { CaseState, WebDb } from '@/utils/webDb'
import { CherryLink } from '@/utils/cherryLink'
import Dialog from '@/components/dialog/dialog.vue'
import { ElMessage } from 'element-plus'

var db: WebDb
var cherryLink = new CherryLink()

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
        rrDialog: Dialog,
        Monaco,
    },
    data() {
        return {
            dialogs:{
                preCode:{
                    visible:false,
                    script:'',
                    name:''
                }
            },
            id: 0,
            preCase: <any[]>[],
            script: '',
            search: '',
            activeName: 'case',
            log: '未运行,暂无日志.',
            logConfig: {
                lineNumbers:'off', // 关闭行号
                minimap: {enabled: false},
                readOnly:true,
            }
        }
    },
    watch:{
        preCase: {
            handler: function(newValue,lowValue){
                const ids = newValue.map((i: { id: number })=>{return i.id})
                db.UpdateCase({id:this.id,preCase:ids})
            },
            deep:true
        }
    },
    mounted() {
        const caseId = this.$route.params.id as string
        this.id = parseInt(caseId)
        db = new WebDb()
        db.init(window.indexedDB.open('cherry', 1)).then(()=>{
            this.getCaseById(this.id)
        })
        this.activeName = this.$route.query.tab as string || 'case'
    },
    methods: {
        save(){
            const script = (<typeof Monaco>this.$refs.monaco).getScriptValue()
            db.UpdateCase({id:this.id,script}).then(()=>{
                ElMessage({
                    message: 'case save success.',
                    type: 'success',
                  })
            })
        },
        delteTag(_case:any) {
            console.log('case',_case)
            this.preCase.splice(this.preCase.findIndex((i:{id:number})=>{
                return i.id == _case.id
            }), 1)
        },
        exit(){
            this.$router.push('/')
        },
        hideDialogs() {
            for (const [key, value] of Object.entries(this.dialogs)) {
                if (value.visible) {
                    value.visible = false
                    let func = 'init' + key[0].toUpperCase() + key.slice(1)
                    if (value.hasOwnProperty(func)) {
                        (value as any).func()
                    }
                    if (value.hasOwnProperty('ref')) (this.$refs as any)[(value as any).ref].resetFields()
                }
            }
        },
        preCode(_case:any){
            this.dialogs.preCode.script = _case.script
            this.dialogs.preCode.name = _case.name
            this.dialogs.preCode.visible = true
        },
        handleSelect(value:any) {
            this.preCase.push(value)
            this.search = ''
        },
        querySearchAsync(queryString: string, cb: (arg: any) => void) {
            db.getCaseByName(queryString).then(data=>{
                cb(data)
            })
        },
        run(_case:any){
            // 运行时获取最新脚本
            const script = (<typeof Monaco>this.$refs.monaco).getScriptValue()
            // add pre script
            let preScript = ''
            this.preCase.map((_case)=>{
                preScript += _case.script + '\n'
            })
            cherryLink
            .run({
                script:preScript + script,
                storage: {
                    case_id: _case.id
                }
            })
            .then((result) => {
                const {log, success} =  JSON.parse(result) 
                db.UpdateCase({id:this.id, state: success ? CaseState.SUCCESS : CaseState.ERROR})
                this.log = log
            })
        },
        getCaseById(id:number) {
            const _this = this
            db.getCaseById(id).then((_case)=>{
                const { script,preCase } = _case
                Promise.all(preCase.map(id=>{
                    return db.getCaseById(id)
                })).then(res => {
                    _this.preCase = res
                })
                _this.script = script
            })
        },
        handleClick(tab: any, event: Event) {
            this.$router.push({name:'Case',query:{tab:tab.props.name}})
        }
    }
})
