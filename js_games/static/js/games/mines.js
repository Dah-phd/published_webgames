class mine_field {
    constructor() {
    }
    set() {
        this.alive = true;
        this.field = this._make_field();
        this._bombs_away();
        this._add_numbers();
        this.bombs = 99;
        this.log = [];
    }
    boom() {
        this.alive = false;
        for (let row = 0; row < 16; row++) {
            for (let cell = 0; cell < 30; cell++) {
                if (this.field[row][cell][0] == 'M') {
                    this.field[row][cell] = ['M', 1, 0]
                }
            }
        }
    }
    ifwin() {
        let row, cell;
        for (row = 0; row < 16; row++) {
            for (cell = 0; cell < 30; cell++) {
                if (this.field[row][cell][0] != 'M' && this.field[row][cell][1] == 0) { return }
            }
        }
        return true

    }
    lock(row, cell) {
        if (this.field[row][cell][1] == 0) {
            if (this.field[row][cell][2] == 1) {
                this.field[row][cell] = [this.field[row][cell][0], 0, 0];
                this.bombs += 1;
            } else {
                this.field[row][cell] = [this.field[row][cell][0], 0, 1];
                this.bombs -= 1;
            }
        }
    }
    getcurrent() {
        let now_field = [];
        for (let row = 0; row < 16; row++) {
            now_field.push([]);
            for (let cell = 0; cell < 30; cell++) {
                if (this.field[row][cell][1] == 1) {
                    now_field[row].push(this.field[row][cell][0])
                } else {
                    now_field[row].push(0)
                }
            }
        }
        return now_field
    }
    onclick(row, cell, limit = false) {
        if (this.alive) {
            if (this.field[row][cell][1] == 0 && this.field[row][cell][2] == 0) {
                this.field[row][cell] = [this.field[row][cell][0], 1, 0];
                this.log.push([row, cell, new Date().getTime()]);
                if (this.field[row][cell][0] == 'M') {
                    this.boom()
                } else if (this.field[row][cell][0] == 0) { this._massclick(row, cell) }
            } else if (this.field[row][cell][1] == 1 && this.field[row][cell][0] != 0 && limit == false) {
                let locked = this._counter(row, cell, 2, 1);
                if (locked == this.field[row][cell][0]) {
                    if (this._counter(row, cell, 1, 0) - locked > 0) {
                        this._massclick(row, cell, limit = true)
                    }
                }
            }
        }
    }
    _massclick(row, cell, limit = false) {
        if (row != 0) { this.onclick(row - 1, cell, limit) };
        if (row != 15) { this.onclick(row + 1, cell, limit) };
        if (cell != 0) { this.onclick(row, cell - 1, limit) };
        if (cell != 29) { this.onclick(row, cell + 1, limit) };
        if (row != 0 && cell != 0) { this.onclick(row - 1, cell - 1, limit) };
        if (row != 15 && cell != 0) { this.onclick(row + 1, cell - 1, limit) };
        if (row != 0 && cell != 29) { this.onclick(row - 1, cell + 1, limit) };
        if (row != 15 && cell != 29) { this.onclick(row + 1, cell + 1, limit) }
    }

    _make_field() {
        var field = [];
        for (let row = 0; row < 16; row++) {
            field.push([])
            for (let cell = 0; cell < 30; cell++) {
                field[row].push([0, 0, 0])
            }
        }
        return field
    }
    _bombs_away() {
        let n = 99;
        while (n > 0) {
            let row = this._rand(16);
            let col = this._rand(30);
            if (this.field[row][col][0] == 0) {
                this.field[row][col] = ['M', 0, 0];
                n -= 1
            }
        }
    }
    _add_numbers() {
        for (let row = 0; row < 16; row++) {
            for (let cell = 0; cell < 30; cell++) {
                if (this.field[row][cell][0] == 0) {
                    this.field[row][cell] = [this._counter(row, cell), 0, 0]
                }
            }
        }
    }
    _rand(max) {
        return Math.floor(Math.random() * max)
    }
    prt() {
        console.log(this.field)
    }
    _counter(row, cell, location = 0, value = 'M') {
        let count = 0;
        if (row != 0 && this.field[row - 1][cell][location] == value) { count += 1 };
        if (row != 15 && this.field[row + 1][cell][location] == value) { count += 1 };
        if (cell != 0 && this.field[row][cell - 1][location] == value) { count += 1 };
        if (cell != 29 && this.field[row][cell + 1][location] == value) { count += 1 };
        if (row != 0 && cell != 0 && this.field[row - 1][cell - 1][location] == value) { count += 1 };
        if (row != 15 && cell != 0 && this.field[row + 1][cell - 1][location] == value) { count += 1 };
        if (row != 0 && cell != 29 && this.field[row - 1][cell + 1][location] == value) { count += 1 };
        if (row != 15 && cell != 29 && this.field[row + 1][cell + 1][location] == value) { count += 1 };
        return count
    }
}
class minesweeper {
    constructor(field, score_board) {
        this.grid = document.getElementById(field);
        this.cvs = this.grid.getContext('2d');
        this.game = new mine_field();
        this.game.set();
        this.timer = document.getElementById(score_board);
        this.timer.innerHTML = '0:00';
        this.timer.style.color = 'black';
        this.grid.height = 640;
        this.grid.width = 1200;
        this.grid.style.display = 'block';
        this.score = 0;
        this.boxes();
        this.time_it();
        window.self = this;
        this.handler = function (e) { window.self.getposition(e) };
        this.grid.addEventListener('mousedown', this.handler);
    }
    boxes() {
        this.cvs.clearRect(0, 0, this.grid.width, this.grid.height)
        for (let row = 0; row < 16; row++) {
            for (let cell = 0; cell < 30; cell++) {
                if (this.game.field[row][cell][1] == 0) {
                    if (this.game.field[row][cell][2] == 1) { this.cvs.fillStyle = 'green' }
                    else { this.cvs.fillStyle = '#212529' }
                    this.cvs.fillRect(40 * cell, 40 * row, 39, 39)
                }
                else {
                    this.cvs.font = '30px Bold Courier New'
                    let value = this.game.field[row][cell][0]
                    if (value == 0) { continue }
                    else if (value == 'M') { value = '🔥'; this.cvs.fillStyle = 'red'; this.cvs.fillText(value, 40 * cell, 40 * row + 30); continue }
                    else if (value == 1) { this.cvs.fillStyle = 'green' }
                    else if (value == 2) { this.cvs.fillStyle = 'blue' }
                    else if (value == 3) { this.cvs.fillStyle = 'red' }
                    else { this.cvs.fillStyle = 'black' }
                    this.cvs.fillText(value, 40 * cell + 10, 40 * row + 30)
                }
            }
        }

    }
    sec_str() {
        let s, m;
        s = this.score % 60;
        if (s < 10) { s = '0' + s.toString() } else { s = s.toString() }
        m = Math.floor(this.score / 60);
        return m.toString() + ':' + s + " | " + this.game.bombs.toString()
    }
    time_it() {
        this.start = new Date().getTime();
        this.fps = setInterval(() => {
            this.score = Math.round((new Date().getTime() - this.start) / 1000);
            this.timer.innerHTML = this.sec_str();
        }, 1000)
    }
    kill(command = 0) {
        clearInterval(this.fps);
        console.log(this.game.log);
        this.grid.removeEventListener('mousedown', this.handler);
        this.timer.style.color = 'red';
        this.timer.innerHTML = "GAME OVER!!!";
    }
    getposition(event) {
        let cell = Math.floor(event.layerX / 40);
        let row = Math.floor(event.layerY / 40);
        if (event.which == 1) {
            this.game.onclick(row, cell);
            if (this.game.ifwin()) {
                clearInterval(this.fps);
                this.timer.style.color = 'green';
                this.timer.innerHTML = 'YOU WON with time of ' + this.sec_str();
                send_score(this.score, this.game.log, 'minesweeper');
            };
            if (!this.game.alive) { this.kill() }
        }
        else if (event.which == 3) { this.game.lock(row, cell) }
        this.boxes()

    }
}
