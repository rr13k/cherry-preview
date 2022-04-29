<template>
    <div class="casePage">

        <div class="case">
            <header>
                <button class="cherryBtn" @click="createScript"> 新增脚本 </button>
                <button @click="test">test</button>
            </header>

            <body>
                <transition name="debut" appear>
                    <el-table :data="caseList" stripe max-height="100%" class="case_table">
                        <el-table-column prop="name" label="case">
                            <template #default="scope">
                                <fastInput
                                    :id="scope.row.id"
                                    :label="scope.row.name"
                                    @change="changeName"
                                ></fastInput>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" width="100">
                            <template #default="scope">
                                <ul class="status">
                                    <li v-if="scope.row.status == 0">
                                        <i style="background-color: #909399"></i>
                                        <span>待测试</span>
                                    </li>
                                    <li v-if="scope.row.status == 1">
                                        <i style="background-color: #f56c6c"></i> <span>失败</span>
                                    </li>
                                    <li v-if="scope.row.status == 2">
                                        <i style="background-color: #e6a23c"></i>
                                        <span>运行中</span>
                                    </li>
                                    <li v-if="scope.row.status == 3">
                                        <i style="background-color: #67c23a"></i> <span>成功</span>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                        <el-table-column prop="run_number" label="运行数" width="180">
                        </el-table-column>
                        <el-table-column prop="modified_date" label="更新时间" width="180">
                            <template #default="scope">
                                {{ formatTime(scope.row.modified_date) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <i
                                    class="iconfont iconrun iconBtn"
                                    title="运行"
                                    @click="runCase(scope.row)"
                                ></i>
                                <i
                                    title="编辑"
                                    class="iconfont iconbianji iconBtn"
                                    @click.stop="showEditDialog(scope.row)"
                                ></i>
                                <i
                                    title="运行记录"
                                    class="iconfont iconjilu iconBtn"
                                    @click.stop="showRunReport(scope.row.id)"
                                ></i>
                                <drawerBtns
                                    v-model:show-key="btnsKey"
                                    :key-id="scope.row.id"
                                    :change-show="setBtnsKey"
                                >
                                    <i
                                        title="设置"
                                        class="iconfont iconshezhi"
                                        @click.stop="setRunSetting(scope.row.id)"
                                    ></i>
                                    <i
                                        title="删除"
                                        class="iconfont iconshanchu"
                                        @click.stop="deleteCase(scope.row.id)"
                                    ></i>
                                </drawerBtns>
                            </template>
                        </el-table-column>
                    </el-table>
                </transition>
            </body>

            <el-pagination
                v-model:currentPage="pagination.current_page"
                style="text-align: center"
                layout="total, prev, pager, next"
                :page-sizes="[10, 30, 50, 100]"
                :page-size="10"
                :total="pagination.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>

            <!--  开始创建脚本选择框 -->
            <rrDialog
                v-model:visible="dialogs.live.visible"
                :before-close="hideDialogs"
                title="新建脚本"
            >
                <div class="createHint">
                    <div @click="live">
                        <img src="/src/assets/svg/live.svg" alt="" />
                        <h3>录制脚本</h3>
                    </div>
                    <div @click="writer">
                        <img
                            style="transform: scale(0.9)"
                            class="size"
                            src="/src/assets/svg/edit.svg"
                            alt=""
                        />
                        <h3>编写脚本</h3>
                    </div>
                </div>
            </rrDialog>

            <!--  新建代码编辑框 -->
            <rrDialog
                v-model:visible="dialogs.createCode.visible"
                :before-close="hideDialogs"
                title="脚本编辑"
            >
                <codemirror :on-save="createCase" :script="dialogs.createCode.script"></codemirror>
            </rrDialog>

            <!--  代码编辑框 -->
            <rrDialog
                v-model:visible="dialogs.code.visible"
                :before-close="hideDialogs"
                title="脚本编辑"
            >
                <codemirror :on-save="editSave" :script="dialogs.code.script"></codemirror>
            </rrDialog>

            <!--  运行记录框 -->
            <rrDialog
                v-model:visible="dialogs.reports.visible"
                :before-close="hideDialogs"
                title="运行记录"
            >
                <el-table :data="dialogs.reports.data">
                    <el-table-column prop="created_date" label="执行时间" width="180">
                        <template #default="scope">
                            {{ formatTime(scope.row.modified_date) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template #default="scope">
                            <ul class="status">
                                <li v-if="scope.row.success">
                                    <i style="background-color: #67c23a"></i> <span>成功</span>
                                </li>
                                <li v-else>
                                    <i style="background-color: #f56c6c"></i> <span>失败</span>
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column prop="duration" label="耗时" width="100"> </el-table-column>
                    <el-table-column prop="msg" label="消息"> </el-table-column>
                    <el-table-column prop="divertor" label="断言"> </el-table-column>
                </el-table>
            </rrDialog>

            <!--  运行配置弹框 -->
            <rrDialog
                v-model:visible="dialogs.runConfig.visible"
                :before-close="hideDialogs"
                title="Run配置"
            >
                <form class="runConfig">
                    <el-alert
                        v-if="dialogs.runConfig.data.id === 0"
                        title="未检测到运行配置，当前配置必须保存后生效!"
                        type="success"
                    >
                    </el-alert>
                    <input
                        v-model="dialogs.runConfig.data.run_scene"
                        type="radio"
                        name="runScene"
                        :value="1"
                    />
                    本地
                    <input
                        v-model="dialogs.runConfig.data.run_scene"
                        type="radio"
                        name="runScene"
                        :value="2"
                    />
                    服务器

                    <p>无痕运行</p>
                    <el-switch
                        v-model="dialogs.runConfig.data.traceless"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    ></el-switch>

                    <p>环境清理</p>
                    <el-switch
                        v-model="dialogs.runConfig.data.clear"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    >
                    </el-switch>

                    <p>自动退出</p>
                    <el-switch
                        v-model="dialogs.runConfig.data.auto_exit"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    ></el-switch>

                    <p>cookies</p>
                    <textarea id="" name="" cols="30" rows="3"></textarea>
                    <div>
                        <button @click="changeConfig">保存</button>
                        <button @click="hideDialogs">取消</button>
                    </div>
                </form>
            </rrDialog>
        </div>
    </div>
</template>

<script lang="ts">
    import main from './main'
    export default main
</script>

<style lang="scss" scoped>
    @import './main.scss';
</style>
