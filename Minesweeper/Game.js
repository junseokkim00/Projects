import { LoseGame } from "./script.js";
let Gameboard = [];
function createMines(rowNum, colNum, mineNum) {
    for (let i = 0; i < mineNum; i++) {
        const x = Math.floor(Math.random() * rowNum);
        const y = Math.floor(Math.random() * colNum);
        Gameboard[x][y]["isMine"] = true;
    }
}

const tileType = {
    HIDDEN: "hidden",
    BOMB: "bomb",
    SAFE: "safe",
    FLAG: "flag",
}

export function createBoard(rowNum, colNum, mineNum) {
    for (let i = 0; i < rowNum; i++) {
        const row = [];
        for (let j = 0; j < colNum; j++) {
            const element = document.createElement("div");
            element.dataset.status = tileType.HIDDEN;
            let tile = {
                "element": element,
                "x": i,
                "y": j,
                "isMine": false,
                "nearby": 0,
            }
            row.push(tile);
        }
        Gameboard.push(row);
    }
    createMines(rowNum, colNum, mineNum);
    countNearby(rowNum, colNum);
    return Gameboard;
}

function countNearby(rowNum, colNum) {
    for (let x = 0; x < rowNum; x++) {
        for (let y = 0; y < colNum; y++) {
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if ((0 <= x + i && x + i < rowNum) && (0 <= y + j && y + j < colNum)) {
                        if (Gameboard[x + i][y + j]["isMine"] == true) {
                            count++;
                        }
                    }
                }
            }
            Gameboard[x][y]["nearby"] = count;
        }
    }
}

export function revealTile(tile) {
    if (tile.element.dataset.status !== tileType.HIDDEN) {
        return;
    }
    const isMine = tile["isMine"];
    const nearby = tile["nearby"];

    const adjacentTiles = nearbyTiles(Gameboard, tile);

    if(isMine) {
        return
    }

    if (nearby != 0) {
        tile.element.dataset.status = tileType.SAFE;
        tile.element.textContent = `${nearby}`;
    } else {
        tile.element.dataset.status = tileType.SAFE; 
        adjacentTiles.forEach((t)=>revealTile(t));
    }
    
}

export function markTile(tile) {
    const tile_status = tile.element.dataset.status;
    if (tile_status == tileType.HIDDEN) {
        tile.element.dataset.status = tileType.FLAG;
        tile.element.textContent = "F";
        
    }

    if (tile_status == tileType.FLAG) {
        tile.element.dataset.status = tileType.HIDDEN;
        tile.element.textContent = "";
    }
}

export function isFinished() {
    for (let x = 0 ; x<Gameboard.length; x++) {
        for (let y = 0 ; y < Gameboard[x].length; y++) {
            if (Gameboard[x][y]["isMine"] == false) {
                if (Gameboard[x][y].element.dataset.status != tileType.SAFE) {
                    return 0;
                }
            }
        }
    }
    return 1;
}

function nearbyTiles(board, tile) {
    const tiles = [];
    const x = tile["x"];
    const y = tile["y"];

    for (let dx=-1;dx<=1;dx++) {
        for (let dy=-1;dy<=1;dy++) {
            const tile = board[x + dx]?.[y+dy];
            if (tile!=undefined) {
                tiles.push(tile);
            }
        }
    }
    return tiles;
}

export function clearData() {
    for(let i=0 ;i <Gameboard.length;i++) {
        while(Gameboard[i].length) {
            Gameboard[i].pop();
        }
    }
    while(Gameboard.length) {
        Gameboard.pop();
    }
}

export function clickTile(tile) {
    console.log(tile.element.dataset.status);
    if (tile.element.dataset.status == tileType.HIDDEN) {
        if(tile.isMine) {
            LoseGame();
        }
        revealTile(tile);
    } 
}

export function dblclickTile(tile) {
    if (tile.element.dataset.status == tileType.SAFE) {
        const x = tile.x;
        const y = tile.y;
        const tiles = [];
        let count = 0;
        for (let dx=-1;dx<=1;dx++) {
            for (let dy=-1;dy<=1;dy++) {
                const tile = Gameboard[x + dx]?.[y+dy];
                if (tile!=undefined) {
                    if (tile.element.dataset.status == tileType.HIDDEN)
                    tiles.push(tile);
                }
            }
        }

        for (let i=0;i<tiles.length;i++) {

            if (tiles[i].isMine) {
                LoseGame();
            } else {
                revealTile(tiles[i]);
            }
        }
    }
}

export function checkScore(mineNum) {
    let count=0;
    for(let i=0;i<Gameboard.length;i++) {
        for(let j=0;j<Gameboard[i].length;j++) {
            if(Gameboard[i][j].element.dataset.status == tileType.FLAG) {
                count++;
            }
        }
    }
    if (count <= mineNum) {
        document.getElementById("how-many").textContent=`Mines Left: ${mineNum - count}`;
    } else {
        document.getElementById("how-many").textContent=`Mines Left: 0`;
    }
}

export function showBomb() {
    for(let i=0;i<Gameboard.length;i++) {
        for(let j=0;j<Gameboard[i].length;j++) {
            if(Gameboard[i][j].isMine) {
                Gameboard[i][j].element.dataset.status = tileType.BOMB;
            }
        }
    }
}