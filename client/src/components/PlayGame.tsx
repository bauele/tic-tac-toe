import { useEffect, useState } from 'react';

import { PlayerTurnIndicator } from './PlayerTurnIndicator';
import { Gameboard } from './Gameboard';
import { ScoreCard } from './ScoreCard';
import { gameMode } from '../lib';

import logo from '../assets/logo.svg';

import { io } from 'socket.io-client';

type PlayGameProps = {
    gameMode: gameMode;
    playerMark: number;
};

export const PlayGame = ({ gameMode, playerMark }: PlayGameProps) => {
    const [board, setBoard] = useState([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]);
    const [connected, setConnected] = useState(false);
    let socket;

    useEffect(() => {
        if (!connected) {
            socket = io('http://localhost:3001');
            setConnected(true);
        }
    }, []);

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
        <div className="main-horizontal-content play-game">
            <div className="play-game-grid play-game-top-menu  flex-row-space-between">
                <img src={logo} aria-label="logo" />
                <PlayerTurnIndicator playerTurn={playerTurn} />
                <button className="play-game-reload play-game-top-menu-expanding-element bg-silver box-shadow-silver-sm">
                    <p className="heading-xs">↻</p>
                </button>
            </div>
            <Gameboard board={board} onUpdate={updateBoard} />
            <div className="play-game-grid play-game-score-cards">
                <ScoreCard color="light-blue" heading="X (You)" score={0} />
                <ScoreCard color="silver" heading="Ties" score={0} />
                <ScoreCard color="light-yellow" heading="O (CPU)" score={0} />
            </div>
        </div>
    );
};
