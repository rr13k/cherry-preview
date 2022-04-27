import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import 'element-plus/dist/index.css'
import {
    ElMessageBox,
    ElSwitch,
    ElAlert,
    ElSelect,
    ElPagination,
    ElTable,
    ElTableColumn,
    ElTabs,
    ElTabPane
} from 'element-plus'


createApp(App)
.use(ElMessageBox)
.use(ElSwitch)
.use(ElAlert)
.use(ElSelect)
.use(ElPagination)
.use(ElTable)
.use(ElTableColumn)
.use(ElTabs)
.use(ElTabPane)
.use(router)

.mount('#app')