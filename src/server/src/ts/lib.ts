export const gameModes = [
    'singlePlayer',
    'localMultiplayer',
    'onlineMultiplayer',
];
export type gameMode = typeof gameModes[number];

export interface gameSettings {
    mark: number;
    mode: gameMode;
}

export interface VictoryPosition {
    location: [
        { i: number; j: number },
        { i: number; j: number },
        { i: number; j: number }
    ];
}

export enum LineOrientation {
    HORIZONTAL,
    VERITCAL,
    FOWARD_DIAGONAL,
    BACKWARD_DIAGONAL,
}

export interface BoardPosition {
    x: number;
    y: number;
}

export interface BoardLine {
    orientation: LineOrientation;
    startPosition: BoardPosition;
}
