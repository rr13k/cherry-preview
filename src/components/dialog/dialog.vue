<template>
    <transition name='debut'>
        <div class='dialog__wrapper' v-if='visible'>
            <div
            :style='style'
            class='dialog'
            >
            <header>
                <slot name='title'>
                    <h4>{{title}}</h4>
                </slot>
                <button @click="handleClose">
                    <i class="close"></i>
                </button>
            </header>
            <body>
                <slot>
                </slot>
            </body>
            <footer>
    
            </footer>

            </div>

        </div>
    </transition>
</template>

<script lang='ts'>
    import main from './main.ts'
    export default main
</script>

<style lang='scss' scoped>
    @import './main.scss';
</style>