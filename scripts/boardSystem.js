function checkWinner (tempBoard) {
    let team = (turn == 1) ? PLAYER : AI;
    //changing the plays into a string so that we could use indexOf to check for every element
    //won't miss a win because this will run everytime a new cells filled
    let plays = tempBoard.reduce((accu, curr, index)=> (curr === team)? accu.concat(index): accu, []);

    //flattening the value so that we could search through the string with the solutions array
    for (let [index, win] of SOLUTIONS.entries()) {
      if (win.every(element=> plays.indexOf(element) != -1)) {
        return {winner: turn, winCombos:index};
      }
    }
    
    //if there's no winner and the remaining empty cell is zero, its a draw so return 2.
    if (getEmptyCellsSize(tempBoard) == 0) {
      return {winner: 2, winCombos: null};
    }
    return false
}

function isCellEmpty (theBoard, index) {
  if (theBoard[index] == null) {
    return true
  }
  return false
}

function addToArrayIndex(arr, idx, value) {
  arr[idx] = value;
}

//adding a symbol into a tile, reutnr true if succesful, false if otherwise
function addArea (newBoard, index, symbol) {
  if (currWinner == null) {
    if (isCellEmpty(newBoard, index)) {
      if (audioTrigger) {
        playSound(2);
      }
      addToArrayIndex(newBoard, index, symbol)

      if (audioTrigger) {
        let cell = document.getElementById(index);
        cell.innerHTML = symbol;
      }

      return true;
    }else {
      if (audioTrigger) {
        playSound(3);
      }
      return false;
    }
  }
}

//setting up the menu when a player win or the result is draw
function setResult (result) {
    setTimeout(gameOver(result), 1500);
    let combos = result.winCombos;
    if (combos != null) {
      let position = SOLUTIONS[combos];
      for (let x of position) {
        document.getElementById(x).style.backgroundColor = "lightgreen" ;
      }
    }
}

//using minmax algorithm
let computerTurn = (newBoard) => {
  audioTrigger = false;
  let bestScore = -Infinity;
  let bestRoute = -1;
  let symbol = AI;
  let tempBoard = newBoard.slice();
  for (let i = 0; i < 9; i++) {
    if (!isCellEmpty(tempBoard, i)) {
      continue;
    }
    addToArrayIndex(tempBoard, i, symbol)
    turn = 1
    let score = minimaxAlgo(tempBoard, false);
    console.log(score);
    
    if (score > bestScore) {
      bestScore = score;
      bestRoute = i; //replace the best position location
    }
  }

  turn = 0;
  audioTrigger = true;
  //modifying the original board
  addArea(newBoard, bestRoute, symbol);
  //then check winner
  result = checkWinner(newBoard);
  if (result !== false ) {
    setResult(result);
  }
}

let scores = [10, -10, 0];

function minimaxAlgo (tempBoard, isMaximizing) {
  let result = checkWinner(tempBoard);
  if (result != false) {
    return scores[result.winner];
  }

  turn = isMaximizing ? 0 : 1;
  let bestScore = isMaximizing? -Infinity: Infinity;
  //looping through the possible moves
  for (let i = 0; i < 9; i++) {
    // Is the spot available?
    let symbol = isMaximizing ?  AI : PLAYER;
    let newBoard = tempBoard.slice();
    if (!isCellEmpty(newBoard, i)) {
      continue;
    }
    addToArrayIndex(newBoard, i, symbol)
    //recursion again, while determining the current level's best route's score
    //if the score for this level is the highest,  AI will take this route
    let score = minimaxAlgo(newBoard, !isMaximizing);
    bestScore = (isMaximizing) ? Math.max(score, bestScore) : Math.min(score, bestScore);
  }
  return bestScore;
}

function randomMove (theBoard) {
  let position = Math.floor(Math.random() * 10);
  let test = document.getElementById(position);
  test.innerHTML = AI;
  theBoard[position] = AI;
}

function getEmptyCellsSize (tempBoard) {
  return tempBoard.reduce((accu, curr, index)=> (curr === null)? accu.concat(index): accu, []).length;
}