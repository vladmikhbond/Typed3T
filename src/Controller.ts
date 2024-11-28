import Point from "./Point.js";
import Trace from "./Trace.js";
import Model from "./Model.js";
import View from "./View.js";

export default class Controller 
{
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


    addListeners() {
        // React to mouse events on the canvas, and mouseup on the entire document
        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            this.lastPos = Controller.getMousePos(e)!;
            if (this.lastPos) {
                this.mouseDown = 1;
                this.trace = new Trace();
                this.trace.addPoint(this.lastPos);
            }
    
        }, false);

        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            this.mousePos = Controller.getMousePos(e)!;
            if (this.mouseDown == 1) {
                this.view.drawLine(this.lastPos!, this.mousePos);
                this.trace!.addPoint(this.mousePos);
                this.lastPos = this.mousePos;
            }
        }, false);

        window.addEventListener('mouseup', (e: MouseEvent) => {
            if (this.mouseDown) {
                this.mouseDown = 0;
                // new game
                if (this.trace!.len() > this.model.size * 2) {
                    // refresh();    /////////////////////////////////////
                }
                else {
                    this.model.addTrace(this.trace!);
                    let [win, who] = this.model.whoWin();          
                    this.view.drawWin(win);
                    if (win.length == 3) {
                        //removeListeners();
                        this.view.dance(win, who);
                    }
                }
            }
    

        }, false);                /// ???

        // React to touch events on the canvas
        // this.canvas.addEventListener('touchstart', sketchpad_touchStart, false);
        // this.canvas.addEventListener('touchmove', sketchpad_touchMove, false);
        // this.canvas.addEventListener('touchend', sketchpad_mouseUp, false);
    }




    // removeListeners() {
    //     // React to mouse events on the canvas, and mouseup on the entire document
    //     this.canvas.removeEventListener('mousedown', sketchpad_mouseDown, false);
    //     this.canvas.removeEventListener('mousemove', sketchpad_mouseMove, false);
    //     window.removeEventListener('mouseup', sketchpad_mouseUp, false);

    //     // React to touch events on the canvas
    //     this.canvas.removeEventListener('touchstart', sketchpad_touchStart, false);
    //     this.canvas.removeEventListener('touchmove', sketchpad_touchMove, false);
    //     this.canvas.removeEventListener('touchend', sketchpad_mouseUp, false);
    // }

    static getMousePos(e: MouseEvent | TouchEvent) {


        if (e instanceof MouseEvent) {
            return new Point(e.offsetX, e.offsetY);
        }
        else  {
            return new Point(e.touches[0].clientX, e.touches[0].clientY);
        } 
    }

    static getTouchPos(e: TouchEvent ) {

        if (e.touches) {
            if (e.touches.length == 1) { // Only deal with one finger
                let touch = e.touches[0]; // Get the information for finger #1
                return new Point(touch.clientX, touch.clientY);
            }
        }
        return null;
    }

    //---------------------------------------------

    // function sketchpad_mouseDown(e) {
    //     lastPos = getMousePos(e);
    //     if (lastPos) {
    //         mouseDown = 1;
    //         trace = new Trace();
    //         trace.addPoint(lastPos);
    //     }

    // }

    // function sketchpad_touchStart() {
    //     // Update the touch co-ordinates
    //     lastPos = getTouchPos();
    //     if (lastPos) {
    //         mouseDown = 1;
    //         trace = new Trace();
    //         trace.addPoint(lastPos);
    //     }
    //     event.preventDefault();
    // }

    //-------------------------------------

    // function sketchpad_mouseMove(e) {
    //     mousePos = getMousePos(e);
    //     if (mouseDown == 1) {
    //         view.drawLine(lastPos, mousePos);
    //         trace.addPoint(mousePos);
    //         lastPos = mousePos;
    //     }
    // }

    // function sketchpad_touchMove(e) {
    //     mousePos = getTouchPos(e);

    //     if (mouseDown == 1) {
    //         view.drawLine(lastPos, mousePos);
    //         trace.addPoint(mousePos);
    //         lastPos = mousePos;
    //     }
    //     event.preventDefault();
    // }

    //----------------------------------------------


    // function sketchpad_mouseUp() {
    //     if (mouseDown) {
    //         mouseDown = 0;
    //         // new game
    //         if (trace.len() > model.size * 2) {
    //             refresh();
    //         }
    //         else {
    //             model.addTrace(trace);
    //             var w = model.whoWin();          
    //             view.drawWin(w);
    //             if (w.length == 3) {
    //                 removeListeners();
    //                 view.dance(w);
    //             }
    //         }
    //     }
    // }

}

