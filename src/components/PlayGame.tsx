import { useState } from 'react';

import { Gameboard } from './Gameboard';
import { PlayerTurnIndicator } from './PlayerTurnIndicator';

import logo from '../assets/logo.svg';

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
        <div className="flex-col-center new-game-menu play-game">
            <div className="play-game-grid play-game-top-menu  flex-row-space-between">
                <img src={logo} aria-label="logo" />
                <PlayerTurnIndicator playerTurn={playerTurn} />
                <button className="play-game-reload play-game-top-menu-expanding-element bg-silver box-shadow-silver-sm">
                    <p className="heading-xs">↻</p>
                </button>
            </div>
            <Gameboard board={board} onUpdate={updateBoard} />
        </div>
    );
};
