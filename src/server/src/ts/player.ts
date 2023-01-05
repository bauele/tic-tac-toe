import EventEmitter from 'events';
import { TicTacToeBoard } from './ticTacToeBoard';
import { BoardPosition, Mark } from './enums';

export enum PlayerType {
    HUMAN,
    AI,
}

export interface Player {
    name: string;
    type: PlayerType;
    mark: number;
    eventListener: EventEmitter;
}

export const playerAIStrategy = (
    gameboard: TicTacToeBoard
): BoardPosition | false => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameboard.getBoard()[i][j] === Mark.NONE) {
                return { row: i, col: j };
            }
        }
    }

    return false;
};
