import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monacoEditorPlugin from "vite-plugin-monaco-editor"
import path from 'path'

const resolve = (dir: string) => path.join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  base:"/cherry-preview",
  plugins: [vue(),monacoEditorPlugin({
    publicPath: 'cherry-preview/monacoeditorwork'
  })],
  resolve: {
    alias: {
        '@': resolve('src'),
    },
},
})
