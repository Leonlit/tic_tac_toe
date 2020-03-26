checkSolution = () => {
    let team = (turn == 1) ? PLAYER : AI;
    //changing the plays into a string so that we could use indexOf to check for every element
    //won't miss a win because this will run everytime a new cells filled
    let plays = board.reduce((accu, curr, index)=> (curr === team)? accu.concat(index): accu, []);

    for (let [index, win] of SOLUTIONS.entries()) {
      //console.log(index, win)
      if (win.every(element=> plays.indexOf(element) != -1)) {
        let result = {winner: turn, winCombos:index};
        setResult(result);
        return result;
      }
    }
    return false
}

addArea = (index)  => {
  if (currWinner == null) {
    let symbol;
    if (board[index] == null) {
      if (trigger) playSound(2);
      symbol = (turn == 1) ? PLAYER : AI;
      board[index] = symbol;

      let cell = document.getElementById(index);
      cell.innerHTML = symbol;
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
      cells[i].removeEventListener ("click", addArea, false);
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
  turn = (turn == 1) ? 0 : 1;
  if (turn == 0) {
    computerTurn();
  }
}

//using minmax algorithm
let computerTurn = () => {
  trigger = 0;
  let originalStates = {board: board.slice() , currTurn: turn}
  let score = [];
  addArea(null, 1);
  for (let x = 0; x < 9; x++) {
    addArea(x);
  }

    trigger = 1;
  }
