export default class Point {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y 
    }

    distTo(p: Point) {
        let dx = p.x - this.x,
            dy = p.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
}