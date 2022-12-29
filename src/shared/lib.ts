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
