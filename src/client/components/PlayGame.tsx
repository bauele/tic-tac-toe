import { useEffect, useState } from 'react';

import { PlayerTurnIndicator } from './PlayerTurnIndicator';
import { TokenOutlineMode, Gameboard } from './Gameboard';
import { ScoreCard } from './ScoreCard';
import { OverlayBox } from './OverlayBox';
import { gameMode } from '../../server/src/ts/lib';

import xTokenImage from '../assets/icon-x.svg';
import oTokenImage from '../assets/icon-o.svg';
import reloadImage from '../assets/icon-restart.svg';
import logo from '../assets/logo.svg';
import { socket } from '../socket';

import { useNavigate } from 'react-router-dom';
import { GameState, GameStatus } from '../../server/src/ts/ticTacToeBoard';
import { Mark } from '../../server/src/ts/enums';
import { BoardLine } from '../../server/src/ts/lib';
import { SessionScoreInfo } from '../../server/src/ts/session';

type PlayGameProps = {
    //  Prop indicating the game mode the player would like to play
    gameMode: gameMode;

    //  Prop indicating the mark the player will be using
    playerMark: Mark;
};

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

    //  overlay will refer to a OverlayBox component that is built and shown
    //  on the screen after a player victory or draw
    const [overlay, setOverlay] = useState<JSX.Element | null>(null);

    const [playerTurn, setPlayerTurn] = useState(Mark.ONE);
    const [victoryPosition, setVictoryPosition] = useState<BoardLine | null>(
        null
    );

    useEffect(() => {
        //  Disconnect from the socket even to avoid multiple triggers
        socket.off('game-state-update');

        //  This event is received from the server when information about the
        //  player's game changes
        socket.on(
            'game-state-update',
            (
                gameState: GameState,
                currentMarkTurn: Mark,
                sessionScore: SessionScoreInfo
            ) => {
                //  Set the board to the same state as the server's board
                setBoard(gameState.gameboard);

                //  Update the score
                setScore({
                    xWins: sessionScore.markOneWins,
                    oWins: sessionScore.markTwoWins,
                    ties: sessionScore.draws,
                });

                //  Set the victory position on the game board.
                setVictoryPosition(gameState.victoryPosition);

                //  Determine what UI indicators to show the player based on
                //  the current state of the game
                if (gameState.status === GameStatus.IN_PROGRESS) {
                    setPlayerTurn(currentMarkTurn);
                } else if (
                    gameState.status === GameStatus.MARK_ONE_VICTORY ||
                    gameState.status === GameStatus.MARK_TWO_VICTORY
                ) {
                    showOverlayBoxVictory(currentMarkTurn);
                } else if (gameState.status === GameStatus.DRAW) {
                    showOverlayBoxVictory(Mark.NONE);
                }
            }
        );

        //  This message is recieved if the server cannot identify which game a
        //  player is supposed to be associated with
        socket.on('invalid-player', () => {
            showOverlayBoxInvalidPlayer();
        });

        //  If page is refreshed, direct user back to main screen
        window.onload = function () {
            navigate('/');
        };

        return () => {
            window.onload = null;
        };
    }, []);

    //  Function that determines which game token outlines will be present
    //  when the player hovers over a GameboardSpace. If player is in a
    //  single player game, then they should only see their own mark. If
    //  it's a multiplayer game, then both marks should be visible
    const determineOutlineMode = () => {
        if (gameMode === 'singlePlayer') {
            if (playerMark === Mark.ONE) {
                return TokenOutlineMode.MARK_ONE_ONLY;
            } else if (playerMark === Mark.TWO) {
                return TokenOutlineMode.MARK_TWO_ONLY;
            }
        } else if (gameMode === 'localMultiplayer') {
            return TokenOutlineMode.BOTH_MARKS;
        }
    };

    //  Function that is called whenever player clicks on a space on the
    //  Gameboard
    const updateBoard = (position: [number, number]) => {
        socket.emit('gameboard-click', position);
    };

    //  Function defining behavior for the reload button
    const reloadGame = () => {
        setOverlay(
            <OverlayBox
                mainText="Restart game?"
                buttonOneText="No, cancel"
                buttonOneOnClick={() => {
                    setOverlayVisible(false);
                }}
                buttonTwoText="Yes, Restart"
                buttonTwoOnClick={() => {
                    socket.emit('next-round');
                    setOverlayVisible(false);
                }}
            ></OverlayBox>
        );

        setOverlayVisible(true);
    };

    //  Functions used to determine what text is present on the ScoreCards
    const firstScoreCardText = () => {
        if (gameMode === 'singlePlayer') {
            if (playerMark === Mark.ONE) {
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
            if (playerMark === Mark.ONE) {
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

    const showOverlayBoxInvalidPlayer = () => {
        setOverlay(
            <OverlayBox
                subText="Let's get you back to the menu"
                mainText="Sorry, we lost your game!"
                buttonOneText="Ok"
                buttonOneOnClick={() => {
                    navigate('/');
                    setOverlayVisible(false);
                }}
                buttonTwoText=""
            ></OverlayBox>
        );

        setOverlayVisible(true);
    };

    //  Function dedicated to building the OverlayBox component that is shown
    //  after a game victory or draw
    const showOverlayBoxVictory = (winningPlayer: number) => {
        const determineSubtextString = () => {
            if (gameMode === 'singlePlayer') {
                if (winningPlayer === playerMark) {
                    return 'You won!';
                } else {
                    return 'Oh no, you lost...';
                }
            } else {
                if (winningPlayer === Mark.ONE) {
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
            setOverlay(
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
                        socket.emit('next-round');
                        setOverlayVisible(false);
                    }}
                ></OverlayBox>
            );

            setOverlayVisible(true);
        } else if (winningPlayer === Mark.NONE) {
            setOverlay(
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
                        socket.emit('next-round');
                        setOverlayVisible(false);
                    }}
                ></OverlayBox>
            );

            setOverlayVisible(true);
        }
    };

    return (
        <div className="main-horizontal-content play-game">
            <div className="play-game-grid play-game-top-menu flex-row-space-between">
                <img
                    src={logo}
                    aria-label="logo"
                    className="site-logo"
                    onClick={() => navigate('/')}
                />
                <PlayerTurnIndicator playerTurn={playerTurn} />
                <button
                    className="play-game-reload play-game-top-menu-expanding-element bg-silver box-shadow-silver-sm"
                    onClick={reloadGame}
                >
                    <img src={reloadImage}></img>
                </button>
            </div>
            <Gameboard
                board={board}
                onUpdate={updateBoard}
                tokenOutlineMode={determineOutlineMode()}
                playerTurn={playerTurn}
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
                    {overlay}
                </>
            ) : (
                <></>
            )}
        </div>
    );
};
