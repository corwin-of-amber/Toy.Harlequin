<template>
    <svg class="sheet-music" :viewBox="`0 0 ${svgSz.x} ${svgSz.y}`">
        <g ref="notesLayer" v-once></g>
    </svg>
</template>

<script lang="ts">
import { SheetMusic, SheetMusicSVG } from '../sheet-music';

export default {
    data: () => ({svgSz: {x: 800, y: 600}}),
    mounted() {
        this.loadURI('/data/sheet-music/yiruma-when-the-love-falls-p1.svg')
    },
    methods: {
        async loadURI(uri: string) {
            let svgText = await (await fetch(uri)).text(),
                svgContent = new DOMParser().parseFromString(svgText, 'image/svg+xml'),
                svg = svgContent.querySelector('svg');

            if (!svg) throw new Error('svg element missing');

            let sheetMusic = SheetMusic.openSVG(svg).onto(this.$refs.notesLayer);
            this.svgSz = sheetMusic.sz;
        }
    }
}
</script>