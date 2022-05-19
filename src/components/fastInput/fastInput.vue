<template>
    <transition name='debut'>
        <div>
            <div v-if="show" class="fastLabel">
                <i class="iconfont iconlightning-01" @click.stop="startEdit"></i>
                <span @click.stop="click">{{label}}</span>
            </div>
            <div v-else class="fastInput">
                <input type="text" v-model="newLabel"
                id="setItemRef"
                @keyup.enter="submit"
                @keyup.esc="cancel"
                @blur="blur"
                />
                <i class="iconfont iconsuccess_no_circle" @click.stop="submit" ></i>
            </div>
        </div>
    </transition>
</template>

<script lang='ts'>
    import main from './main'
    export default main
</script>

<style lang='scss' scoped>
    @import './main.scss';
</style>