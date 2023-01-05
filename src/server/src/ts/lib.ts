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

enum LineOrientation {
    HORIZONTAL,
    VERITCAL,
    FOWARD_DIAGONAL,
    BACKWARD_DIAGONAL,
}

interface BoardPosition {
    x: number;
    y: number;
}

export interface BoardLine {
    orientation: LineOrientation;
    startPosition: BoardPosition;
}
