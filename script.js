function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    const cellContainer = document.querySelector('.game');

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
                cell.addEventListener('click', () => {
                    

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
                    img.style.maxWidth = '90%';
                    img.style.maxHeight = '90%';
                    cell.appendChild(img);
                    if(game.findWinner()) {
                        removeAllListeners();
                    }
                    renderCells;                    
                 })
                cellContainer.appendChild(cell);
            }
        }       

    }

    const removeAllListeners = () => {
        const cells = document.querySelectorAll('.box');
        cells.forEach(cell => {
            const handleClick = cell.dataset.listener;
            if (handleClick) {
                cell.removeEventListener('click', handleClick);
            }
        });
    };
    

    return {
        getBoard,
        placePiece,
        printBoard,
        renderCells
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
                
        if (newBoard.some(row => row.every(cell => cell === currentToken)))
        {
            console.log(`${activePlayer.name} WINS!!`);
            return true;
        }

        for (let i = 0; i < 3; i++)
        {
            if (newBoard.every(row => row[i] === currentToken)){
                console.log(`${activePlayer.name} WINS!!`);
                return true;
            }
        }
        const leftDiagonal = [0, 1, 2].every(index => newBoard[index][index] === currentToken);
        const rightDiagonal = [0, 1, 2].every(index => newBoard[index][2 - index] === currentToken);

        if (leftDiagonal || rightDiagonal) {
            console.log(`${activePlayer.name} WINS!!`);
            return true;
        }

        
        return false;
        
    };

    

    printNewRound();


    return{
        playRound,
        getActivePlayer,
        findWinner
    };
}

const game = GameController();