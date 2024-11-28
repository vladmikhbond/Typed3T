import Controller from "./Controller.js";
import Model from "./Model.js";
import View from "./View.js";


    let model = new Model(Math.min(window.innerWidth, window.innerHeight));
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    canvas.width = canvas.height = model.size;
    const view = new View(model, canvas);
    new Controller(model, view, canvas);






