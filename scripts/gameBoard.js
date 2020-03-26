const PLAYER="O",  AI="X";
let origBoard = new Array(9);
let turn = 1, result, trigger = 1;
const SOLUTIONS = [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 4, 8],
                    [2, 4, 6]
                  ];

class GameBoard {
  checkSolution = () => {
    let team = (turn == 1) ? PLAYER : AI;
    let plays = origBoard.reduce((accu, curr, index)=> (curr === team)? accu.concat(index): accu, []);

    for (let [index, win] of SOLUTIONS.entries()) {
      console.log(index, win)
      if (win.every(element=> plays.indexOf(element) != -1)) {
        return {winner: turn, winCombos:index};
      }
    }
    return false
  }

  addArea = (event)  => {
    let index = event.target.id;
    let symbol;
    if (origBoard[index] == null) {
      if (trigger) playSound(2);
      symbol = (turn == 1) ? PLAYER : AI;
      origBoard[index] = symbol;

      let cell = document.getElementById(index);
      cell.innerHTML = symbol;
      this.checkResult();
    }else {
      if (trigger) playSound(3);
    }
  }

  checkResult () {
    result = this.checkSolution();
      if (result != false)  {
        for (let i=0; i<cells.length; i++){
          cells[i].removeEventListener ("click", gameBoard.addArea, false);
        }

        setTimeout(function(){
          boardTable.removeEventListener("click", playSound, false)
        },300);
        setTimeout(gameOver, 1500);

        let position = SOLUTIONS[result.winCombos];
        for (let x of position) {
          document.getElementById(x).style.backgroundColor = "lightgreen" ;
        }
      }
      turn = (turn == 1) ? 0 : 1;
      if (turn == 0) {
        this.computerTurn();
      }
    }

  //using minmax algorithm
  computerTurn () {
    trigger = 0;
    let originalStates = {board:origBoard, currTurn: turn}

    for (let x = 0; x < 9; x++) {
      addArea
    }

    trigger = 1;
  }
}
