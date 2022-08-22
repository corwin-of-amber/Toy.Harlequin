import Vue from 'vue';

import { Music } from './music';
import { QwertyKeyboard, Bar, REEL } from './keyboard';

// @ts-ignore
import App from './components/app.vue';

interface AppProps {
    cassette: Bar.Entries
}

async function main() {
    let app = Vue.createApp(App).mount(document.body) as Vue.ComponentPublicInstance & AppProps;

    let music = new Music,
        keyboard = new QwertyKeyboard;

    let curBar = {index: 0, data: REEL[0]};
    function goto(i: number) {
        i = Math.max(0, Math.min(REEL.length - 1, i));
        curBar = {index: i, data: REEL[i]};
        setBar(curBar.data);
    }
    function setBar(bar: Bar.Data) {
        app.cassette = Bar.entries(bar);
        keyboard.setBar(bar);
    }

    goto(0);

    keyboard.on('noteon', ev => music.playNote(ev.note, ev.vel));
    keyboard.on('noteoff', ev => music.stopNote(ev.note));
    keyboard.on('nav:forward', ev => goto(curBar.index + 1));
    keyboard.on('nav:backward', ev => goto(curBar.index - 1));

    Object.assign(window, {app, music, keyboard});
}


document.addEventListener('DOMContentLoaded', main);