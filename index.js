const shapes = {
    1: 
    [
        [0, 0, 1],
        [1, 1, 1]
    ],
    // [
    //     [0, 0, 0],
    //     [0, 0, 1],
    //     [1, 1, 1]
    // ],
    2: 
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    // [
    //     [0, 0, 0],
    //     [0, 1, 0],
    //     [1, 1, 1]
    // ],
    3: [
        [0, 1, 1],
        [1, 1, 0],
    ],
    // [
    //     [0, 0, 0],
    //     [0, 1, 1],
    //     [1, 1, 0],
    // ],
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

const shapeColors = {
    1: 'blue',
    2: 'red',
    3: 'yellow',
    4: 'green',
    5: 'grey',
}

const cvs = document.getElementById('tetris');
const ctx = cvs.getContext('2d');
const matrix_col = 10;
const matrix_row = 20;
const boxSize = 30;
const emptyColor = 'white';
let matrix = [];
let score = 0;
let startDate = Date.now();

var interval = null;
let currentItem = shapes[1];
let currentHeight = currentItem.length;
let currentWidth = currentItem[0].length;
let currentColor = shapeColors[1];

let col_pos = 4;
let row_pos = - currentHeight;

function setCurrentItem() {
    currentItem = shapes[Math.floor(Math.random() * 5) + 1];
    currentColor = shapeColors[Math.floor(Math.random() * 5) + 1];
    currentHeight = currentItem.length;
    currentWidth = currentItem[0].length;
}

function drawBox(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(y * boxSize, x * boxSize, boxSize, boxSize);
  ctx.strokeStyle = color === 'white' ? 'black' : 'dark' + color;
  ctx.strokeRect(y * boxSize, x * boxSize, boxSize, boxSize); 
}

function createBoard() {
    for(let i = 0 ; i < matrix_row; i++) {
        matrix[i] = [];
        for(let j = 0; j < matrix_col; j++) {
            matrix[i][j] = 'white';
            drawBox(i, j, emptyColor);
        }
    }
}

function drawShape(color ,isCollide) {
    for(let i = 0; i < currentHeight; i++) {
        for(let j = 0; j < currentWidth; j++) {
            if(currentItem[i][j] === 1) {
                if(matrix[i + row_pos] && isCollide){
                    matrix[i + row_pos][j + col_pos] = color ? color : currentColor;
                }
                drawBox(i + row_pos, j + col_pos, color ? color : currentColor);
            } 
        }
    }
}

function clearShape() {
    drawShape(emptyColor)
}

createBoard();
setCurrentItem();
row_pos = - currentHeight;
drawShape();
drop();


function drop() {
    // let now = Date.now();
    // let deal = startDate - now;

    // if(deal > 1000) {
    //     startDate = Date.now();
    // }

    interval =  setInterval(() => {
        moveDown()
    }, 1000);
}

function moveDown() {
    // if(isFull()) { 
    //     clearInterval(interval);
    //     console.log("game over")       
    //     alert("game overr");
    //     return
    // }

    if(isBlockTouchBlock('BOTTOM')) {
        if(row_pos == 0) { 
            clearInterval(interval);
            alert("game over")
            return
        }
        console.log("isblocktouch to block")
        drawShape(null, true);

        row_pos = 0;
        col_pos = 4;
        setCurrentItem();
        clearShape();
        drawShape();
        return
    }
    
    clearShape();
    row_pos ++;
    drawShape();   
    
    if(isCollide('BOTTOM')) {  
        drawShape(null, true);

        // if(isCompliteRow()) {
        //     clearRow();
        // }

        row_pos = 0;
        col_pos = 4;
        setCurrentItem();
        clearShape();
        drawShape();
        return
    }
    drawShape()

    // if(isCompliteRow()) {
    //     clearRow();
    // }
}

function moveLeft() {
    if(isCollide('LEFT')) { 
        return
    }

    // if(isBlockTouchBlock('LEFT')) {
    //     return
    // }

    clearShape();
    col_pos--;
    drawShape();      
}

function moveRight() {
    if(isCollide('RIGHT')) { 
        return
    }

    // if(isBlockTouchBlock('RIGHT')) {
    //     return
    // }

    clearShape();
    col_pos++;
    drawShape();    
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
    clearShape(); 

    currentItem = rotateMatrix(currentItem);
    currentHeight = currentItem.length;
    currentWidth = currentItem[0].length;

    // this can be done by checking isCallide for each side

    const to_left = currentWidth + col_pos - 1 - (matrix_col - 1);

    if(currentWidth + col_pos - 1 > matrix_col - 1) {
        col_pos-= to_left;
    }

    const to_top = row_pos + currentItem.length - 1 - (matrix_row - 1);
    
    if(row_pos + currentHeight - 1 >= matrix_row - 1) { 
        row_pos -= to_top 
    };

    if(isCollide('BOTTOM')) {
        drawShape();   
        row_pos = 0;
        col_pos = 4;
        setCurrentItem();
        clearShape();
        drawShape();
        return
    }
    drawShape();
}

function isCollide(side) {
    switch (side) {
        case 'LEFT': 
            if(col_pos <= 0) {
                return true;
            }
            break;
        case 'RIGHT': 
            if(col_pos + currentWidth >= matrix_col) {
                return true;
            }
            break;
        case 'BOTTOM': 
            if(row_pos + currentHeight - 1 >= matrix_row - 1) {
                return true;
            }
    }
    return false;
}

function isBlockTouchBlock(side) {
    if(side === 'BOTTOM') {
      let k = currentHeight;
      for(let r = row_pos + currentHeight; r > row_pos; r--) {
        for(let i = col_pos, j = 0; i < col_pos + currentWidth ; i++) {
            if(currentItem[k - 1][j] === 1) {
                if(matrix[r] && matrix[r][i] !== 'white') { 
                    return true;
                }
            }
            j++;
        }
        k--;
      }
    } else if(side === 'RIGHT') {
        for(let i = row_pos; i < row_pos + currentItem.length; i++) {
            if(matrix[i] && matrix[i][col_pos] !== 'white') { return true }
        }
    } else if(side === 'LEFT') {
        for(let i = row_pos; i < row_pos + currentItem.length; i++) {
            if(matrix[i] && matrix[i][col_pos] !== 'white') { return true }
        }
    }

    return false;
}

// wrong logic implemented
function isFull() {
    for(let i = 0; i <= matrix_col - 1; i++) {
        const first = document.querySelector(`[data-x="${0}"][data-y="${i}"]`);
        const last = document.querySelector(`[data-x="${matrix_row - 1}"][data-y="${i}"]`);

        if(first.classList.contains('active-box') && last.classList.contains('active-box')) { return true }
    }
    
	return false;
} 

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function isCompliteRow() {
    for(let i = 0; i < matrix_row; i++){
        let isRowFull = true;
        for(let j = 0; j < matrix_col; j++) {
            // let p = ctx.getImageData(2, 5, 30, 30).data;
            // let hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
            // console.log("hex")
            isRowFull = isRowFull && matrix[i][j] !== 0
        }
        if(isRowFull) {
            for(r = i; r > 1; r--) {
                for(c = 0; c < matrix_col; c++) {
                    matrix[r][c] = matrix[r - 1][c];
                }
            }

            for(c = 0; c < matrix_col; c++) {
                matrix[0][c] = 0;
            }

            score += 10;
        }
    }
    
	return true;
}

function clearRow() {
    for(let i = 0; i < matrix_col; i++) {
        drawBox(row_pos, i, emptyColor);
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
            // clearInterval(interval);
            moveLeft();
            // drop();
            break;
        case 38:
            // clearInterval(interval);
            rotate();
            // drop();
            break;
        case 39:
            // clearInterval(interval);
            moveRight();
            // drop();
            break;
        case 40:
            // clearInterval(interval);
            moveDown();
            // drop();
            break;
        default: 
            break;
    }
}


