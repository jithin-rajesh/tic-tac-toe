(function () {
    const appContainer = document.getElementById("app");

    const cover = document.createElement("div");
    cover.className = "cover";
    cover.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10;
    `;

    const title = document.createElement("h2");
    title.innerText = "Welcome to Tic Tac Toe!";

    const form = document.createElement("form");
    form.className = "player-form";
    form.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1em;
        padding: 60px;
        justify-items: center;
    `;

    const playerOneLabel = document.createElement("label");
    const playerOne = document.createElement("input");
    const playerTwoLabel = document.createElement("label");
    const playerTwo = document.createElement("input");

    playerOneLabel.textContent = "Player One: ";
    playerOne.type = "text";
    playerOne.style.marginBottom = "1em";
    playerOne.required = true;

    playerTwoLabel.textContent = "Player Two: ";
    playerTwo.type = "text";
    playerTwo.required = true;

    const playerOneText = playerOne.value;
    const playerTwoText = playerTwo.value;

    const startButton = document.createElement("input");
    startButton.type = "submit";
    startButton.value = "Start Game";
    startButton.style.cssText = `
        padding: 1em 2em;
        margin-top: 50px;
        font-size: 1.2em;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        grid-column: span 2;
    `;

    form.appendChild(playerOneLabel);
    form.appendChild(playerOne);
    form.appendChild(playerTwoLabel);
    form.appendChild(playerTwo);
    form.appendChild(startButton);

    cover.appendChild(title);
    cover.appendChild(form);
    appContainer.appendChild(cover);

    const initializeGame = (event) => {
        event.preventDefault();
        const playerOneName = playerOne.value || "Player 1";
        const playerTwoName = playerTwo.value || "Player 2";
        cover.remove();
        const gameContainer = document.createElement("div");
        gameContainer.className = "game";
        appContainer.appendChild(gameContainer);

        const game = GameController(gameContainer, playerOneName, playerTwoName);
        console.log(game);
        form.removeEventListener("submit", initializeGame);
    };

    form.addEventListener("submit", initializeGame);
})();





function Gameboard(container,game) {
    const rows = 3;
    const columns = 3;
    const board = [];
    const cellContainer = container;
    const appContainer = document.querySelector('#app');
    const cellListeners = [];
    const cell = [];

    appContainer.appendChild(cellContainer);

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(0);
        }
    }


    
    const getBoard = () => board;
    
    

    const placePiece = (column, row, player) => {      
        board[column][row] = player;
        console.log(`${player} placed at [${column}][${row}]`);        
   }

   const printBoard = () => {
    console.log(board);
    };

    const cells = [];

    const renderCells = () => {
        cellContainer.innerHTML = '';
        cells.length = 0; // Clear the array before rendering
    
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('box');
    
                if (i === 0) cell.style.borderTop = "none";
                if (j === 2) cell.style.borderRight = "none";
                if (i === 2) cell.style.borderBottom = "none";
                if (j === 0) cell.style.borderLeft = "none";
    
                const clickHandler = () => {
                    if (board[i][j] !== 0) {
                        console.log("Already occupied. Try again.");
                        return;
                    }
                    game.playRound(i, j);
    
                    const img = document.createElement('img');
                    img.src = board[i][j] === 'X' 
                        ? 'icons/x-symbol-svgrepo-com.svg' 
                        : 'icons/circle-svgrepo-com.svg';
                    img.style.maxWidth = '80%';
                    img.style.maxHeight = '80%';
                    cell.appendChild(img);
                    cell.removeEventListener('click', clickHandler);  
                };
    
                cell.addEventListener('click', clickHandler);
                cells.push({ cell, clickHandler }); 
                cellContainer.appendChild(cell);
            }
        }
    };
    
    const removeAllListeners = () => {
        cells.forEach(({ cell, clickHandler }) => {
            cell.removeEventListener('click', clickHandler); 
        });
        cells.length = 0;
    };
    
    

    const drawWinningLine = (winType, index) => {
        const line = document.createElement('div');
        line.classList.add('winning-line');
        
        switch(winType) {
            case 'row':
                line.style.cssText = `
                    position: absolute;
                    height: 0.8em;
                    background: white;
                    width: 100%;
                    top: ${(index * 33.33) + 15}%;
                `;
                break;
            case 'column':
                line.style.cssText = `
                    position: absolute;
                    width: 0.8em;
                    background: white;
                    height: 100%;
                    left: ${(index * 33.33) + 15}%;
                `;
                break;
            case 'diagonal':
                line.style.cssText = `
                    position: absolute;
                    height: 10px;
                    background: white;
                    width: 140%;
                    top: 48%;
                    left: -20%;
                    transform: ${index === 0 ? 'rotate(45deg)' : 'rotate(-45deg)'};
                `;
                break;
        }

        cellContainer.appendChild(line);
    };

    let scoreContainer = null;
    let resetButton = null;
    
    const displayScore = (playerOneName, playerTwoName, playerOnePoints, playerTwoPoints) => {
        if (!scoreContainer) {
            scoreContainer = document.createElement("div");
            scoreContainer.className = "ScoreContainer";
            scoreContainer.style.cssText = `
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 100%;
                margin-top: 20px;
                color: white;
                font-size: 1.5em;
            `;
            cellContainer.insertAdjacentElement('afterend', scoreContainer);
        }
    
        scoreContainer.innerHTML = ''; 
    
        const playerOneScore = document.createElement("div");
        playerOneScore.textContent = `${playerOneName}: ${playerOnePoints}`;
        playerOneScore.style.cssText = `
            flex: 1;
            text-align: center;
        `;
    
        const playerTwoScore = document.createElement("div");
        playerTwoScore.textContent = `${playerTwoName}: ${playerTwoPoints}`;
        playerTwoScore.style.cssText = `
            flex: 1;
            text-align: center;
        `;
    
        if (!resetButton) {
            resetButton = document.createElement("button");
            resetButton.textContent = "Reset Board";
            resetButton.style.cssText = `
                padding: 0.5em 1em;
                margin-left: 20px;
                font-size: 0.8em;
                cursor: pointer;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
            `;
            resetButton.addEventListener('click', () => {
                game.resetBoard();
            });
        }
    
        const scoreBoard = document.createElement("div");
        scoreBoard.className = "score";
        scoreBoard.style.cssText = `
            display: flex;
            justify-content: space-around;
            width: 100%;
            margin-top: 20px;
            color: white;
            font-size: 1.5em;
        `;
    
        scoreBoard.appendChild(playerOneScore);
        scoreBoard.appendChild(playerTwoScore);
        scoreContainer.appendChild(scoreBoard);
        scoreContainer.appendChild(resetButton);
    };
    

    const resetBoard = () => {
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j] = 0;
            }
        }

        const winningLine = cellContainer.querySelector('.winning-line');
        if (winningLine) {
            winningLine.remove();
        }

        renderCells();
    };
    
    return {
        getBoard,
        placePiece,
        printBoard,
        renderCells,
        removeAllListeners,
        drawWinningLine,
        displayScore,
        resetBoard
    };
}

function GameController(container, playerOne, playerTwo){

    const game = {};
    const board = Gameboard(container, game, playerOne, playerTwo);
    board.renderCells();
    const players = [
        {
            name: playerOne || "Player 1",
            token: 'X',
            points: 0
        }, 
        {
            name: playerTwo || "Player 2",
            token: 'O',
            points: 0
        }
    ];

    let activePlayer = players[0];

    board.displayScore(players[0].name, players[1].name, players[0].points, players[1].points);
    board.renderCells();

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const isDraw = () => {
        const newBoard = board.getBoard();
        return newBoard.every(row => row.every(cell => cell !== 0));
    };
    
    const playRound = (column, row) => {
        const boardArray = board.getBoard();
        let newBoard;
        if (column < 3 && row < 3 && column > -1  && row > -1 && boardArray[column][row] === 0)
        {
            console.log(`
                ${getActivePlayer().name} has placed ${getActivePlayer().token} at [${column}][${row}]...`
            );
            board.placePiece(column, row, getActivePlayer().token);

        }
        else
        {
            console.log("Invalid position, Try Again");
            printNewRound();
            return;
        }

        if (findWinner()) {
            board.printBoard();
            console.log("Game Over");
            getActivePlayer().points++;
            board.displayScore(players[0].name, players[1].name, players[0].points, players[1].points);
            return;            
        }else if (isDraw()) {
            console.log("Game Over! It's a draw.");
            board.displayScore(players[0].name, players[1].name, players[0].points, players[1].points);
            return;
        }
        board.displayScore(players[0].name, players[1].name, players[0].points, players[1].points);
        switchPlayerTurn();
        printNewRound();
    };

    const findWinner = () => {
        let currentToken = getActivePlayer().token;
        let newBoard = board.getBoard();
    
        for (let i = 0; i < 3; i++) {
            if (newBoard[i].every(cell => cell === currentToken)) {
                board.drawWinningLine('row', i);
                board.removeAllListeners();
                console.log(`${activePlayer.name} WINS!!`);
                return true;
            }
        }

        for (let i = 0; i < 3; i++) {
            if (newBoard.every(row => row[i] === currentToken)) {
                board.drawWinningLine('column', i);
                board.removeAllListeners();
                console.log(`${activePlayer.name} WINS!!`);
                return true;
            }
        }
        
        if ([0, 1, 2].every(i => newBoard[i][i] === currentToken)) {
            board.drawWinningLine('diagonal', 0);
            board.removeAllListeners();
            console.log(`${activePlayer.name} WINS!!`);
            return true;
        }

        if ([0, 1, 2].every(i => newBoard[i][2-i] === currentToken)) {
            board.drawWinningLine('diagonal', 1);
            board.removeAllListeners();
            console.log(`${activePlayer.name} WINS!!`);
            return true;
        }

        return false;
    }

    const resetBoard = () => {
        board.resetBoard();
        activePlayer = players[0]; 
        board.displayScore(players[0].name, players[1].name, players[0].points, players[1].points);
        printNewRound();
    };

    Object.assign(game, {
        playRound,
        getActivePlayer,
        findWinner,
        resetBoard,
        isDraw
    });

    return game;
}