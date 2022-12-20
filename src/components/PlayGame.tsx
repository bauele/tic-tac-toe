import { useState } from 'react';

import { Gameboard } from './Gameboard';

type PlayGameProps = {};

export const PlayGame = ({}: PlayGameProps) => {
    const [board, setBoard] = useState([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]);

    const [playerTurn, setPlayerTurn] = useState(1);

    const updateBoard = (position: [number, number]) => {
        /*  Check if space on the board is available 
            TODO: This should eventually be replaced with an API call and the
            server will determine if the space is available or not */
        if (board[position[0]][position[1]] === 0) {
            let currentBoard = board;
            currentBoard[position[0]][position[1]] = playerTurn;
            setBoard(currentBoard);
            updatePlayerTurn();
        }
    };

    const updatePlayerTurn = () => {
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
    };

    return (
        <div className="flex-row-center new-game-menu play-game">
            <Gameboard board={board} onUpdate={updateBoard} />
        </div>
    );
};
