/*
** 0: no option is in the square,
** 1: Player One's option,
** 2: Player 2's option
*/
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

/*
** The Gameboard represents the state of the board
** Each square holds a Square
** and we expose a selectSquare method to be able to select squares on the board
*/
const GameBoard = (() => {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create a 2d array that will represent the state of the game board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Square());
        }
    }

    // This method get the board that our UI will need to render it
    const getBoard = () => board;

    // Select an available square
    const selectSquare = (row, column, player) => {

        // if the square is taken do not add a value and return 0
        if (board[row][column].getValue() !== 0) return 0;

        board[row][column].addValue(player);
    };

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
        const boardWithSquareValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithSquareValues);
    };

    // This method will be triggered when we want to reset the game
    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Square());
            }
        }
    }

    return { getBoard, selectSquare, printBoard, resetBoard };
})();


/* 
** The GameController will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/
const GameController = (
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

    let winner = 0;
    let tie = 0;

    const setWinner = (player) => {
        winner = player;
    }

    const getWinner = () => winner; 

    const playRound = (row, column) => {
        tie++;

        console.log(
            `Selecting ${getActivePlayer().name}'s option into the ${row} row and the ${column} column`
        );
        const switchPlayer = board.selectSquare(row, column, getActivePlayer().option);

        // Tie
        if (tie === 9) {
            setWinner(3);
        }

        // winner finish
        // Column check X
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[row][i].getValue() !== 1) {
                break;
            } else if(i === 2) {
                setWinner(1);
                console.log('O win');
            }
        }

        // Column check O
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[row][i].getValue() !== 2) {
                break;
            } else if(i === 2) {
                setWinner(2);
                console.log('O win');
            }
        }

        // Row check X
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[i][column].getValue() !== 1) {
                break;
            } else if(i === 2) {
                setWinner(1);
                console.log('X win');
            }
        }

        // Row check O
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[i][column].getValue() !== 2) {
                break;
            } else if(i === 2) {
                setWinner(2);
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
                    setWinner(1);
                    console.log('X win');
                }
            }

            // Diagonal check O
            for (let i = 0; i < 3; i++) {
                if (board.getBoard()[i][i].getValue() !== 2) {
                    break;
                } else if(i === 2) {
                    setWinner(2);
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
                setWinner(1);
                console.log('X win');
            }

            j--;
        }

        j = 2;
        for (let i = 0; i < 3; i++) {
            if (board.getBoard()[i][j].getValue() !== 2) {
                break;
            } else if(i === 2) {
                setWinner(2);
                console.log('O win');
            }

            j--;
        }

        // If the player does not select a taken square nor there's a winner, switch player turn
        if (switchPlayer !== 0 && getWinner() === 0) {
            switchPlayerTurn();
            printNewRound();
        }
    };

    printNewRound();

    // Interface that we need to use
    return {
        playRound,
        getActivePlayer,
        getWinner,
        setWinner,
        getBoard: board.getBoard,
        resetBoard: board.resetBoard,
    }

};

const ScreenController = (() => {
    let game = GameController();
    const formContainer = document.querySelector('.container');
    const startButton = document.querySelector('#start');

    // Start the game with the names entered
    startButton.addEventListener('click', e => {
        formContainer.classList.add('start');
        const playerOneName = document.querySelector('#name1').value;
        const playerTwoName = document.querySelector('#name2').value;

        if (playerOneName === '' && playerTwoName !== '') {
            game = GameController("Player One", playerTwoName);
        } else if (playerOneName !== '' && playerTwoName === '') {
            game = GameController(playerOneName, 'Player Two');
        } else if (playerOneName === '' && playerTwoName === '') {
            game = GameController();
        } else {
            game = GameController(playerOneName, playerTwoName);
        }

        updateScreen();
    });


    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const resetButton = document.querySelector('#reset');
    let finish = 0;

    function updateScreen() {
        // clear the board
        boardDiv.textContent = "";

        // get the newest version of the board, player turn and if there's a winner
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const winner = game.getWinner();

         // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        let squares = 1; // class name
        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {

                const squareButton = document.createElement("button");
                squareButton.classList.add('square');
                // squareButton.classList.add('square');
                squareButton.classList.add(`square${squares}`);
                squares++;

                // Create a data attribute to identify the row and column
                // This makes it easier to pass into our `playRound` function 
                squareButton.dataset.row = rowIndex;
                squareButton.dataset.column = columnIndex;

                if (winner === 1 || winner === 2) {
                    playerTurnDiv.textContent = `${activePlayer.name} Winner!`;
                    finish = 1;
                } else if (winner === 3) {
                    playerTurnDiv.textContent = `It's a tie!`;
                    finish = 1;
                }

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

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) return;

        if (!finish) game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerBoard);

    function reset(e) {
        game.resetBoard();
        game.setWinner(0);
        finish = 0;
        updateScreen();
    }

    resetButton.addEventListener('click', reset);

    // Initial render
    updateScreen();
})();