import { useEffect, useState } from 'react';

import { PlayerTurnIndicator } from './PlayerTurnIndicator';
import { Gameboard } from './Gameboard';
import { ScoreCard } from './ScoreCard';
import { OverlayBox } from './OverlayBox';
import { gameMode } from '../../shared/lib';

import xTokenImage from '../assets/icon-x.svg';
import logo from '../assets/logo.svg';
import { socket } from '../socket';

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

    const [playerTurn, setPlayerTurn] = useState(1);

    const updateBoard = (position: [number, number]) => {
        // Disconnect listeners to avoid multiple triggers
        socket.off('board-update');
        socket.off('game-won');

        socket.emit('gameboard-click', position);
        socket.on('board-update', (board) => {
            setBoard(board);
        });

        socket.on('game-won', (result) => {
            alert(`Player ${result} wins!`);
        });
    };

    const updatePlayerTurn = () => {
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
    };

    useEffect(() => {
        socket.on('board-update', (board) => {
            setBoard(board);
        });
    }, []);

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
            <OverlayBox
                mainText="Restart Game?"
                buttonOneText="No, Cancel"
                buttonTwoText="Yes, Restart"
            ></OverlayBox>
        </div>
    );
};
