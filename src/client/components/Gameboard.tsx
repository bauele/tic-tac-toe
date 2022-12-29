import { GameboardSpace } from './GameboardSpace';

import xTokenImage from '../assets/icon-x.svg';
import oTokenImage from '../assets/icon-o.svg';
import xTokenOutline from '../assets/icon-x-outline.svg';
import oTokenOutline from '../assets/icon-o-outline.svg';
import { VictoryPosition } from '../../shared/lib';

type GameboardProps = {
    board: Array<Array<number>>;
    onUpdate: (position: [number, number]) => void;
    victoryPosition?: { i: number; j: number }[];
};

export const Gameboard = ({
    board,
    onUpdate,
    victoryPosition,
}: GameboardProps) => {
    const gameToken = (value: number) => {
        if (value === 1) {
            return (
                <img
                    className="gameboard-token"
                    src={oTokenImage}
                    aria-label="o-mark"
                />
            );
        } else if (value === 2) {
            return (
                <img
                    className="gameboard-token"
                    src={xTokenImage}
                    aria-label="x-mark"
                />
            );
        }
    };

    const highlightGameToken = (row: number, col: number, value: number) => {
        if (victoryPosition !== undefined) {
            for (let x = 0; x < victoryPosition?.length; x++) {
                console.log('x = ', x);

                if (
                    victoryPosition[x].i === row &&
                    victoryPosition[x].j === col
                ) {
                    if (value === 1) {
                        return (
                            <div className="token-image-filter-dark-navy">
                                <img
                                    className="gameboard-token"
                                    src={oTokenImage}
                                    aria-label="o-mark"
                                />
                            </div>
                        );
                    } else if (value === 2) {
                        return (
                            <div className="token-image-filter-dark-navy">
                                <img
                                    className="gameboard-token"
                                    src={xTokenImage}
                                    aria-label="x-mark"
                                />
                            </div>
                        );
                    }
                }
            }
        }
        if (value === 1) {
            return (
                <img
                    className="gameboard-token"
                    src={oTokenImage}
                    aria-label="o-mark"
                />
            );
        } else if (value === 2) {
            return (
                <img
                    className="gameboard-token"
                    src={xTokenImage}
                    aria-label="x-mark"
                />
            );
        }
    };

    const highlightBoardSpace = (row: number, col: number, value: number) => {
        if (victoryPosition !== undefined) {
            console.log(`Evaluating ${row}, ${col}`);
            console.log('victoryPosition = ', victoryPosition);
            for (let x = 0; x < victoryPosition?.length; x++) {
                console.log('x = ', x);

                if (
                    victoryPosition[x].i === row &&
                    victoryPosition[x].j === col
                ) {
                    if (value === 1) {
                        return 'light-yellow';
                    } else if (value === 2) {
                        return 'light-blue';
                    }
                }
            }
        } else {
            return 'none';
        }
    };

    const gameBoardSpaces = board.map((row: number[], rowIndex: number) => {
        return row.map((value: number, colIndex: number) => {
            return (
                <GameboardSpace
                    /*  Using row.length will factor in all of the elements
                        in the previous rows. Assuming a row.length of 3,
                        row.length (3) * rowIndex (1) * colIndex (0) returns
                        3 for the first element in the first row */
                    key={row.length * rowIndex + colIndex}
                    onClick={() => onUpdate([rowIndex, colIndex])}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.code === 'Space') {
                            onUpdate([rowIndex, colIndex]);
                        }
                    }}
                    highlight={highlightBoardSpace(rowIndex, colIndex, value)}
                >
                    {highlightGameToken(rowIndex, colIndex, value)}
                </GameboardSpace>
            );
        });
    });

    return <div className="play-game-grid"> {gameBoardSpaces} </div>;
};
