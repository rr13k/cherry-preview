<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
  import Home from './components/home/home.vue'
</script>

<template>
  <Home  />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

:root{
  --cherry-border-color: #f97e7e;
}

.el-input {
  --el-input-focus-border-color: var(--cherry-border-color) !important;
}

.el-select {
  --el-select-input-focus-border-color: var(--cherry-border-color) !important;
}

.el-button--primary {
    --el-button-bg-color: #f97e7e !important;
    --el-button-active-bg-color: #f97e7e !important;
    --el-button-hover-bg-color: red !important;
    --el-button-border-color: #dcdfe6 !important;
    --el-button-hover-border-color: #dcdfe6 !important;
}
</style>
