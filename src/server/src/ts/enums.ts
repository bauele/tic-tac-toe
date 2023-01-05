export enum Mark {
    NONE,
    ONE,
    TWO,
}

enum MoveStatus {
    SUCCESS,
    FAILURE,
}

export enum GameStatus {
    IN_PROGRESS,
    MARK_ONE_VICTORY,
    MARK_TWO_VICTORY,
    DRAW,
}

export interface BoardPosition {
    row: number;
    col: number;
}
