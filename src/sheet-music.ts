
class SheetMusic {

    static openSVG(svg: SVGSVGElement): SheetMusicSVG {
        return new SheetMusicSVG(svg);
    }
}

class SheetMusicSVG {
    paths: SVGPathElement[]
    sz: PointXY

    constructor(svg: SVGSVGElement) {
        this.sz = {x: +svg.getAttribute('width'),
                   y: +svg.getAttribute('height')};

        this.paths = [...(function*() {
            for (let c of [...<any>svg.children])
                for (let el of c.tagName === 'path' ? 
                        SheetMusicSVG.splitPath(c as SVGPathElement) : [c])
                    yield el;
        })()]
    }

    onto(container: SVGElement) {
        container.innerHTML = '';
        for (let el of this.paths)
            container.append(el);
        return this;
    }

    private static *splitPath(p: SVGPathElement) {
        let d = p.getAttribute('d')!;
        for (let piece of d.split('M')) {
            if (piece) {
                let pc = p.cloneNode() as SVGPathElement;
                pc.setAttribute('d', 'M' + piece);
                yield pc;
            }
        }
    }
}


type PointXY = {x: number, y: number};


export { SheetMusic, SheetMusicSVG, PointXY }