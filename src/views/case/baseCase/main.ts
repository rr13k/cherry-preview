import { defineComponent } from 'vue'
import Dialog from '@/components/dialog/dialog.vue'
import FastInput from '@/components/fastInput/fastInput.vue'
import DrawerBtns from '@/components/drawerBtns/drawerBtns.vue'
import Codemirror from '@/components/codemirror/codemirror.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { cherrySocket } from 'cherry-driver-socket'
import { formatTime } from '@/utils/suger'
// import { LiveConfig, RunConfig } from 'cherry-driver-socket/dist/typeApi'
import { CherryLink } from '@/utils/cherryLink'
import { WebDb } from '@/utils/webDb'

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

var db: WebDb

export default defineComponent({
    name: 'Index',
    components: {
        rrDialog: Dialog,
        codemirror: Codemirror,
        drawerBtns: DrawerBtns,
        fastInput: FastInput
    },
    data() {
        return {
            mydb: {
                name:'cherry',
                varsion:1,
            },
            localCherry: {
                show: false // 默认不渲染可能不会进行本地操作
            },
            dialogs: {
                live: {
                    visible: false
                },
                runConfig: {
                    visible: false,
                    data: defineCaseConfig
                },
                reports: {
                    visible: false,
                    data: []
                },
                code: {
                    visible: false,
                    script: '',
                    caseId: 0
                },
                createCode: {
                    visible: false,
                    script: '',
                    caseId: 0
                }
            },
            cherryLink: <CherryLink>{},
            btnsKey: -1, // -1 为全部隐藏
            titles: ['case', '状态', '运行数', '更新时间', '操作'],
            projectId: 0,
            activeName: '',
            caseList: [],
            pagination: {
                total: 0,
                current_page: 1,
                page_size: 10
            }
        }
    },
    mounted() {
        /**
         * desc:
         *      首先检测如果是第一次进入的话,提供示例项目。并提供使用引导。
         * 如果本地没有库则代表第一次使用
         */
        db = new WebDb(window.indexedDB.open('cherry', this.mydb.varsion))
        // this.checkFrist()
        this.projectId = Number(this.$route.params.project_id)
        this.getTableData()
        this.cherryLink = new CherryLink()
        console.log('caseList', this.caseList)
    },
    methods: {
        test() {
            // 新增脚本
            console.log('新增脚本')
            db.addCase({name:'nih22ao',id:34})
        },
        /**
         * @method 保存编辑脚本
         */
        editSave(script: string) {
            console.log('保存的脚步为', script)
            // 传递后台修改脚本
            // request
            //     .post('case/update', {
            //         id: this.dialogs.code.caseId,
            //         script
            //     })
            //     .then(() => {
            //         ElMessage.success('保存成功')
            //         this.getTableData()
            //     })
        },
        /**
         * @method  是否第一次使用
         */
        checkFrist() :boolean {
            var request = window.indexedDB.open(this.mydb.name, this.mydb.varsion);
            request.onerror = function (event) {
                console.log('数据库打开报错');
            };

            var db;
            request.onsuccess = function (event) {
                db = request.result;
                //db = event.target.result; 也能拿到
                console.log('数据库打开成功');
            };

            return true
        },
        showRunReport(id: number) {
            console.log('显示运行记录')
            this.getCaseRunReports(id)
            this.dialogs.reports.visible = true
        },
        getCaseRunReports(id: number) {
            // request
            //     .post('report/getAll', {
            //         case_id: id
            //     })
            //     .then((res: any) => {
            //         const { data } = res
            //         console.log('运行记录', data)
            //         this.dialogs.reports.data = data
            //         // ElMessage.success('保存成功')
            //         // this.getTableData()
            //     })
        },
        createCase(script: string) {
            ElMessageBox.prompt('请输入用例名称:', '创建用例', {})
                .then(({ value }: any) => {
                    this.saveScript({ script, name: value }).then(() => {
                        this.getTableData()
                    })
                    this.hideDialogs()
                })
                .catch(() => {
                    console.log('取消了,创建用例!')
                })
        },
        /**
         * @method 修改case的名称
         * @param name 修改后的名称
         * @param id 绑定的id
         */
        changeName(name: string, id: number) {
            console.log('触发了修改', name, id)
            // request
            //     .post('case/update', {
            //         id,
            //         name
            //     })
            //     .then(() => {
            //         ElMessage.success('保存成功')
            //     })
            this.caseList.map((i: any) => {
                if (i.id === id) {
                    i.name = name
                    return
                }
            })
        },
        setBtnsKey(key: any) {
            this.btnsKey = key
        },
        getTableData() {
            // request
            //     .post('case/list', {
            //         project_id: this.projectId,
            //         ...this.pagination
            //     })
            //     .then((res: any) => {
            //         console.log('res', res)
            //         this.caseList = res.data
            //         this.pagination.total = res.total
            //     })
        },
        /**
         * @method 运行指定用例
         */
        runCase(_case: any) {
            _case.status = RunStatus.running // 状态切换运行中
            const _this = this
            // this.getCaseSetting(_case.id).then((res) => {
            //     const { data } = res
            //     const runConfig: any = {
            //         traceless: data.traceless,
            //         autoExit: data.auto_exit,
            //         clear: data.clear,
            //         cookies: data.cookies,
            //         resultHint: false,
            //         script: _case.script,
            //         debug: false,
            //         storage: {
            //             case_id: _case.id
            //         }
            //     }

            //     _this.cherryLink
            //         .run({
            //             script: _case.script,
            //             storage: {
            //                 case_id: _case.id
            //             }
            //         })
            //         .then((result) => {
            //             console.log('获取到的执行结果', result)
            //         })
            //     // cherrySocket.run(runConfig, function (res: any) {
            //     //     console.log('获取到的想要', res)
            //     //     res = JSON.parse(res)
            //     //     res.case_id = res.storage.case_id
            //     //     res.divertor = JSON.stringify(res.divertor)
            //     //     request.post('case/runReport', res).then(() => {
            //     //         console.log('上报成功')
            //     //         _this.getTableData()
            //     //     })
            //     // })
            // })
        },
        /**
         * @method 修改case运行配置
         */
        changeConfig() {
            const config = this.dialogs.runConfig.data
            console.log('编辑数据', config)
            // 新增修改为同一个接口id为0则新增
            let url = config.id === 0 ? 'caseConfig/insert' : 'caseConfig/update'
            // request
            //     .post(url, {
            //         ...config
            //     })
            //     .then(() => {
            //         ElMessage.success('修改成功')
            //     })
            this.hideDialogs()
        },
        saveScript(data: any): Promise<any> {
            // return request.post('case/add', {
            //     ...data,
            //     project_id: this.projectId
            // })
            return '' as any
        },
        /**
         * @method 显示编辑用例弹框
         * @param _case 用例信息
         */
        showEditDialog(_case: any) {
            this.dialogs.code.visible = true
            this.dialogs.code.script = _case.script
            this.dialogs.code.caseId = _case.id
        },
        /**
         * @method 获取用例运行时配置并打开窗口
         * @param case_id 用例id
         */
        setRunSetting(case_id: number) {
            // 获取指定case的运行配置
            // this.getCaseSetting(case_id).then((res: any) => {
            //     const { data } = res
            //     let config = defineCaseConfig
            //     config.case_id = case_id
            //     if (data?.id !== undefined) {
            //         config = {
            //             auto_exit: data.auto_exit,
            //             clear: data.clear,
            //             cookies: data.cookies,
            //             debug: data.debug,
            //             run_scene: data.run_scene,
            //             traceless: data.traceless,
            //             case_id,
            //             id: data.id
            //         }
            //     }
            //     this.dialogs.runConfig.data = config
            //     this.dialogs.runConfig.visible = true
            //     console.log(config)
            // })
        },
        getCaseSetting(case_id: number) {
            // return request.post('caseConfig/get', {
            //     case_id
            // })
        },
        add() {
            // this.caseList.push({
            //     id: 4,
            //     name: '专线测试',
            //     author: '小猫咪',
            //     status: 3,
            //     runNumber: 2,
            //     modified_date: 1621302491443
            // })
        },
        del() {
            this.caseList.pop()
        },
        hideDialogs() {
            //隐藏弹窗
            // Object.keys(this.dialogs).map((i) => {
            //     if (this.dialogs[i].visible) {
            //         this.dialogs[i].visible = false
            //         let func = 'init' + i[0].toUpperCase() + i.slice(1)
            //         if (this[func]) this[func]()
            //         if (this.dialogs[i].ref) (this.$refs as any)[this.dialogs[i].ref].resetFields()
            //     }
            // })
        },
        formatTime: (date: string) => {
            return formatTime(date)
        },
        writer() {
            this.hideDialogs()
            this.dialogs.createCode.visible = true
        },
        createScript() {
            this.dialogs.live.visible = true
        },
        deleteCase(id: number) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.$confirm('您确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                .then(() => {
                    // request
                    //     .post('case/delete', {
                    //         id
                    //     })
                    //     .then((res: any) => {
                    //         // console.log('刹车', this.$message)
                    //         console.log('shanchu', res)
                    //         ElMessage.success('删除成功!')
                    //         this.getTableData()
                    //     })
                })
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                .catch(() => {})
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
            const _this = this
            const liveConfig: any = {
                script: 'await page.create(`https://baidu.com`)',
                cookies: [
                    {
                        name: 'nihao8899',
                        value: 'bbk',
                        domain: '.baidu.com',
                        url: 'http://www.baidu.com'
                    }
                ]
            }
            console.log('开始了录制', liveConfig)
            this.cherryLink.live(liveConfig).then((result) => {
                console.log('录制的结果', result)
            })
            // cherrySocket.live(liveConfig, function (res: any) {
            //     const data = JSON.parse(res)
            //     _this.saveScript({ script: data.script }).then(() => {
            //         _this.getTableData()
            //     })
            // })
        },
        live() {
            this.startLive()
            this.hideDialogs()
        }
    }
})
