import Trace from "./Trace.js";
import Point from './Point.js';

export default class Model 
{
    store: Trace[][] = [[], [], [], [], [], [], [], [], [], [],];   // last item for long lines
    field = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ];
    size: number;

    constructor(size: number) {
        this.size = size;
    }

    count(char: string) {
        return this.field.filter(cell => cell === char).length;
    }

    addTrace(trace: Trace)
    {
        trace.model = this;

        if (trace.size() > this.size / 2) {
            // grid line
            this.store[9].push(trace);
            return;
        }

        // define row and column
        let c = trace.center();
        let col = c.x / this.size * 3 | 0;
        let row = c.y / this.size * 3 | 0;
        let idx = row * 3 + col;

        //
        let v = trace.value();
        switch (this.field[idx]) {
            case ' ':
                if (v == 'O' && this.count('O') + 1 == this.count('X')) {
                    this.field[idx] = 'O';
                    this.store[idx].push(trace);
                } else if (v == 'I' && this.count('O') == this.count('X') && this.count('I') == 0) {
                    this.field[idx] = 'I';
                    this.store[idx].push(trace);
                }
                break;
            case 'I':
                if (v == 'I' && this.count('O') == this.count('X') && this.count('I') == 1) {
                    this.field[idx] = 'X';
                    this.store[idx].push(trace);
                }
                break;
        }
    
    }

    // returns array of 3 indexes & who win
    // returns [] if no winner yet
    whoWin(): [number[], string]
    {
        let f = this.field;
        let m = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6], ];

        for (let i = 0; i < 8; i++) {
            let a = m[i][0], b = m[i][1], c = m[i][2];

            if (f[a] == f[b] && f[b] == f[c] && (f[c] == 'O' || f[c] == 'X')) 
                return [m[i], f[c]];
        }
        return [[], ' '];
    }

    cellCenter(idx: number) {
        let c = new Point (), n = 0;
        for (let j in this.store[idx])
        {
            var trace = this.store[idx][j];
            for (let point of trace.points)
            {
                c.x += point.x;
                c.y += point.y;
            }
            n += trace.points.length;
        }
        c.x /= n;
        c.y /= n;
        return c;
    }
}
