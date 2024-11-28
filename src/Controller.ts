import Point from "./Point.js";
import Trace from "./Trace.js";
import Model from "./Model.js";
import View from "./View.js";

export default class Controller {
    private mousePos: Point | null = null;
    private lastPos: Point | null = null;
    private mouseDown = 0;
    private trace: Trace | null = null;
    private canvas: HTMLCanvasElement;
    private model: Model;
    private view: View;

    constructor(model: Model, view: View, canvas: HTMLCanvasElement) {
        this.model = model;
        this.view = view;
        this.canvas = canvas;
        this.addListeners();
    }

    removeListeners() {
        this.canvas.onmousedown = this.canvas.ontouchstart = 
        this.canvas.onmousemove = this.canvas.ontouchmove = 
        this.canvas.onmouseup = this.canvas.ontouchend = null;
    }

    addListeners() {

        this.canvas.onclick = () => {            
            this.view.audioX.muted = false;
            this.view.audioO.muted = false;   
        };      


        this.canvas.onmousedown = this.canvas.ontouchstart = (e: Event) => {
            this.lastPos = Controller.getMousePos(e)!;
            if (this.lastPos) {
                this.mouseDown = 1;
                this.trace = new Trace();
                this.trace.addPoint(this.lastPos);
            }
        };

        this.canvas.onmousemove = this.canvas.ontouchmove = (e: Event) => {
            this.mousePos = Controller.getMousePos(e)!;
            if (this.mouseDown == 1) {
                this.view.drawLine(this.lastPos!, this.mousePos);
                this.trace!.addPoint(this.mousePos);
                this.lastPos = this.mousePos;
            }
            e.preventDefault();
        };

        this.canvas.onmouseup = this.canvas.ontouchend = () => {
            if (this.mouseDown) {
                this.mouseDown = 0;
                this.model.addTrace(this.trace!);
                let [win, who] = this.model.whoWin();
                this.view.drawWin(win);
                if (win.length == 3) {
                    this.removeListeners();
                    this.view.dance(win, who);
                }
            }
            
        };

    }

    static getMousePos(e: Event) {
        if (e instanceof MouseEvent) {
            return new Point(e.offsetX, e.offsetY);
        }
        else if (e instanceof TouchEvent) {
            return new Point(e.touches[0].clientX, e.touches[0].clientY);
        }
    }

}

