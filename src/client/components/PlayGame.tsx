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
import { BoardLine } from '../../server/src/ts/lib';

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
    const [testOverlay, setTestOverlay] = useState<
        OverlayBox | null | JSX.Element
    >(null);

    const [playerTurn, setPlayerTurn] = useState(1);
    const [victoryPosition, setVictoryPosition] = useState<BoardLine | null>(
        null
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
                    if (gameState.victoryPosition) {
                        setVictoryPosition(gameState.victoryPosition);
                        showOverlayBoxVictory(currentMarkTurn);
                    }
                } else if (gameState.status === GameStatus.DRAW) {
                    showOverlayBoxVictory(Mark.NONE);
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

            setOverlayVisible(true);
        });
    };

    const showOverlayBoxVictory = (winningPlayer: number) => {
        const determineSubtextString = () => {
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

        const determineTextColor = (winningMark: Mark) => {
            if (winningMark === Mark.ONE) {
                return 'overlay-light-blue';
            } else if (winningMark === Mark.TWO) {
                return 'overlay-light-yellow';
            } else {
                return '';
            }
        };

        const determineImage = (winningMark: Mark) => {
            if (winningMark === Mark.ONE) {
                return `${xTokenImage}`;
            } else if (winningMark === Mark.TWO) {
                return `${oTokenImage}`;
            } else {
                return '';
            }
        };

        if (winningPlayer === Mark.ONE || winningPlayer === Mark.TWO) {
            setTestOverlay(
                <OverlayBox
                    subText={determineSubtextString()}
                    mainText="Takes the round!"
                    mainTextColor={determineTextColor(winningPlayer)}
                    mainImage={determineImage(winningPlayer)}
                    buttonOneText="Quit"
                    buttonOneOnClick={() => {
                        navigate('/');
                    }}
                    buttonTwoText="Next Round"
                    buttonTwoOnClick={() => {
                        socket.emit('reset-board');
                        setOverlayVisible(false);
                    }}
                ></OverlayBox>
            );

            setOverlayVisible(true);
        } else if (winningPlayer === Mark.NONE) {
            setTestOverlay(
                <OverlayBox
                    subText={determineSubtextString()}
                    mainText="Round tied"
                    mainTextColor={determineTextColor(winningPlayer)}
                    mainImage={determineImage(winningPlayer)}
                    buttonOneText="Quit"
                    buttonOneOnClick={() => {
                        navigate('/');
                    }}
                    buttonTwoText="Next Round"
                    buttonTwoOnClick={() => {
                        socket.emit('reset-board');
                        setOverlayVisible(false);
                    }}
                ></OverlayBox>
            );

            setOverlayVisible(true);
        }
    };

    useEffect(() => {
        /*
        socket.on('board-update', (board, playerTurn) => {
            setBoard(board);
            setPlayerTurn(playerTurn);
        });
        */
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
                victoryLine={victoryPosition}
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
                    {testOverlay}
                </>
            ) : (
                <></>
            )}
        </div>
    );
};
