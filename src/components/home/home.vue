<template>
    <div class="home">
        <main>
            <div class="mainBox" style="overflow: hidden; width: 100%">
                <Headline />
                <body style="flex: 1">
                    <router-view></router-view>
                </body>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
    import main from './main'
    export default main
</script>

<style lang="scss" scoped>
    @import './main.scss';
</style>
