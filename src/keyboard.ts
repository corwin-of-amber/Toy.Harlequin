import { EventEmitter } from 'events';
import _ from 'lodash';


class QwertyKeyboard extends EventEmitter {
    velocity: number
    keymap: {[code: string]: string} = {}
    held: {[code: string]: string} = {}

    constructor() {
        super();
        window.addEventListener('keydown', ev => this.onKeyDown(ev), {capture: true});
        window.addEventListener('keyup', ev => this.onKeyUp(ev), {capture: true});
        this.velocity = 100;
    }

    setBar(bar: Bar.Data) {
        this.keymap = Bar.toKeymap(bar);
    }

    onKeyDown(ev: KeyboardEvent) {
        let action = ACTION_KEYS[ev.code];
        if (action) {
            action(this); ev.preventDefault();
        }
        else if (!ev.repeat) {
            let k = this.keymap[ev.key];
            if (k) {
                this.held[ev.code] = k;
                this.emit('noteon', {note: k, vel: this.velocity});
            }
        }
        console.log(ev.code, ev.key);
    }

    onKeyUp(ev: KeyboardEvent) {
        let k = this.held[ev.code];
        if (k) {
            this.emit('noteoff', {note: k});
        }
    }
}


class Bar {

    static entries(data: Bar.Data) {
        return Object.fromEntries(Object.entries(data)
            .map(([k, n]) => [k, Bar.roleEntries(n)]));
    }

    static roleEntries([keys, notes]: [string, string]) {
        return _.zip([...keys], notes.split(/\s+/));
    }

    static toKeymap(data: Bar.Data) {
        return Object.fromEntries([].concat(...
            Object.values(data).map(kn => Bar.roleEntries(kn))
        ));
    }
}

namespace Bar {
    export type Data = {[roleName: string]: [string, string]};

    export type Entries = {[roleName: string]: [string, string][]};
}

const REEL = [
    {
        'right hand': ['klbnm', 'C5 D5 F4 G4 B4'],
        'left hand': ['asdzxc', 'C3 G3 D#4  D3 G3 D4']
    },
    {
        'right hand': ['bhjkl', 'G4 A#4 C5 D#5 G5'],
        'left hand': ['asdzxc', 'D#3 C4 D#4  E3 A#3 E4']
    },
    {
        'right hand': ['lkjhbnm,', 'G#5 G5 F5 D#5 G#4 D#4 G4 C5'],
    },
    {
        'right hand': ['nm,bk', 'F4 G#4 C5 C4 B4']
    }
] as Bar.Data[]

const ACTION_KEYS = {
    'Space': t => t.emit('nav:forward'),
    'ArrowRight': t => t.emit('nav:forward'),
    'ArrowLeft': t => t.emit('nav:backward')
} as {
    [l: string]: (t: QwertyKeyboard) => {}
};


export { QwertyKeyboard, Bar, REEL }