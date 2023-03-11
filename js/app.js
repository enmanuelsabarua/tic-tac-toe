// const Player = (name, selection) => {
//     return {name, selection};
// }
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
    const board = [];

    for (let i = 0; i < 9; i++) {
        board.push(Square());
    }

    const getBoard = () => board;

    const selectSquare = (square, player) => {

        const unavailableSquares = [];

        for (let i = 0; i < board.length; i++) {
            if (board[i].getValue() !== 0) unavailableSquares.push(i);
        }

        if (unavailableSquares.includes(square)) return;

        board[square].addValue(player);
    };

    const printBoard = () => {
        const boardWithSquareValues = board.map(square => square.getValue());
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

    const playRound = square => {
        console.log(
            `Selecting ${getActivePlayer().name}'s option into the ${square} square`
        );
        board.selectSquare(square, getActivePlayer().option);

        // winner finish
            for (let i = 0; i < board.length; i++) {
                if (i === 0 || i === 1 || i === 2 ) {

                }
            }
        // 

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    }

})();
