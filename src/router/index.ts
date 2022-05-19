import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    // 指定路由模式
    history: createWebHashHistory(),
    // 路由地址
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/views/case/case.vue'),
        },
        {
            path: '/control/:id',
            name:"control",
            component: () => import('@/views/control/control.vue') 
        }
    ]
})

export default router
