// Sleep func for some effects
function sleep(ms) {return new Promise(r => setTimeout(r, ms));}

const background_colors = [
    "#bead98","#eee4da","#ebd8b6","#f4b17a",
    "#f59575","#f57c5f","#f65d3b","#edce71",
    "#edcc63","#edc651","#eec744","#ecc230",
    "#fe3d3d","#ff2020"
]

class board {
    // This one creates all the tiles
    constructor() {
        this.board_matrix = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]

        this.score = 0;
        this.addRandomTile();
        this.divtext = "none";
        this.draw();
    }

    checkForGameOver() {
        let is_or_no = 0;
        let empty_spaces = 0;

        // Checks if there is any possible move
        for(let i = 0; i < sides-1; i++) {
            for(let j = sides-1; j > 0; j--)
                is_or_no += this.tryMerge(j, i, -1, 0, false) + this.tryMerge(j, i, 0, -1, false);
            for(let j = 0; j < sides-1; j++)
                is_or_no += this.tryMerge(j, i, 1, 0, false) + this.tryMerge(j, i, 0, 1, false);
        }

        for(let i = 0; i < sides; i++) {
            for(let j = 0; j < sides; j++) {
                if(this.board_matrix[i][j] == 0) empty_spaces++;
            }
        }

        if(is_or_no == 0 && empty_spaces == 0) {
            this.divtext = "flex";
        }
    }

    addRandomTile(moves) {
        if(moves == 0) return;

        let randx = Math.floor(4 * Math.random());
        let randy = Math.floor(4 * Math.random());
        if(this.board_matrix[randx][randy] != 0) this.addRandomTile()
        else this.board_matrix[randx][randy] = 2 * Math.floor(1.4*Math.random()+1);
    }

    // Merges if it's possible
    tryMerge(x, y, dx=0, dy=0, mergin=true) {
        if(this.board_matrix[x][y] == this.board_matrix[x+dx][y+dy]) {
            if(mergin) {
                this.board_matrix[x+dx][y+dy] = 0;
                this.board_matrix[x][y] *= 2;
                this.score += this.board_matrix[x][y];
            }
            
            return 1;
        }
        return 0;
    }

    draw() {
        console.log("draw");
        console.log(this.divtext);
        boardEmt.innerHTML =
        '<div id="gameover" class="gameoverboard gameboard" style="display:' + this.divtext + ';">'+
            '<h1 class="gameover">Game Over!</h1>'+
        '</div>'; // Restarts the board but in this case with the game over screen with no display

        for(let i = 0; i < sides; i++) {
            for(let j = 0; j < sides; j++) {
                const cube = document.createElement("div");
                cube.className = "cube";
                
                if(this.board_matrix[i][j] != 0) {
                    // Here is where the css file selects the color of the cube/tile
                    cube.className += " n" + this.board_matrix[i][j];
                    cube.className += " d" + (Math.floor(Math.log10(this.board_matrix[i][j])) + 1);
                    cube.style.backgroundColor = background_colors[Math.log2(this.board_matrix[i][j])];

                    // Here it writes the cube's value
                    cube.innerHTML = this.board_matrix[i][j].toString();
                }

                // Cube is the little div we've created before (tile)
                boardEmt.appendChild(cube);
            }
        }
    }

    // All posible moving directions
    slide(move) {
        let emptys = 0;
        let moved_ones = 0;

        for(let i = 0; i < sides; i++) switch(move) {
            case "downwards":
                // This loop merges the equal numbers into the next power of 2
                for(let j = sides-1; j > 0; j--) moved_ones += this.tryMerge(j, i, -1);

                // And this one puts all of the cubes at the lowest they can
                for(let j = sides-1; j >= 0; j--)
                    if(this.board_matrix[j][i] == 0) emptys++; // Checks if it's empty, pff, no doubts
                    else if(emptys > 0) {
                        this.board_matrix[j+emptys][i] = this.board_matrix[j][i];
                        this.board_matrix[j][i] = 0; moved_ones++; // Catches for movement
                    }

                emptys = 0;
                break;
            case "upwards": // All the other cases follow the "downwards" algorithm
                for(let j = 0; j < sides-1; j++) moved_ones +=  this.tryMerge(j, i, 1);
                
                for(let j = 0; j < sides; j++) if(this.board_matrix[j][i] == 0) emptys++;
                else if(emptys > 0) {
                    this.board_matrix[j-emptys][i] = this.board_matrix[j][i];
                    this.board_matrix[j][i] = 0; moved_ones++;
                }

                emptys = 0;
                break;
            case "rightwards":
                for(let j = sides-1; j > 0; j--) moved_ones +=  this.tryMerge(i, j, 0, -1);

                for(let j = sides-1; j >= 0; j--) if(this.board_matrix[i][j] == 0) emptys++;
                else if(emptys > 0) {
                    this.board_matrix[i][j+emptys] = this.board_matrix[i][j];
                    this.board_matrix[i][j] = 0; moved_ones++;
                }

                emptys = 0;
                break;
            case "leftwards":
                for(let j = 0; j < sides-1; j++) moved_ones += this.tryMerge(i, j, 0, 1);
                
                for(let j = 0; j < sides; j++)
                    if(this.board_matrix[i][j] == 0) emptys++;
                    else if(emptys > 0) {
                        this.board_matrix[i][j-emptys] = this.board_matrix[i][j];
                        this.board_matrix[i][j] = 0; moved_ones++;
                    }

                emptys = 0;
                break;
        }

        // Adds a new tile after every slide
        this.addRandomTile(moved_ones);
        this.draw();
    }

    // It's like the constructor, the function for "New Game" button
    reset() {
        this.board_matrix = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]

        this.score = 0;
        this.addRandomTile();
        this.divtext = "none";
        this.draw();
    }
};