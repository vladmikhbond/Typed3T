import Point from './Point.js';

import Model from './Model.js'

export default class Trace 
{
    points: Point[] = [];
    model: Model | null = null;

    addPoint(p: Point) {
        this.points.push(p);
    }

    center() {
        let c = new Point();
        for (let p of this.points) {
            c.x += p.x;
            c.y += p.y;
        }
        c.x /= this.points.length;
        c.y /= this.points.length;
        return c;
    }

    len() {
        let sum = 0;
        for (let i = 1; i < this.points.length; i++)
            sum += this.points[i - 1.].distTo(this.points[i]);
        return sum;
    }

    size() {
        let minX = this.points[0].x, maxX = minX;
        let minY = this.points[0].y, maxY = minY;

        for (let p of this.points) {
            if (minX > p.x) minX = p.x;
            if (maxX < p.x) maxX = p.x;
            if (minY > p.y) minY = p.y;
            if (maxY < p.y) maxY = p.y;
        }
        return Math.max(maxX - minX, maxY - minY) ;
    }

    get isClosed() {
        return this.points[0].distTo(this.points[this.points.length - 1])  <  this.model!.size / 10;
    }
}




