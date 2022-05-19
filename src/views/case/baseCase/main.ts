import { defineComponent,h } from 'vue'
import Dialog from '@/components/dialog/dialog.vue'
import FastInput from '@/components/fastInput/fastInput.vue'
import DrawerBtns from '@/components/drawerBtns/drawerBtns.vue'
import { ElMessage } from 'element-plus'
import { formatTimeNumber } from '@/utils/suger'
import { CherryLink } from '@/utils/cherryLink'
import { CaseState, WebDb } from '@/utils/webDb'
import { ElFormItem, ElForm, ElInput,ElStep,ElSteps} from 'element-plus'
import deviceDescriptorsSource from '@/utils/deviceDescriptorsSource.json'

var cherryLink = new CherryLink()

export enum RunStatus {
    _,
    idle,
    running,
    error,
    success
}

var db: WebDb

export default defineComponent({
    name: 'Index',
    components: {
        rrDialog: Dialog,
        drawerBtns: DrawerBtns,
        fastInput: FastInput,
        ElForm, ElFormItem, ElInput,ElStep, ElSteps
    },
    data() {
        return {
            mydb: {
                name: 'cherry',
                varsion: 1,
            },
            dialogs: {
                live: {
                    visible: false,
                    name: '',
                    url: '',
                    h5: false,
                    mobile: '',
                    moblieList: <Object[]>[]
                }
            },
            cherryLink: <CherryLink>{},
            btnsKey: -1, // -1 为全部隐藏
            caseList: [],
            pagination: {
                total: 0,
                current_page: 1,
                page_size: 10
            }
        }
    },
    mounted() {
        console.log(CaseState)
        db = new WebDb()
        db.init(window.indexedDB.open('cherry', 1)).then(() => {
            this.getTableData()
        })
        this.dialogs.live.moblieList = Object.keys(deviceDescriptorsSource) || []
    },
    methods: {
        /**
         * @method 修改case的名称
         * @param name 修改后的名称
         * @param id 绑定的id
         */
        changeName(name: any, id: number) {
            db.UpdateCase({ name, id })
            this.caseList.map((i: any) => {
                if (i.id === id) {
                    i.name = name
                    return
                }
            })
        },
        createEmpty(){
            db.addCase({name:'新的空白脚本',script:''}).then(()=>{
                this.getTableData()
                ElMessage({
                    message: 'case create success.',
                    type: 'success',
                  })
            })
        },
        setBtnsKey(key: any) {
            this.btnsKey = key
        },
        getTableData() {
            db.getCaseList(this.pagination.current_page, this.pagination.page_size).then((res: any) => {
                this.caseList = res.data
                this.pagination.total = res.count
            })
        },
        /**
         * @method 运行指定用例
         */
        debug(_case: any) {
            this.$router.push({ name: 'control', params: { id: _case.id } })
        },
        /**
         * @method 隐藏弹框
         */
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
        formatTime: (date: number) => {
            return formatTimeNumber(date)
        },
        createScript() {
            this.dialogs.live.visible = true
        },
        deleteCase(id: number) {
            // @ts-ignore
            this.$confirm('您确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                db.deleteCase(id).then(i => {
                    this.getTableData()
                })
            })
            .catch(() => { })
            this.btnsKey = -1
        },
        handleSizeChange(size: number): void {
            this.pagination.page_size = size
            this.getTableData()
        },
        handleCurrentChange(page: number): void {
            this.pagination.current_page = page
            this.getTableData()
        },
        startLive() {
            const liveConfig: any = {
                url: this.dialogs.live.url,
                storage: {
                    name: this.dialogs.live.name
                },
                cookies: [
                    {
                        name: 'nihao8899',
                        value: 'bbk',
                        domain: '.baidu.com',
                        url: 'http://www.baidu.com'
                    }
                ]
            }
            if (this.dialogs.live.h5 && this.dialogs.live.mobile) {
                liveConfig.device = this.dialogs.live.mobile
            }
            cherryLink.live(liveConfig).then((result) => {
                result = JSON.parse(result)
                // 增加case
                db.addCase({
                    name: result.storage.name && result.storage.name != '' ? result.storage.name : '新的用例',
                    script: result.script
                })
                this.getTableData()
            })
        },
        live() {
            this.startLive()
            this.hideDialogs()
        }
    }
})
