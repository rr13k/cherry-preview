<template>
    <div class='head'>
        <!-- <transition name='debut' appear>
            <i class='menu iconfont iconmenu' @click='sidebarTurn'></i>
        </transition> -->
        <transition name='debut' appear>
            <div class='user'>
                hello, <span>{{name}}</span>
                <img src="/user.jpeg">
            </div>
        </transition>
        <transition name='debut' appear>
            <i class='hint iconfont icon_tishi' ></i>
        </transition>
    </div>
</template>

<script lang='ts'>
    import main from './main'
    export default main
</script>

<style lang='scss' scoped>
    @import './main.scss';
</style>