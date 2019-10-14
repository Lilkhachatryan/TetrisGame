const shapes = {
    1: [
        [0, 0, 1],
        [1, 1, 1]
    ],
        // [0, 0, 0],
        // [0, 0, 1],
        // [1, 1, 1]
    2: [
        [0, 1, 0],
        [1, 1, 1]
    ],
        // [0, 0, 0],
        // [0, 1, 0],
        // [1, 1, 1]
    3: [
        [0, 1, 1],
        [1, 1, 0],
    ],
    4: [        
        [1, 1],
        [1, 1],    
    ],
    // [        
    //     [0, 0, 0],
    //     [0, 1, 1],
    //     [0, 1, 1],    
    // ],
    5: [
        [1],
        [1],
        [1],    
        [1],
    ],
    // [
    //     [1, 0, 0, 0],
    //     [1, 0, 0, 0],
    //     [1, 0, 0, 0],    
    //     [1, 0, 0, 0],
    // ]
};
var interval = null;
const mainContainer = document.getElementById('tetris-container');
let currentItem = shapes[4];
let matrix_col = 10;
let matrix_row = 20;

let rotation_pos = 1;
let col_pos = 4;
let row_pos = 0;
let is_halt_mode = false;

function createBoard() {
    for(let i = 0 ; i < matrix_row; i++) {
        for(let j = 0; j < matrix_col; j++) {
            createBox(i, j);
        }
    }
}

function createBox(x, y) {
    const box = document.createElement('div');
    box.classList.add('box');
    box.dataset.x = x;
    box.dataset.y = y;

    mainContainer.appendChild(box);    
}

function clearShape(row, col) {
    for(let i = 0; i < currentItem.length; i++) {
        for(let j = 0; j< currentItem[i].length; j++) {
            if(currentItem[i][j] === 1) {
                clearSingleBlockElement(row + i, col + j)
            } 
        }
    }
}

function drowShape(row, col) {
    for(let i = 0; i < currentItem.length; i++) {
        for(let j = 0; j < currentItem[i].length; j++) {
            if(currentItem[i][j] === 1) {
                setSingleBlockElement(row + i, col + j);
            } 
        }
    }
} 

function setSingleBlockElement(row, col) {
    if(row >= 0 && row < matrix_row && col >= 0 && col < matrix_col) {
      const e = document.querySelector(`[data-x="${row}"][data-y="${col}"]`)
      e.classList.add('active-box');
    }
}

function clearSingleBlockElement(row, col) {
    if(row >= 0 && row < matrix_row && col >= 0 && col < matrix_col) {
      const e = document.querySelector(`[data-x="${row}"][data-y="${col}"]`);
      e.classList.remove('active-box');
    }
}

createBoard();
currentItem = shapes[Math.floor(Math.random() * 5) + 1]
drowShape(row_pos, col_pos);
start();

function start() {
    if(interval) { clearInterval(interval) }
    clearAll();
    row_pos = 0;
    col_pos = 4;
    currentItem = shapes[Math.floor(Math.random() * 5) + 1];

    // interval =  setInterval(() => {
    //     moveDown()
    // }, 1000);
}

function moveDown() {
    if(isFull()) { 
        clearInterval(interval);
        console.log("game over")       
        alert("game overr");
        return
    }
    if(isCollide('BOTTOM')) {   
        console.log("isColled")
        row_pos = 0;
        col_pos = 4;
        currentItem = shapes[Math.floor(Math.random() * 5) + 1]
        drowShape(row_pos, col_pos);
        return
    }

    if(isBlockTouchBlock('BOTTOM')) {
        console.log("isblocktouch to block")
        row_pos = 0;
        col_pos = 4;
        currentItem = shapes[Math.floor(Math.random() * 5) + 1]
        drowShape(row_pos, col_pos);
        return
    }
    
    row_pos++;
    clearShape(row_pos - 1, col_pos); 
    drowShape(row_pos, col_pos);    

    if(isCompliteRow(row_pos + currentItem.length - 1)) {
        clearRow(row_pos + currentItem.length - 1);
    }
}

function moveLeft() {
    if(isCollide('LEFT')) { 
        return
    }

    if(isBlockTouchBlock('LEFT')) {
        return
    }

    col_pos--;
    clearShape(row_pos, col_pos + 1); 
    drowShape(row_pos, col_pos);    
}

function moveRight() {
    if(isCollide('RIGHT')) { 
        return
    }

    if(isBlockTouchBlock('RIGHT')) {
        return
    }

    col_pos++;
    
    clearShape(row_pos, col_pos - 1); 
    drowShape(row_pos, col_pos);    
}

const flipMatrix = matrix => (
    matrix[0].map((column, index) => (
      matrix.map(row => row[index])
    ))
);

const rotateMatrix = matrix => (
    flipMatrix(matrix.reverse())
);

function rotate() {
    clearShape(row_pos, col_pos); 

    currentItem = rotateMatrix(currentItem);

    const to_left = currentItem[0].length + col_pos - 1 - (matrix_col - 1);

    if(currentItem[0].length + col_pos - 1 > matrix_col - 1) {
        col_pos-= to_left;
    }

    const to_top = row_pos + currentItem.length - 1 - (matrix_row - 1);

    if(row_pos + currentItem.length - 1 > matrix_row - 1) { 
        row_pos -= to_top 
    };
    
    drowShape(row_pos, col_pos);
}

function swap(arr) {
    [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
    return arr;
}

function isCollide(sd) {
    const ln = currentItem[0].length - 1;
    switch (sd) {
        case 'LEFT': 
            if(col_pos <= 0) {
                return true;
            }
            break;
        case 'RIGHT': 
            if(col_pos + currentItem[0].length - 1 >= matrix_col - 1) {
                return true;
            }
            break;
        case 'BOTTOM': 
            if(row_pos + currentItem.length - 1 >= matrix_row - 1) {
                return true;
            }
    }
    return false;
}

function isBlockTouchBlock(side) {
    if(side === 'BOTTOM') {
        // console.log('col_pos - ', col_pos)
        // console.log("col_pos + currentItem[0].length - ", col_pos + currentItem[0].length);
        // console.log("row_pos + currentItem.length - ", row_pos + currentItem.length)
        for(let i = col_pos; i < col_pos + currentItem[0].length; i++) {
            const part = document.querySelector(`[data-x="${row_pos + currentItem.length}"][data-y="${i}"]`);
            if(part.classList.contains('active-box')) { console.log("bottom");return true }
        }
    } else if(side === 'RIGHT') {
        for(let i = row_pos; i < row_pos + currentItem.length - 1; i++) {
            const part = document.querySelector(`[data-x="${i}"][data-y="${col_pos + currentItem[0].length}"]`);
            if(part.classList.contains('active-box')) { return true }
        }
    } else if(side === 'LEFT') {
        // console.log('row_pos - ', row_pos)
        // console.log("row_pos  + currentItem.length - 1 - ", row_pos + currentItem.length -1);
        // console.log("col_pos-1", col_pos - 1)
        for(let i = row_pos; i < row_pos + currentItem.length - 1; i++) {
            const part = document.querySelector(`[data-x="${i}"][data-y="${col_pos - 1}"]`);
            if(part.classList.contains('active-box')) { return true }
        }
    }

    return false;
}

function isFull() {
    for(let i = 0; i <= matrix_col - 1; i++) {
        const first = document.querySelector(`[data-x="${0}"][data-y="${i}"]`);
        const last = document.querySelector(`[data-x="${matrix_row - 1}"][data-y="${i}"]`);

        if(first.classList.contains('active-box') && last.classList.contains('active-box')) { return true }
    }
    
	return false;
} 

function isCompliteRow(row) {
    for(let i = 0; i < matrix_col; i++) {
        const box = document.querySelector(`[data-x="${row}"][data-y="${i}"]`);

        if(!box.classList.contains('active-box')) { 
            return false 
        }
    }
	return true;
}

function clearRow(row) {
    for(let i = 0; i < matrix_col; i++) {
        box = document.querySelector(`[data-x="${row}"][data-y="${i}"]`);
        box.classList.remove('active-box');
    }
}

function clearAll() {
    for(let i = 0; i < matrix_row; i++) {
        for(let j = 0; j < matrix_col; j++) {
            const box = document.querySelector(`[data-x="${i}"][data-y="${j}"]`);
            box.classList.remove('active-box');
        }
    }
}

document.body.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
    switch (e.which) {
        case 37:
            moveLeft();
            break;
        case 38:
            rotate();
            break;
        case 39:
            moveRight();
            break;
        case 40:
            moveDown();
            break;
        default: 
            break;
    }
}


