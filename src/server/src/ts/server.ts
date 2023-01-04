const uuid = require('uuid');

import { GameInstance } from './gameInstance';
import { SinglePlayerGameInstance } from './singlePlayerGameInstance';
import { LocalMultiplayerGameInstance } from './localMultiplayerGameInstance';
import { gameModes, gameSettings } from './lib';

/*  Creates a new game based on supplied settings.
    Throws an error if any of the settings provide are invalid
    Returns null if a setting is valid, but this function
        doesn't yet implement it */
export const createGame = ({ mark, mode }: gameSettings) => {
    if (mark !== 1 && mark !== 2) {
        throw new RangeError('mark argument must be either 1 or 2');
    }

    if (!gameModes.includes(mode)) {
        throw new Error('mode argument is not a valid game mode');
    }

    const id = uuid.v4();

    let game: GameInstance | null;

    // TODO: Allow for players to set custom names
    let player = { name: 'player one', mark: mark, gameId: id };

    switch (mode) {
        case 'singlePlayer':
            game = new SinglePlayerGameInstance(id, player);
            break;
        case 'localMultiplayer':
            game = new LocalMultiplayerGameInstance(id, player);
            break;
        default:
            game = null;
            break;
    }

    return game;
};
