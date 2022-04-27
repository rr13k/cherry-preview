import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    // 指定路由模式
    history: createWebHashHistory(),
    // 路由地址
    routes: [
        {
            path: '/',
            redirect: '/home/index'
        },
        {
            path: '/home',
            name: 'Index',
            redirect: '/home/index',
            component: () => import('@/components/home/home.vue'),
            children: [
                { path: 'index', component: () => import('@/views/case/case.vue') },
            ],
            meta: {
                ignoreLogin: true,
                title: 'cherry'
            }
        }
    ]
})

export default router
