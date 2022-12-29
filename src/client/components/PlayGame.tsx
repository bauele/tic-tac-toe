import { useEffect, useState } from 'react';

import { PlayerTurnIndicator } from './PlayerTurnIndicator';
import { Gameboard } from './Gameboard';
import { ScoreCard } from './ScoreCard';
import { OverlayBox } from './OverlayBox';
import { gameMode } from '../../shared/lib';

import xTokenImage from '../assets/icon-x.svg';
import oTokenImage from '../assets/icon-o.svg';
import logo from '../assets/logo.svg';
import { socket } from '../socket';

type PlayGameProps = {
    gameMode: gameMode;
    playerMark: number;
};

interface OverlayBox {
    visible: boolean;
    mainText: string;
    mainTextColor?: 'light-yellow' | 'light-blue';
    mainImage?: string;
    subText?: string;
    buttonOneText: string;
    buttonOneOnClick?: Function;
    buttonTwoText: string;
    buttonTwoOnClick?: Function;
}

export const PlayGame = ({ gameMode, playerMark }: PlayGameProps) => {
    const [board, setBoard] = useState([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]);

    const [overlayBox, setOverlayBox] = useState({
        visible: false,
        mainText: '',
        mainTextColor: '',
        mainImage: '',
        subText: '',
        buttonOneText: '',
        buttonOneOnClick: () => {},
        buttonTwoText: '',
        buttonTwoOnClick: () => {},
    });
    const [playerTurn, setPlayerTurn] = useState(1);

    const updateBoard = (position: [number, number]) => {
        // Disconnect listeners to avoid multiple triggers
        socket.off('board-update');
        socket.off('game-won');

        socket.emit('gameboard-click', position);
        socket.on('board-update', (board) => {
            setBoard(board);
        });

        socket.on('game-won', (result: number) => {
            console.log('res = ', result);
            showOverlayBoxVictory(result);
        });
    };

    const updatePlayerTurn = () => {
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
    };

    const showOverlayBoxVictory = (winningPlayer: number) => {
        const overlayBox = {
            mainTextColor: '',
            mainImage:
                winningPlayer === 1
                    ? `${xTokenImage}`
                    : winningPlayer === 2
                    ? `${oTokenImage}`
                    : '',
            subText: `Player ${winningPlayer} wins!`,

            visible: true,
            mainText: 'Takes the round!',
            buttonOneText: 'Quit',
            buttonOneOnClick: () => {},
            buttonTwoText: 'Next Round',
            buttonTwoOnClick: () => {},
        };

        setOverlayBox(overlayBox);
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
            {overlayBox.visible ? (
                <OverlayBox
                    subText={overlayBox.subText}
                    mainText={overlayBox.mainText}
                    mainImage={overlayBox.mainImage}
                    buttonOneText={overlayBox.buttonOneText}
                    buttonOneOnClick={overlayBox.buttonOneOnClick}
                    buttonTwoText={overlayBox.buttonTwoText}
                    buttonTwoOnClick={overlayBox.buttonTwoOnClick}
                ></OverlayBox>
            ) : (
                <></>
            )}
        </div>
    );
};
