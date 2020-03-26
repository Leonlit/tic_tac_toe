'use strict'

let closeBtn, gameOverMenu, winnerTeam, shader;
let gameBoard = new GameBoard();
let boardTable = document.getElementsByTagName("table")[0];
let cells = document.querySelectorAll("td");
let restartBtn = document.getElementById("restart");

let gameInit = () => {
  closeBtn = document.getElementById("close");
  gameOverMenu= document.getElementById("gameOver")
  winnerTeam = document.getElementById("winTeam")
  shader = document.getElementById("shader");

  closeBtn.addEventListener("click", closeGameOverMenu, false);
  restartBtn.style.display="none";

  for (let i=0; i<cells.length; i++){
    cells[i].innerHTML = "";
    cells[i].style.backgroundColor = "transparent"
    origBoard.fill(null);
    cells[i].addEventListener ("click", gameBoard.addArea, false);
  }
}

window.onload = ()=> {
  gameInit();
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
let playSound = (index) => {
  let musicArr = ["win","click","areaAdded","error"];
  console.log(index)
  if (Number.isInteger(index) != true) index = 2;
  let winSound = new Audio(`music/${musicArr[index]}.mp3`);
  winSound.volume = (index == 0) ? 0.3 : 0.7;
  winSound.play();
}

let gameOver = () => {
  
  setTimeout(playSound(0), 900);
  let winner = (result.winner == 1)? {team:"Player", scoreId:"playerScore"} : {team:"Computer", scoreId:"enemyScore"};
  let scorer = document.getElementById(winner.scoreId);
  scorer.innerHTML = Number(scorer.innerHTML) + 1;

  shader.style.display = "block";
  gameOverMenu.style.display = "block";
  setTimeout(()=> {
    shader.style.opacity = "1.0"
    gameOverMenu.style.opacity = "1.0";
    restartBtn.style.display = "block";
  },300);
  winnerTeam.innerHTML = winner.team;
}
