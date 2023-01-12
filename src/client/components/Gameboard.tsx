import { GameboardSpace } from './GameboardSpace';

import xTokenImage from '../assets/icon-x.svg';
import oTokenImage from '../assets/icon-o.svg';
import { BoardPosition } from '../../server/src/ts/lib';
import { BoardLine, LineOrientation } from '../../server/src/ts/lib';
import { useEffect, useState } from 'react';
import { Mark } from '../../server/src/ts/enums';

type GameboardProps = {
    //  Prop representing the gameboard
    board: Array<Array<Mark>>;

    //  Prop indicating a parent function to be called when GameboardSpace
    //  components are interacted with
    onUpdate: (position: [number, number]) => void;

    //  Optional prop indicating the area of the board that triggered the
    //  victory condition for a player
    victoryLine?: BoardLine | null;
};

export const Gameboard = ({ board, onUpdate, victoryLine }: GameboardProps) => {
    const [victoryLineSpaces, setVictoryLineSpaces] = useState<
        BoardPosition[] | null
    >(null);

    //  Whenever victoryLine has been changed, the Gameboard determine which
    //  spaces on the board are within that victoryLine
    useEffect(() => {
        setVictoryLineSpaces(null);
        determineVictoryLineSpaces();
    }, [victoryLine]);

    const determineVictoryLineSpaces = () => {
        if (victoryLine) {
            const gameboardSpacesInLine = new Array<BoardPosition>();

            let rowOffset;
            let colOffset;

            //  Calculate the rowOffset and colOffset based on what direction
            //  the victoryLine should be moving from its startPosition
            if (victoryLine.orientation === LineOrientation.HORIZONTAL) {
                rowOffset = 0;
                colOffset = 1;
            } else if (victoryLine.orientation === LineOrientation.VERITCAL) {
                rowOffset = 1;
                colOffset = 0;
            } else if (
                victoryLine.orientation === LineOrientation.FOWARD_DIAGONAL
            ) {
                rowOffset = 1;
                colOffset = 1;
            } else if (
                victoryLine.orientation === LineOrientation.BACKWARD_DIAGONAL
            ) {
                rowOffset = -1;
                colOffset = 1;
            } else {
                //  TODO: Throw an error here!
                return;
            }

            gameboardSpacesInLine.push({
                x: victoryLine.startPosition.x,
                y: victoryLine.startPosition.y,
            });
            gameboardSpacesInLine.push({
                x: victoryLine.startPosition.x + rowOffset,
                y: victoryLine.startPosition.y + colOffset,
            });
            gameboardSpacesInLine.push({
                x: victoryLine.startPosition.x + rowOffset * 2,
                y: victoryLine.startPosition.y + colOffset * 2,
            });

            setVictoryLineSpaces(gameboardSpacesInLine);
        }
    };

    //  Determines the highlight color of a GameboardSpace if it is within the
    //  victoryLine
    const boardSpaceHighlightColor = (
        row: number,
        col: number,
        value: number
    ) => {
        if (victoryLineSpaces) {
            for (let i = 0; i < victoryLineSpaces.length; i++) {
                if (
                    row === victoryLineSpaces[i].x &&
                    col === victoryLineSpaces[i].y
                ) {
                    if (value === Mark.ONE) {
                        return 'light-blue';
                    } else if (value === Mark.TWO) {
                        return 'light-yellow';
                    }
                }
            }
        }

        return 'none';
    };

    //  Returns the game token piece for the given board space. The game token
    //  will be automatically highlighted if it is found to be within the
    //  victoryLine
    const gameToken = (row: number, col: number, value: number) => {
        if (victoryLineSpaces) {
            for (let i = 0; i < victoryLineSpaces.length; i++) {
                if (
                    row === victoryLineSpaces[i].x &&
                    col === victoryLineSpaces[i].y
                ) {
                    if (value === Mark.ONE) {
                        return (
                            <div className="token-image-filter-dark-navy">
                                <img
                                    className="gameboard-token"
                                    src={xTokenImage}
                                    aria-label="o-mark"
                                />
                            </div>
                        );
                    } else if (value === Mark.TWO) {
                        return (
                            <div className="token-image-filter-dark-navy">
                                <img
                                    className="gameboard-token"
                                    src={oTokenImage}
                                    aria-label="x-mark"
                                />
                            </div>
                        );
                    }
                }
            }
        }

        if (value === Mark.ONE) {
            return (
                <img
                    className="gameboard-token"
                    src={xTokenImage}
                    aria-label="x-mark"
                />
            );
        } else if (value === Mark.TWO) {
            return (
                <img
                    className="gameboard-token"
                    src={oTokenImage}
                    aria-label="x-mark"
                />
            );
        }
    };

    //  Map the board to GameboardSpace components
    const gameBoardSpaces = board.map((row: number[], rowIndex: number) => {
        return row.map((value: number, colIndex: number) => {
            return (
                <GameboardSpace
                    //  Using row.length will factor in all of the elements
                    //  in the previous rows. Assuming a row.length of 3,
                    //  row.length (3) * rowIndex (1) * colIndex (0) returns
                    //  3 for the first element in the first row
                    key={row.length * rowIndex + colIndex}
                    onClick={() => onUpdate([rowIndex, colIndex])}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.code === 'Space') {
                            onUpdate([rowIndex, colIndex]);
                        }
                    }}
                    highlight={boardSpaceHighlightColor(
                        rowIndex,
                        colIndex,
                        value
                    )}
                >
                    {gameToken(rowIndex, colIndex, value)}
                </GameboardSpace>
            );
        });
    });

    return <div className="play-game-grid"> {gameBoardSpaces} </div>;
};
