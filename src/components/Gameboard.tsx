import { GameboardSpace } from './GameboardSpace';

import xTokenImage from '../assets/icon-x.svg';
import oTokenImage from '../assets/icon-o.svg';

type GameboardProps = {
    board: Array<Array<number>>;
    onUpdate: (position: [number, number]) => void;
};

export const Gameboard = ({ board, onUpdate }: GameboardProps) => {
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
                >
                    {value !== 0 ? (
                        value === 1 ? (
                            <img
                                className="gameboard-token"
                                src={xTokenImage}
                                aria-label="x-mark"
                            />
                        ) : (
                            <img
                                className="gameboard-token"
                                src={oTokenImage}
                                aria-label="o-mark"
                            />
                        )
                    ) : (
                        <div aria-label="empty-space"></div>
                    )}
                </GameboardSpace>
            );
        });
    });

    return <div className="gameboard"> {gameBoardSpaces} </div>;
};
