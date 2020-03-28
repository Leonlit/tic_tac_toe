'use strict'

let closeBtn, gameOverMenu, winnerTeam, shader;
let currWinner = null, trigger = 1;
let gameBoard;
let boardTable = document.getElementsByTagName("table")[0];
let cells = document.querySelectorAll("td");
let restartBtn = document.getElementById("restart");

const PLAYER="O",  AI="X";

let board = new Array(9);
let turn = 1;

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

window.onload = () => {
  gameInit();
}

let cellsClicked = (event) => {
  let cellAvailable = addArea(board, event.target.id);
  if (cellAvailable) {
    let result = checkSolution(board);
    if (result != false) {
      setResult(result);
    }else if (turn == 0) {
      setTimeout(computerTurn(board), 1000);
    }
  }
}

let gameInit = () => {
  turn = 1;
  currWinner = null;
  closeBtn = document.getElementById("close");
  gameOverMenu= document.getElementById("gameOver")
  winnerTeam = document.getElementById("winTeam")
  shader = document.getElementById("shader");

  closeBtn.addEventListener("click", closeGameOverMenu, false);
  restartBtn.style.display="none";

  for (let cellIndex=0; cellIndex < cells.length; cellIndex++){
    cells[cellIndex].innerHTML = "";
    cells[cellIndex].style.backgroundColor = "transparent"
    board.fill(null);
    cells[cellIndex].addEventListener ("click", cellsClicked, false);
  }
}

let closeGameOverMenu = () => {
  //used opacity to animate the fade in, while display none to prevent user from able to click the
  //game over menu or selecting it (which would cause the app to not so user friend)
  shader.style.opacity = "0";
  gameOverMenu.style.opacity = "0";

  setTimeout(()=> {
    shader.style.display = "none"
    gameOverMenu.style.display = "none";
  }, 300);
}

//playing sound effects
// 0 = win, 1 = button click, 2 = add points
let playSound = (soundIndex) => {
  let musicArr = ["win","click","areaAdded","error"];
  if (Number.isInteger(soundIndex) != true) soundIndex = 2;
  let winSound = new Audio(`music/${musicArr[soundIndex]}.mp3`);
  winSound.volume = (soundIndex == 0) ? 0.3 : 0.7;
  winSound.play();
}

let gameOver = (result) => {
  setTimeout(playSound(0), 900);
  currWinner = result.winner;
  let winner = ( currWinner == 1)? {team:"Player", scoreId:"playerScore"} : (currWinner == 0)? {team:"Computer", scoreId:"enemyScore"} : {team: "Draw", scoreId: null};
  if (winner.scoreId != null) {
    let scorer = document.getElementById(winner.scoreId);
    scorer.innerHTML = Number(scorer.innerHTML) + 1;
  }
  shader.style.display = "block";
  gameOverMenu.style.display = "block";
  setTimeout(()=> {
    shader.style.opacity = "1.0"
    gameOverMenu.style.opacity = "1.0";
    restartBtn.style.display = "block";
  },300);
  winnerTeam.innerHTML = winner.team;
}
