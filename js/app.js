const Square = () => {
    let value = 0;

    const addValue = player => {
        value = player;
    }

    const getValue = () => value;

    return {
        addValue,
        getValue,
    };
};

const GameBoard = (() => {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Square());
        }
    }

    // for (let i = 0; i < 9; i++) {
    //     board.push(Square());
    // }

    const getBoard = () => board;

    const selectSquare = (row, column, player) => {

        const unavailableSquares = [];

        // for (let i = 0; i < board.length; i++) {
        //     if (board[i].getValue() !== 0) unavailableSquares.push(i);
        // }

        // for (let i = 0; i < rows; i++) {
        //     unavailableSquares[i] = [];
        //     for (let j = 0; j < columns; j++) {
        //         //     if (board[i].getValue() !== 0) unavailableSquares.push(i);
        //         if (unavailableSquares[i][j].getValue() !== 0)
        //     }
        // }

        // if (unavailableSquares.includes(square)) return;
        if (board[row][column].getValue() !== 0) return;

        board[row][column].addValue(player);
    };

    const printBoard = () => {
        const boardWithSquareValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithSquareValues);
    };

    return { getBoard, selectSquare, printBoard };
})();



const DisplayController = ((
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) => {
    const board = GameBoard;
    
    const players = [
        {
            name: playerOneName,
            option: 1,
        },
        {
            name: playerTwoName,
            option: 2,
        },
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    }

    const playRound = (row, column) => {
        console.log(
            `Selecting ${getActivePlayer().name}'s option into the ${row} row and the ${column} column`
        );
        board.selectSquare(row, column, getActivePlayer().option);

        // winner finish
        // Column check X
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[row][i].getValue() !== 1) {
                break;
            } else if(i === 2) {
                console.log('X win');
            }
        }

        // Column check O
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[row][i].getValue() !== 2) {
                break;
            } else if(i === 2) {
                console.log('O win');
            }
        }

        // Row check X
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[i][column].getValue() !== 1) {
                break;
            } else if(i === 2) {
                console.log('X win');
            }
        }

        // Row check O
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[i][column].getValue() !== 2) {
                break;
            } else if(i === 2) {
                console.log('O win');
            }
        }

        // Diagonal
        if(row === column){
            // Diagonal check X
            for (let i = 0; i < 3; i++) {
                if (board.getBoard()[i][i].getValue() !== 1) {
                    break;
                } else if(i === 2) {
                    console.log('X win');
                }
            }

            // Diagonal check O
            for (let i = 0; i < 3; i++) {
                if (board.getBoard()[i][i].getValue() !== 2) {
                    break;
                } else if(i === 2) {
                    console.log('O win');
                }
            }
        }

        // Anti-Diagonal
        let j = 2;
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[i][j].getValue() !== 1) {
                break;
            } else if(i === 2) {
                console.log('X win');
            }

            j--;
        }

        j = 2;
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[i][j].getValue() !== 2) {
                break;
            } else if(i === 2) {
                console.log('O win');
            }

            j--;
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    }

})();
