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
