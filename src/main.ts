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
    ElAutocomplete,
    ElTag,
    ElTable,
    ElTableColumn,
    ElTabs,
    ElTabPane
} from 'element-plus'

const app = createApp(App);
app
.use(ElMessageBox)
.use(ElSwitch)
.use(ElAlert)
.use(ElSelect)
.use(ElAutocomplete)
.use(ElTag)
.use(ElPagination)
.use(ElTable)
.use(ElTableColumn)
.use(ElTabs)
.use(ElTabPane)
.use(router)
.mount('#app')