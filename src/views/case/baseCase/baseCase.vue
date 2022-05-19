<template>
  <div class="casePage">
    <div class="case">
      <transition name="debut" appear>
        <header>
          <button class="cherryBtn" @click="createScript">录制脚本</button>
          <button class="empty cherryBtn" @click="createEmpty">
            创建空脚本
          </button>
        </header>
      </transition>
      <body>
        <transition name="debut" appear>
          <el-table
            :data="caseList"
            stripe
            height="100%"
            max-height="100%"
            class="case_table"
          >
            <el-table-column label="id" width="80px">
              <template #default="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="case">
              <template #default="scope">
                <fastInput
                  style="cursor: pointer"
                  @click="debug(scope.row)"
                  :id="scope.row.id"
                  :label="scope.row.name"
                  @change="changeName"
                ></fastInput>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <ul class="status">
                  <li v-if="scope.row.state == 0">
                    <i style="background-color: #909399"></i>
                    <span> 待测试</span>
                  </li>
                  <li v-if="scope.row.state == 1">
                    <i style="background-color: #e6a23c"></i>
                    <span> 运行中</span>
                  </li>
                  <li v-if="scope.row.state == 2">
                    <i style="background-color: #67c23a"></i>
                    <span> 成功</span>
                  </li>
                  <li v-if="scope.row.state == 3">
                    <i style="background-color: #f56c6c"></i>
                    <span> 失败</span>
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column prop="modified_date" label="创建时间" width="180">
              <template #default="scope">
                {{ formatTime(scope.row.createdDate) }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <i
                  title="调试"
                  class="iconfont iconbianji iconBtn"
                  @click.stop="debug(scope.row)"
                ></i>
                <drawerBtns
                  v-model:show-key="btnsKey"
                  :key-id="scope.row.id"
                  :change-show="setBtnsKey"
                >
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
        width="500px"
        title="录制配置"
      >
        <div class="createHint">
          <div>
            <el-form :model="dialogs.live" label-width="120px">
              <el-form-item label="用例名称">
                <el-input
                  v-model="dialogs.live.name"
                  maxlength="50"
                  placeholder="case name"
                  clearable
                />
              </el-form-item>
              <el-form-item label="网页地址">
                <el-input
                  v-model="dialogs.live.url"
                  placeholder="url"
                  clearable
                />
              </el-form-item>
              <el-form-item label="H5 mobile">
                <el-switch v-model="dialogs.live.h5" active-color="#f97e7e" />
              </el-form-item>
              <el-form-item label="设备型号" v-if="dialogs.live.h5">
                <el-select
                  v-model="dialogs.live.mobile"
                  filterable
                  placeholder="Select"
                >
                  <el-option
                    v-for="item in dialogs.live.moblieList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <button
                  class="cherryBtn cancel"
                  @click="dialogs.live.visible = false"
                >
                  Cancel
                </button>
                <button class="cherryBtn" @click="live">开始录制</button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </rrDialog>
    </div>
  </div>
</template>

<script lang="ts">
import main from "./main";
export default main;
</script>

<style lang="scss" scoped>
@import "./main.scss";
</style>
