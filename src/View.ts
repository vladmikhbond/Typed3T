import Model from "./Model.js";
import Point from "./Point.js";

export default class View 
{
    private model: Model;
    private ctx: CanvasRenderingContext2D;

    constructor(model: Model, canvas: HTMLCanvasElement) {
        this.model = model;
        this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d')!;
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = model.size/50;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.clearCanvas();
        
    }
    
    clearCanvas()
    {
        this.ctx.clearRect(0, 0, this.model.size,  this.model.size);
    }

    drawLine(p1: Point, p2: Point)
    {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }

    drawWin(win: number[], fi: number = 0, centers: Point[] = [])
    {
        this.clearCanvas();
        for (let i = 0; i < 10; i++) 
        {
            this.ctx.save();
            let idx = win.indexOf(i);
            if ( idx == -1) {
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = this.model.size / 50;
            } else {
                // rotation
                if (fi) {
                    let c = centers[i];
                    this.ctx.translate(c.x, c.y);
                    this.ctx.rotate(fi);
                    this.ctx.translate(-c.x, -c.y);
                }
                this.ctx.strokeStyle = "red";
                this.ctx.lineWidth = this.model.size / 50;
            }

            for (let j in this.model.store[i]) {
                let track = this.model.store[i][j];
                this.ctx.beginPath();
                let p = track.points[0]
                this.ctx.moveTo(p.x, p.y);
                for (let k = 1; k < track.points.length; k++) {
                    p = track.points[k];
                    this.ctx.lineTo(p.x, p.y);
                }
                this.ctx.stroke();
            }
            this.ctx.restore();
        }
    }

    dance(win: number[], who: string) 
    {
        const audioX = <HTMLAudioElement>document.getElementById('audioX')!;
        const audioO = <HTMLAudioElement>document.getElementById('audioO')!;
        
        // dance at 1 sec after win    
        setTimeout(async () => {
            // geometry centers
            let centers: Point[] = [];
            for (let i = 0; i < win.length; i++)
                centers[win[i]] = this.model.getCellGravityCenter(win[i]);

            let fi = 0, dfi = Math.PI / 10;
            let timer: number;
            
            //  play music
            let audio = who == 'X' ? audioX : audioO;

            audio.onended = function () {
                clearInterval(timer);
            };

            await audio.play();

            // wolts
            timer = setInterval(() => {
                this.drawWin(win, fi, centers);
                fi += dfi;
            }, 50);
        }, 1000);

    }    

}
