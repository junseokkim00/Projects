import { createBoard, markTile, isFinished, clearData, clickTile, checkScore, showBomb, dblclickTile } from "./Game.js";

let board;
let row, col, mineNum, interval;
let nightMode = true;

// document.querySelector(".theme").addEventListener("click", () => {
//     nightMode = !nightMode;
//     document.querySelector(".theme").textContent= nightMode ? "🌙" :"☀️";
//     document.getElement.style.background = "#FCF3F3";
//     document.getElementsByTagName("*").style.color = "#2A2C2C"; 
// })

document.getElementById("home").addEventListener("click", () => {
    // document.getElementById("home").textContent = "🙂";
    // document.getElementById("start-div").style.display="flex";
    // document.getElementById("game-div").style.display="none";
    // document.getElementById("Lose").style.display="none";
    // document.getElementById("Win").style.display="none";
    // clearData();
    document.location.reload();
})


document.getElementById("easy").addEventListener('click', () => {
    document.getElementById("row").value = 9;
    document.getElementById("col").value = 9;
    document.getElementById("mines").value = 10;
    const boardElement = document.querySelector(".board");
    boardElement.style.setProperty("--boardPixel","40px");
})

document.getElementById("medium").addEventListener('click', () => {
    document.getElementById("row").value = 16;
    document.getElementById("col").value = 16;
    document.getElementById("mines").value = 40;
    const boardElement = document.querySelector(".board");
    boardElement.style.setProperty("--boardPixel","25px");
})

document.getElementById("hard").addEventListener('click', () => {
    document.getElementById("row").value = 30;
    document.getElementById("col").value = 24;
    document.getElementById("mines").value = 180;
    const boardElement = document.querySelector(".board");
    boardElement.style.setProperty("--boardPixel","20px");

    
})

document.getElementById("start-button").addEventListener("click", () => {
    document.getElementById("start-div").style.display = "none";
    document.getElementById("game-div").style.display = "block";
    row = document.getElementById("row").valueAsNumber;
    col = document.getElementById("col").valueAsNumber;
    mineNum = document.getElementById("mines").valueAsNumber;
    board = createBoard(row, col, mineNum);
    const boardElement = document.querySelector(".board");
    boardElement.style.setProperty("--row", row);
    boardElement.style.setProperty("--col", col);
    document.getElementById("how-many").textContent = `Mines Left: ${mineNum}`;
    board.forEach((row) => {
        row.forEach((tile) => {
            boardElement.append(tile["element"]);
            tile.element.addEventListener("click", () => {
                clickTile(tile);
                if (isFinished()) {
                    WinGame();
                }
            });

            tile.element.addEventListener("dblclick", (e) => {
                dblclickTile(tile);
            })

            tile.element.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                markTile(tile);
                checkScore(mineNum);
            });
        })
    })

    interval = setInterval(startStopwatch,1000);

});

let seconds=0;
let tens=0;

let minute_tens=0;
let minute_seconds=0;

function startStopwatch() {
    // let seconds = document.getElementById("tens").textContent;
    
    console.log(seconds);
    seconds++;
    if(seconds <= 9) {
        document.getElementById("tens").textContent = tens.toString() + seconds.toString(); 
    } else {
        if(tens <= 4) {
            tens++;
        } else {
            tens = 0;
            minute_seconds++;
            if(minute_seconds <= 9) {
                document.getElementById("seconds").textContent = minute_tens.toString() + minute_seconds.toString();
            } else {
                minute_tens++;
                minute_seconds=0;
            }
        }
        seconds = 0;
        document.getElementById("tens").textContent = tens.toString() + seconds.toString();
    }
    

}


export function LoseGame() {
    // document.getElementById("game-div").style.display = "none";
    // document.getElementById("Lose").style.display = "block";
    showBomb();
    clearInterval(interval);
    document.getElementById("how-many").textContent = "You Lose!";
    document.getElementById("home").textContent = "🤯";

}

function WinGame() {
    clearInterval(interval);
    document.getElementById("game-div").style.display = "none";
    document.getElementById("Win").style.display = "block";
    document.getElementById("home").textContent = "😎";
}






