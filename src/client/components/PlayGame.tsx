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

import { useNavigate } from 'react-router-dom';

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

interface Score {
    xWins: 0;
    oWins: 0;
    ties: 0;
}

export const PlayGame = ({ gameMode, playerMark }: PlayGameProps) => {
    const navigate = useNavigate();

    const [board, setBoard] = useState([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]);

    const [score, setScore] = useState({
        xWins: 0,
        oWins: 0,
        ties: 0,
    });

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
            if (result === 1) {
                let currentScore = score;
                currentScore.xWins++;
                setScore(currentScore);
            } else if (result === 2) {
                let currentScore = score;
                currentScore.oWins++;
                setScore(currentScore);
            } else if (result === 3) {
                let currentScore = score;
                currentScore.ties++;
                setScore(currentScore);
            }
            showOverlayBoxVictory(result);
        });
    };

    const updatePlayerTurn = () => {
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
    };

    const showOverlayBoxVictory = (winningPlayer: number) => {
        if (winningPlayer === 1 || winningPlayer === 2) {
            const overlayBox = {
                visible: true,

                mainTextColor: '',
                mainImage:
                    winningPlayer === 1
                        ? `${xTokenImage}`
                        : winningPlayer === 2
                        ? `${oTokenImage}`
                        : '',
                subText: `Player ${winningPlayer} wins!`,

                mainText: 'Takes the round!',
                buttonOneText: 'Quit',
                buttonOneOnClick: () => {
                    navigate('/');
                },
                buttonTwoText: 'Next Round',
                buttonTwoOnClick: () => {
                    socket.emit('reset-board');
                    const disableOverlay = overlayBox;
                    overlayBox.visible = false;
                    setOverlayBox(disableOverlay);
                },
            };

            setOverlayBox(overlayBox);
        }

        // Tie condition
        else if (winningPlayer === 3) {
            const overlayBox = {
                visible: true,
                mainTextColor: '',
                mainImage: '',
                subText: '',

                mainText: 'Round tied',
                buttonOneText: 'Quit',
                buttonOneOnClick: () => {
                    navigate('/');
                },
                buttonTwoText: 'Next Round',
                buttonTwoOnClick: () => {
                    socket.emit('reset-board');

                    const disableOverlay = overlayBox;
                    overlayBox.visible = false;
                    setOverlayBox(disableOverlay);
                },
            };

            setOverlayBox(overlayBox);
        }
    };

    useEffect(() => {
        socket.on('board-update', (board) => {
            setBoard(board);
        });
    }, []);

    const firstScoreCardText = () => {
        if (gameMode === 'singlePlayer') {
            if (playerMark === 0) {
                return 'X (You)';
            } else {
                return 'X (CPU)';
            }
        } else if (gameMode === 'localMultiplayer') {
            return 'P1 (X)';
        } else {
            return 'Error';
        }
    };

    const secondScoreCardText = () => {
        if (gameMode === 'singlePlayer') {
            if (playerMark === 0) {
                return 'O (CPU)';
            } else {
                return 'O (You)';
            }
        } else if (gameMode === 'localMultiplayer') {
            return 'P2 (O)';
        } else {
            return 'Error';
        }
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
                <ScoreCard
                    color="light-blue"
                    heading={firstScoreCardText()}
                    score={score.xWins}
                />
                <ScoreCard color="silver" heading="Ties" score={score.ties} />
                <ScoreCard
                    color="light-yellow"
                    heading={secondScoreCardText()}
                    score={score.oWins}
                />
            </div>
            {overlayBox.visible ? (
                <>
                    <div className="overlay-shadow" />
                    <OverlayBox
                        subText={overlayBox.subText}
                        mainText={overlayBox.mainText}
                        mainImage={overlayBox.mainImage}
                        buttonOneText={overlayBox.buttonOneText}
                        buttonOneOnClick={overlayBox.buttonOneOnClick}
                        buttonTwoText={overlayBox.buttonTwoText}
                        buttonTwoOnClick={overlayBox.buttonTwoOnClick}
                    ></OverlayBox>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};
