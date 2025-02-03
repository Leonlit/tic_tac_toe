function checkWinner(tempBoard, currTurn) {
	let team = (currTurn == 1) ? PLAYER : AI;
	//changing the plays into a string so that we could use indexOf to check for every element
	//won't miss a win because this will run everytime a new cells filled
	let plays = tempBoard.reduce((accu, curr, index) => (curr === team) ? accu.concat(index) : accu, []);

	//flattening the value so that we could search through the string with the solutions array
	for (let [index, win] of SOLUTIONS.entries()) {
		if (win.every(element => plays.indexOf(element) != -1)) {
			return { winner: currTurn, winCombos: index };
		}
	}

	//if there's no winner and the remaining empty cell is zero, its a draw so return 2.
	if (getEmptyCellsSize(tempBoard) == 0) {
		return { winner: 2, winCombos: null };
	}
	return false
}

function isCellEmpty(theBoard, index) {
	if (theBoard[index] == null) {
		return true
	}
	return false
}

function addToArrayIndex(arr, idx, value) {
	arr[idx] = value;
}

//adding a symbol into a tile, reutnr true if succesful, false if otherwise
function addArea(newBoard, index, symbol) {
	
	if (currWinner == null) {
		if (isCellEmpty(newBoard, index)) {
			playSound(2);
			addToArrayIndex(newBoard, index, symbol)
			let cell = document.getElementById(index);
			cell.innerText = symbol;
			return true;
		} else {
			playSound(3);
			return false;
		}
	}
}

//setting up the menu when a player win or the result is draw
function setResult(result) {
	setTimeout(gameOver(result), 1500);
	let combos = result.winCombos;
	if (combos != null) {
		let position = SOLUTIONS[combos];
		for (let x of position) {
			document.getElementById(x).style.backgroundColor = "lightgreen";
		}
	}
}

//using minmax algorithm
let computerTurn = (newBoard) => {
	let bestScore = -Infinity;
	let bestRoute = -1;
	let symbol = AI;
	
	for (let i = 0; i < 9; i++) {
		let tempBoard = newBoard.slice();
		if (!isCellEmpty(tempBoard, i)) {
			continue;
		}
		addToArrayIndex(tempBoard, i, symbol)
		let score = minimaxAlgo(tempBoard, false, turn);
		
		if (score > bestScore) {
			bestScore = score;
			bestRoute = i; //replace the best position location
		}
	}
	
	//modifying the original board
	addArea(newBoard, bestRoute, symbol);
	//then check winner
	result = checkWinner(newBoard, turn);
	if (result !== false) {
		setResult(result);
	}
}

let scores = [10, -10, 0];

function minimaxAlgo(tempBoard, isMaximizing, currTurn) {
	let result = checkWinner(tempBoard, currTurn);
	if (result != false) {
		return scores[result.winner];
	}

	currTurn = Number(!currTurn)
	let bestScore = isMaximizing ? -Infinity: Infinity ;
	//looping through the possible moves
	for (let i = 0; i < 9; i++) {
		// Is the spot available?
		let symbol = isMaximizing ? AI : PLAYER;
		let newBoard = tempBoard.slice()
		if (!isCellEmpty(newBoard, i)) {
			continue;
		}
		addToArrayIndex(newBoard, i, symbol)
		
		//recursion again, while determining the current level's best route's score
		//if the score for this level is the highest,  AI will take this route
		let score = minimaxAlgo(newBoard, !isMaximizing, currTurn);
		bestScore = (isMaximizing) ? Math.max(score, bestScore) : Math.min(score, bestScore);
	}
	return bestScore;
}

function randomMove(theBoard) {
	let position = Math.floor(Math.random() * 10);
	console.log(position);
	
	addArea(theBoard, position, AI)
}

function getEmptyCellsSize(tempBoard) {
	return tempBoard.reduce((accu, curr, index) => (curr === null) ? accu.concat(index) : accu, []).length;
}