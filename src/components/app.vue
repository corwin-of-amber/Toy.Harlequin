<template>
    <div id="app">
        <div class="cassette">
            <div class="role" v-for="v,k in cassette">
                <span>{{k}}</span>
                <span v-for="key in v">
                  <span class="box">{{key[0]}}</span>
                  <span class="note">{{key[1]}}</span>
                </span>
            </div>
        </div>
        <sheet/>
        <div class="drawer drawer--bottom" :class="{open: clef}">
            <img src="/img/clef-diagram.png"/>
        </div>
    </div>
</template>

<script>
import Sheet from './sheet.vue';

export default {
    data: () => ({cassette: {'left hand': []}, clef: true}),
    components: { Sheet }
}
</script>

<style scoped>
img { width: 100%; }
span.box {
    display: inline-block;
    border: 1px solid black;
    margin: 2px .3em;
    padding: 0 .1em;
    text-transform: capitalize;
}
.drawer--bottom {
    position: fixed;
    bottom: 0;
    border-top: 1px solid #888;
}
.drawer:not(.open) {
    visibility: hidden;
}
</style>