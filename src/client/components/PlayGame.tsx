import { useEffect, useState } from 'react';

import { PlayerTurnIndicator } from './PlayerTurnIndicator';
import { Gameboard } from './Gameboard';
import { ScoreCard } from './ScoreCard';
import { OverlayBox } from './OverlayBox';
import { gameMode } from '../../server/src/ts/lib';

import xTokenImage from '../assets/icon-x.svg';
import oTokenImage from '../assets/icon-o.svg';
import logo from '../assets/logo.svg';
import { socket } from '../socket';

import { useNavigate } from 'react-router-dom';
import { GameState, GameStatus } from '../../server/src/ts/ticTacToeBoard';
import { Mark } from '../../server/src/ts/enums';

type PlayGameProps = {
    gameMode: gameMode;
    playerMark: number;
};

interface OverlayBox {
    visible: boolean;
    mainText: string;
    mainTextColor?: string;
    mainImage?: string;
    subText?: string;
    buttonOneText: string;
    buttonOneOnClick?: () => void;
    buttonTwoText: string;
    buttonTwoOnClick?: () => void;
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

    const [overlayVisible, setOverlayVisible] = useState(false);

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
    const [victoryPosition, setVictoryPosition] = useState(
        new Array<{ i: number; j: number }>()
    );

    const updateBoard = (position: [number, number]) => {
        // Disconnect listeners to avoid multiple triggers
        socket.off('game-won');

        socket.emit('gameboard-click', position);

        socket.off('game-state-update');
        socket.on(
            'game-state-update',
            (gameState: GameState, currentMarkTurn: Mark) => {
                console.log(gameState);
                console.log(currentMarkTurn);

                setBoard(gameState.gameboard);
                if (gameState.status === GameStatus.IN_PROGRESS) {
                    setPlayerTurn(currentMarkTurn);
                } else if (
                    gameState.status === GameStatus.MARK_ONE_VICTORY ||
                    gameState.status === GameStatus.MARK_TWO_VICTORY
                ) {
                    //  TODO: This will not always show the correct winning player
                    showOverlayBoxVictory(currentMarkTurn);
                }
            }
        );

        /*
        socket.on(
            'game-won',
            (result: number, victoryPosition: { i: number; j: number }[]) => {
                setVictoryPosition(victoryPosition);

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
                setOverlayVisible(true);
            }
        );
        */

        socket.on('invalid-player', () => {
            const overlayBox = {
                visible: true,

                mainTextColor: '',
                mainImage: '',
                subText: `You refreshed the page`,

                mainText: `Let's get you back to the main menu`,
                buttonOneText: 'Okay!',
                buttonOneOnClick: () => {
                    navigate('/');
                },
                buttonTwoText: '',
                buttonTwoOnClick: () => {},
            };

            setOverlayBox(overlayBox);
            setOverlayVisible(true);
        });
    };

    const updatePlayerTurn = () => {
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
    };

    const showOverlayBoxVictory = (winningPlayer: number) => {
        const subtextString = () => {
            if (gameMode === 'singlePlayer') {
                if (
                    (winningPlayer === 1 && playerMark === 0) ||
                    (winningPlayer === 2 && playerMark === 1)
                ) {
                    return 'You won!';
                } else {
                    return 'Oh no, you lost...';
                }
            } else {
                if (winningPlayer === 1) {
                    return 'Player 1 wins!';
                } else {
                    return 'Player 2 wins!';
                }
            }
        };
        if (winningPlayer === 1 || winningPlayer === 2) {
            const overlayBox = {
                visible: true,

                mainImage:
                    winningPlayer === 1
                        ? `${xTokenImage}`
                        : winningPlayer === 2
                        ? `${oTokenImage}`
                        : '',
                subText: subtextString(),

                mainText: 'Takes the round!',
                mainTextColor:
                    winningPlayer === 1
                        ? `overlay-light-blue`
                        : winningPlayer === 2
                        ? `overlay-light-yellow`
                        : '',
                buttonOneText: 'Quit',
                buttonOneOnClick: () => {
                    navigate('/');
                },
                buttonTwoText: 'Next Round',
                buttonTwoOnClick: () => {
                    socket.emit('reset-board');
                    setVictoryPosition([]);
                    setOverlayVisible(false);
                },
            };
            setOverlayVisible(true);

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

                    setOverlayVisible(false);
                },
            };

            setOverlayVisible(true);
            setOverlayBox(overlayBox);
        }
    };

    useEffect(() => {
        socket.on('board-update', (board, playerTurn) => {
            setBoard(board);
            setPlayerTurn(playerTurn);
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

    const reloadGame = () => {
        setOverlayVisible(true);

        const overlayBox = {
            visible: true,
            mainTextColor: '',
            mainImage: '',
            subText: '',

            mainText: 'Restart game?',
            buttonOneText: 'No, cancel',
            buttonOneOnClick: () => {
                socket.emit('');

                setOverlayVisible(false);
            },
            buttonTwoText: 'Yes, Restart',
            buttonTwoOnClick: () => {
                socket.emit('reset-board');
                setOverlayVisible(false);
            },
        };

        setOverlayBox(overlayBox);
    };

    return (
        <div className="main-horizontal-content play-game">
            <div className="play-game-grid play-game-top-menu  flex-row-space-between">
                <img src={logo} aria-label="logo" />
                <PlayerTurnIndicator playerTurn={playerTurn} />
                <button
                    className="play-game-reload play-game-top-menu-expanding-element bg-silver box-shadow-silver-sm"
                    onClick={reloadGame}
                >
                    <p className="heading-xs">↻</p>
                </button>
            </div>
            <Gameboard
                board={board}
                onUpdate={updateBoard}
                victoryPosition={victoryPosition}
            />
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
            {overlayVisible ? (
                <>
                    <div className="overlay-shadow" />
                    <OverlayBox
                        subText={overlayBox.subText}
                        mainText={overlayBox.mainText}
                        mainTextColor={overlayBox.mainTextColor}
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
