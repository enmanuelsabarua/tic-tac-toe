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
        if (board[row][column].getValue() !== 0) return 0;

        board[row][column].addValue(player);
    };

    const printBoard = () => {
        const boardWithSquareValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithSquareValues);
    };

    return { getBoard, selectSquare, printBoard };
})();



const GameController = ((
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
        const switchPlayer = board.selectSquare(row, column, getActivePlayer().option);

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

        if (switchPlayer !== 0) {
            switchPlayerTurn();
            printNewRound();
        }
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
    }

})();

const ScreenController = (() => {
    const game = GameController;
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        let squares = 1;
        board.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {

                const squareButton = document.createElement("button");
                squareButton.classList.add('square');
                squareButton.classList.add('square');

                squareButton.classList.add(`square${squares}`);
                squares++;

                squareButton.dataset.row = rowIndex;
                squareButton.dataset.column = columnIndex;

                if (column.getValue() === 0) {
                    squareButton.textContent = '';
                } else if (column.getValue() === 1) {
                    squareButton.textContent = 'X';
                } else if (column.getValue() === 2) {
                    squareButton.textContent = 'O';
                }
                boardDiv.appendChild(squareButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();
})();