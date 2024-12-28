function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(1);
        }
    }
    console.log(board);

    const getBoard = () => board;
    

    return {
        getBoard
    };
}

Gameboard();

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
){
    const board = Gameboard();
    const players = [
        {
            name: playerOneName,
            token: 1
        }, 
        {
            name: playerTwoName,
            token: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.prinBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (column) => {
        console.log(`
            Dropping ${getActivePlayer().name}'s token into column ${column}...`
        );
        board.drop
    }
}