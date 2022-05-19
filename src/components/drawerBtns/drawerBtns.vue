<template>
    <div @click.stop="open"  ref="box" class="set " :class="show ? 'show' : ''">
        <i class='iconfont icongengduo'></i>
        <slot>
        </slot>
    </div>
</template>

<script lang='ts'>
    import main from './main'
    export default main
</script>

<style lang='scss' scoped>
    @import './main.scss';
</style>

<style lang='scss'>
    @import './global.scss';
</style>