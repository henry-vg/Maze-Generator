let cellSize = [20, 20];
let cellsNum = [10, 10];
let grid = [];

let currentCell;
let begginingCell;
let endingCell;

let stack = [];

let solveCells = [];

let reachedEnd = false;
let reachedBegin = false;

function setup() {
    createCanvas(windowWidth, windowHeight);

    for (let j = 0; j < cellsNum[1]; j++) {
        for (let i = 0; i < cellsNum[0]; i++) {
            grid.push(new Cell(i, j));
        }
    }

    begginingCell = grid[index(floor(random(cellsNum[0])), 0)];
    endingCell = grid[index(floor(random(cellsNum[0])), cellsNum[1] - 1)];

    begginingCell.walls[0] = false;
    endingCell.walls[2] = false;

    currentCell = begginingCell;
}

function draw() {
    if (reachedBegin) {
        noLoop();
        print('DONE.');
    }

    background(255);

    translate((width - (cellSize[0] * cellsNum[0])) / 2, (height - (cellSize[1] * cellsNum[1])) / 2);

    for (let i = 0; i < grid.length; i++) {
        grid[i].show(!reachedBegin);
    }

    currentCell.visited = true;
    if (!reachedBegin) {
        currentCell.highlight();
    }

    let nextCell = currentCell.checkNeighbors();

    if (currentCell == endingCell) {
        solveCells.push(currentCell);
        reachedEnd = true;
    }

    if (nextCell) {
        if (!reachedEnd) {
            solveCells.push(currentCell);
        }
        nextCell.visited = true;

        stack.push(currentCell);

        removeWalls(currentCell, nextCell);

        currentCell = nextCell;
    }
    else if (stack.length > 0) {
        if (!reachedEnd) {
            solveCells.pop();
        }
        currentCell = stack.pop();
    }
    else {
        removeRepeatedWalls();
        reachedBegin = true;
    }
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.highlight = function () {
        noStroke();
        fill(0, 0, 255, 200);
        rect(i * cellSize[0], j * cellSize[1], cellSize[0], cellSize[1]);
    }

    this.checkNeighbors = function () {
        let neighbors = [];

        const toCheck = [grid[index(i, j - 1)], grid[index(i + 1, j)], grid[index(i, j + 1)], grid[index(i - 1, j)]]; //top, right, bottom, left

        for (let k = 0; k < toCheck.length; k++) {
            if (toCheck[k] && !toCheck[k].visited) {
                neighbors.push(toCheck[k]);
            }
        }

        if (neighbors.length > 0) {
            return random(neighbors);
        }
        else {
            return undefined;
        }
    }

    this.show = function (fillVisited) {
        let x = this.i * cellSize[0];
        let y = this.j * cellSize[1];

        stroke(0);
        strokeWeight(3);
        noFill();

        if (this.walls[0]) {
            line(x, y, x + cellSize[0], y); //top
        }
        if (this.walls[1]) {
            line(x + cellSize[0], y, x + cellSize[0], y + cellSize[1]); //right
        }
        if (this.walls[2]) {
            line(x, y + cellSize[1], x + cellSize[0], y + cellSize[1]); //bottom
        }
        if (this.walls[3]) {
            line(x, y, x, y + cellSize[1]); //left
        }

        if (this.visited && fillVisited) {
            noStroke();
            fill(0, 50);
            rect(x, y, cellSize[0], cellSize[1]);
        }
    }
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cellsNum[0] - 1 || j > cellsNum[1] - 1) {
        return -1; //as an array index, it will be undefined 
    }

    return i + (j * cellsNum[0]);
}

function removeWalls(a, b) {
    let x = a.i - b.i;
    let y = a.j - b.j;

    if (x == 1) {
        a.walls[3] = false; //left wall in current cell
        b.walls[1] = false; //right wall in next cell
    }
    else if (x == -1) {
        a.walls[1] = false; //right wall in current cell
        b.walls[3] = false; //left wall in next cell
    }

    if (y == 1) {
        a.walls[0] = false; //top wall in current cell
        b.walls[2] = false; //bottom wall in next cell
    }
    else if (y == -1) {
        a.walls[2] = false; //bottom wall in current cell
        b.walls[0] = false; //top wall in next cell
    }
}

function removeRepeatedWalls() {
    for (let j = 0; j < cellsNum[1]; j++) {
        for (let i = 0; i < cellsNum[0]; i++) {
            if (grid[index(i, j - 1)] && (grid[index(i, j)].walls[0] && grid[index(i, j - 1)].walls[2])) //top and bottom
            {
                grid[index(i, j)].walls[0] = false;
            }
            if (grid[index(i + 1, j)] && (grid[index(i, j)].walls[1] && grid[index(i + 1, j)].walls[3])) //right and left
            {
                grid[index(i, j)].walls[1] = false;
            }
            if (grid[index(i, j + 1)] && (grid[index(i, j)].walls[2] && grid[index(i, j + 1)].walls[0])) //bottom and top
            {
                grid[index(i, j)].walls[2] = false;
            }
            if (grid[index(i - 1, j)] && (grid[index(i, j)].walls[3] && grid[index(i - 1, j)].walls[1])) //left and right
            {
                grid[index(i, j)].walls[3] = false;
            }
        }
    }
}

function solve() {
    for (let k = 0; k < solveCells.length - 1; k++) {
        strokeCap(ROUND);
        stroke(0);
        strokeWeight(5);
        noFill();

        line(solveCells[k].i * cellSize[0] + cellSize[0] / 2, solveCells[k].j * cellSize[1] + cellSize[1] / 2, solveCells[k + 1].i * cellSize[0] + cellSize[0] / 2, solveCells[k + 1].j * cellSize[1] + cellSize[1] / 2);
    }
}

function mouseClicked() {
    if (reachedBegin) {
        solve();
    }
}