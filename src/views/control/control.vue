<template>
  <div class="control">
    <main>
      <transition name="debut" appear>
        <div class="card">
          <header>
            <b>前置脚本</b>
          </header>
          <div>
            <div class="tagBox">
              <el-tag
                class="mx-1 tag"
                closable
                @click="preCode(_case)"
                @close="delteTag(_case)"
                v-for="(_case, index) in preCase"
                :key="_case.id"
              >
                {{ index + 1 + "." + _case.name }}
              </el-tag>
            </div>
            <div style="margin: 10px 5px">
              <el-autocomplete
                v-model="search"
                :fetch-suggestions="querySearchAsync"
                placeholder="添加前置脚本"
                @select="handleSelect"
                value-key="name"
              />
            </div>
          </div>
        </div>
      </transition>

      <transition name="debut" appear>
        <div class="card codeCard">
          <header>
            <b>Script</b>
            <button class="save" @click="save">Save Code</button>
          </header>
          <div class="codeIde">
            <Monaco
              :script="script"
              ref="monaco"
              @save="save"
              language="javascript"
            />
          </div>
          <div class="btns">
            <button @click="run">运行</button>
            <button class="cancel" @click="exit">退出</button>
          </div>
        </div>
      </transition>
    </main>

    <transition name="debut" appear>
      <aside>
        <div class="card">
          <header>
            <b>O/P Console</b>
            <!-- 收起按钮 -->
            <!-- <button><i class="iconfont iconhome"></i></button> -->
          </header>
          <div class="log-editor-container">
            <Monaco
              :script="log"
              ref="log"
              id="log"
              language="apex"
              :config="logConfig"
            />
          </div>
        </div>
      </aside>
    </transition>

    <!-- 脚本预览窗口 -->
    <rrDialog
      v-model:visible="dialogs.preCode.visible"
      :before-close="hideDialogs"
      :title="'脚本: ' + dialogs.preCode.name"
    >
      <div class="precode">
        <Monaco
          :script="dialogs.preCode.script"
          ref="pre"
          id="pre"
          language="javascript"
          :config="logConfig"
        />
      </div>
    </rrDialog>
  </div>
</template>

<script lang='ts'>
import main from "./main";
export default main;
</script>

<style lang='scss' scoped>
@import "./main.scss";
</style>