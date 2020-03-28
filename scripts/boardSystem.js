let checkSolution = (tempBoard) => {
    let team = (turn == 1) ? PLAYER : AI;
    //changing the plays into a string so that we could use indexOf to check for every element
    //won't miss a win because this will run everytime a new cells filled
    let plays = tempBoard.reduce((accu, curr, index)=> (curr === team)? accu.concat(index): accu, []);

    for (let [index, win] of SOLUTIONS.entries()) {
      if (win.every(element=> plays.indexOf(element) != -1)) {
        let result = {winner: turn, winCombos:index};
        return result;
      }
    }
    
    if (getEmptyCellsSize(tempBoard) == 0) {
      return {winner: 2, winCombos: null};
    }

    turn = (turn == 1) ? 0 : 1;
    return false
}

let addArea = (newBoard, index)  => {
  if (currWinner == null) {
    let symbol;
    if (newBoard[index] == null) {
      if (trigger) playSound(2);
      symbol = (turn == 1) ? PLAYER : AI;
      newBoard[index] = symbol;

      if (trigger == 1) {
        let cell = document.getElementById(index);
        cell.innerHTML = symbol;
      }
      return true;
    }else {
      if (trigger) {
        playSound(3);
      }
      return false;
    }
  }
}

let setResult = (result) => {
    for (let i=0; i<cells.length; i++){
      cells[i].removeEventListener ("click", cellsClicked, false);
    }
    setTimeout(function(){
      boardTable.removeEventListener("click", playSound, false)
    },300);
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
  trigger = 0;
  originalTurn = turn;
  turn = 1;
  let scores = [], currScore;
  for (let x = 0; x < 9; x++) {
    currScore = 0;
    let tempBoard = newBoard.slice();
    let result = addArea(tempBoard, x);
    if (result != false) {
      tempBoard = newBoard.slice();
      let isFull = getEmptyCellsSize(tempBoard);
      while (isFull> 0) {
        let res = minimaxRecursion(tempBoard, currScore, x);
        tempBoard = res.theBoard;
        currScore += res.score;
        isFull = getEmptyCellsSize(tempBoard)
      }
      scores.push({score: currScore, initialPoint: x});
    }
  }
  
  console.log(scores)
  let indexMax = 0, maxValue = scores[0]["score"];
  for (let x = 0;x< scores.length; x++) {
    currScore = scores[x]["score"];
    if (maxValue < currScore) {
      maxValue = currScore;
      indexMax = x;
    }
  }
  trigger = 1;
  turn = originalTurn;
  addArea(board, scores[indexMax]["initialPoint"]);
  let result = checkSolution(board);
  if (result != false) {
    setResult(result);
  }
}

let minimaxRecursion = (tempBoard, accu, startingPoint) => {
  let initialPoint;
  if (startingPoint != null) {
    let outerCounter = 0;
    for (let x = 0; x <= 9;x++) {
      if (x == 0) {
        initialPoint = startingPoint;
      }else initialPoint = outerCounter++;

      if (addArea(tempBoard.slice(), initialPoint)) {
        
        let emptyLeft = getEmptyCellsSize(tempBoard);
        let counter = 0;
        let index;
        let innerCounter = 0;
        let newBoard = tempBoard.slice();

        for (let y = 0; y < 9; y++) {
          if (y == 0) outerIndex = initialPoint;
          else outerIndex = innerCounter++;

          let testBoard = newBoard.slice();
          emptyLeft = getEmptyCellsSize(testBoard);
          
          for (let innerLoop = 0; innerLoop < 9; innerLoop++) {
            if (innerLoop == 0) index = outerIndex;
            else index = counter++;
            let cellAvailable = addArea(testBoard, index);

            if (cellAvailable != false) {
              let result = checkSolution(testBoard);
              if (result != false) {
                accu += 1000;
                break;
              }
              //if there's no winner, add score base on current 
              else if (turn == 1) accu -= 100;
              else if (turn == 0) accu += 50;
            }            
          }
          addArea(newBoard, outerIndex);
        }
        addArea(tempBoard, initialPoint);
      }
    }
  }
  return {theBoard: tempBoard, score: accu};
 } 

 let getEmptyCellsSize = (tempBoard) => {
  return tempBoard.reduce((accu, curr, index)=> (curr === null)? accu.concat(index): accu, []).length;
}