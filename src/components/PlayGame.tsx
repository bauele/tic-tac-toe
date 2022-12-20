import { useState } from 'react';

import { Gameboard } from './Gameboard';

import xTokenImage from '../assets/icon-x.svg';
import oTokenImage from '../assets/icon-o.svg';
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
                {' '}
                <img src={logo} aria-label="logo" />
                <div className="player-turn-indicator bg-semi-dark-navy box-shadow-semi-dark-navy-sm border-radius-5">
                    <div className="player-turn-indicator-group">
                        <div className="token-image-filter-silver">
                            {playerTurn === 1 ? (
                                <img
                                    className="player-turn-mark o"
                                    src={xTokenImage}
                                    aria-label={'x-mark'}
                                />
                            ) : (
                                <img
                                    className="player-turn-mark"
                                    src={oTokenImage}
                                    aria-label={'x-mark'}
                                />
                            )}
                        </div>
                        <p className="play-turn-heading upper-text"> Turn</p>
                    </div>
                </div>
                <button className="play-game-reload bg-silver box-shadow-silver-sm border-radius-5">
                    <p className="heading-xs">↻</p>
                </button>
            </div>
            <Gameboard board={board} onUpdate={updateBoard} />
        </div>
    );
};
