let checkSolution = () => {
    let team = (turn == 1) ? PLAYER : AI;
    //changing the plays into a string so that we could use indexOf to check for every element
    //won't miss a win because this will run everytime a new cells filled
    let plays = board.reduce((accu, curr, index)=> (curr === team)? accu.concat(index): accu, []);

    for (let [index, win] of SOLUTIONS.entries()) {
      //console.log(index, win)
      if (win.every(element=> plays.indexOf(element) != -1)) {
        let result = {winner: turn, winCombos:index};
        return result;
      }
    }
    return false
}

let addArea = (newBoard, index)  => {
  if (currWinner == null) {
    let symbol;
    if (newBoard[index] == null) {
      if (trigger) playSound(2);
      symbol = (turn == 1) ? PLAYER : AI;
      newBoard[index] = symbol;

      let cell = document.getElementById(index);
      cell.innerHTML = symbol;

      turn = (turn == 1) ? 0 : 1;
      if (turn == 0) {
        computerTurn();
      }
      return true;
    }else {
      if (trigger) playSound(3);
      return false;
    }
  }
}

let setResult = (result) => {
  if (trigger == 1)  {
    for (let i=0; i<cells.length; i++){
      cells[i].removeEventListener ("click", cellsClicked, false);
    }
    setTimeout(function(){
      boardTable.removeEventListener("click", playSound, false)
    },300);
    setTimeout(gameOver(result), 1500);

    let position = SOLUTIONS[result.winCombos];
    for (let x of position) {
      document.getElementById(x).style.backgroundColor = "lightgreen" ;
    }
  }
  
}

//using minmax algorithm
let computerTurn = () => {
  trigger = 0;
  let originalStates = {board: board.slice() , currTurn: turn}
  let scores = [], currScore = 0;
  for (let x = 0; x < 9; x++) {
    let cellsAvailability = addArea(board.slice(), x);
    if (cellsAvailability) {
      let score = minMaxRecursion(board.slice, x);
      scores.push({score:score, initialPoint: x});
    }
  }
  trigger = 1;
}


let minMaxRecursion = (startingPoint ,tempBoard, accu = 0) => {
  let empty = true;
  for (let x = startingPoint; x<9; x++) {
    let cellsAvailability = addArea(tempBoard, x);
    if (cellsAvailability) {
      empty = false;
      let result = checkSolution();
      if (result != false) {
        let winner = result.winner;
        if (winner == 1) {
          //player won
          accu -= 10;
        }else {
          //computer won
          accu += 10;
        }
      }else if (turn == 1) {
        //no winner
        accu += 10;
      }else {
        accu -= 10;
      }
    }
  }
  if (empty) {
    return accu;
  }
  return minMaxRecursion(tempBoard, accu);
} 