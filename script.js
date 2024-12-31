function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    const cellContainer = document.querySelector('.game');
    const cellListeners = [];

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

    const renderCells  = () => {
        cellContainer.innerHTML = '';
        for (let i = 0; i < board.length; i++)
        {
            for (let j = 0; j < board[i].length; j++)
            {
                let img = document.createElement('img');
                const cell = document.createElement('div');
                cell.classList.add('box');
                if (i == 0)
                {
                    cell.style.borderTop = "none";
                }
                if (j == 2)
                {
                    cell.style.borderRight = "none";
                }
                if ((i == 2))
                {
                    cell.style.borderBottom = "none";
                }
                if (j == 0)
                {
                    cell.style.borderLeft = "none";
                }
                function handleClick() {
                    if(board[i][j] != 0)
                        {
                            console.log("Already Occupried, Try Again.");
                            return;
                        }
                        game.playRound(i, j);
    
                        const img = document.createElement('img');
                        if(board[i][j] === 'X')
                        {
                            img.src = 'icons/x-symbol-svgrepo-com.svg'
                        }
                        else
                        {
                            img.src = 'icons/circle-svgrepo-com.svg'
                        }
                        img.style.maxWidth = '80%';
                        img.style.maxHeight = '80%';
                        cell.appendChild(img);
                }
                cell.addEventListener('click', (handleClick));
                cellListeners.push({ cell, handler: handleClick});                  
                cellContainer.appendChild(cell);
            }
        }       

    }
    
    const removeAllListeners = () => {
        cellListeners.forEach(({ cell, handler}) => {
            cell.removeEventListener("click", handler);
        });
        cellListeners.length = 0
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

    return {
        getBoard,
        placePiece,
        printBoard,
        renderCells,
        removeAllListeners,
        drawWinningLine
    };
}

Gameboard();



function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
){

    
    const board = Gameboard();
    board.renderCells();
    const players = [
        {
            name: playerOneName,
            token: 'X'
        }, 
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
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
            return;
        }
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

        if (newBoard.every(row => row.every(cell => cell !== 0))) {
            board.removeAllListeners();
            console.log("Game is a draw!");
            return true;
        }
        return false;
    }

    

    printNewRound();


    return{
        playRound,
        getActivePlayer,
        findWinner
    };
}

const game = GameController();