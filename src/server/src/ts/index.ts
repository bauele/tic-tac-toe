import { Server } from 'socket.io';

import { GameInstance } from './gameInstance';
import { SinglePlayerGameInstance } from './singlePlayerGameInstance';
import { LocalMultiplayerGameInstance } from './localMultiplayerGameInstance';

import { gameModes, gameSettings } from '../../../shared/lib';

import serverConfig from '../../../config.json';

let gameInstances = new Array<GameInstance>();

let localMultiplayerGame = new LocalMultiplayerGameInstance('game-2');

const io = new Server({
    cors: {
        origin: ['http://localhost:3000', '*'],
    },
});

io.on('connection', (socket) => {
    console.log(`New connection established: ${socket.id}`);

    socket.on('disconnect', (reason) => {
        console.log(`Socket disconnected for ${reason}`);
    });

    socket.on('new-game', (gameConfig: gameSettings) => {
        console.log('new-game: ', gameConfig);
        switch (gameConfig.mode) {
            case 'singlePlayer':
                let singlePlayerGame = new SinglePlayerGameInstance(socket.id);
                gameInstances.push(singlePlayerGame);
                break;
            default:
                console.log('Default case triggered');
                break;
        }
    });
});

console.log(`Listening on port ${serverConfig.host.port}`);
io.listen(serverConfig.host.port);
