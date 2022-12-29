import { Server } from 'socket.io';

import { GameInstance } from './gameInstance';
import { createGame } from './server';
import { gameSettings } from '../../../shared/lib';
import serverConfig from '../../../config.json';

// Map connecting client socket ids to game ids
const socketGameMap = new Map<string, string>();

// Map connecting game ids to GameInstance objects
const gameIdMap = new Map<string, GameInstance>();

const io = new Server({
    cors: {
        origin: ['http://localhost:3000'],
    },
});

io.on('connection', (socket) => {
    console.log(`New connection established: ${socket.id}`);

    socket.on('disconnect', (reason) => {
        console.log(`Socket disconnected for ${reason}`);
    });

    socket.on('new-game', (gameConfig: gameSettings) => {
        console.log(
            `\nNew game requested with configurations: ${JSON.stringify(
                gameConfig
            )}`
        );

        try {
            const game = createGame(gameConfig);
            if (game) {
                console.log(`Game created with id ${game.getId()}`);
                socketGameMap.set(socket.id, game.getId());
                gameIdMap.set(game.getId(), game);

                /*  If the player starts a singleplayer game and they are not using
                    the X mark, the computer will take their turn immediately.
                    The board state needs to be sent back to the client */
                socket.emit('board-update', game.getBoard());
            }
        } catch (error) {
            console.log(`Error starting game: ${error}`);
        }
    });

    socket.on('gameboard-click', (position) => {
        console.log(`\n${socket.id} clicked game board at ${position}`);

        // Find game the player is connected to
        const gameId = socketGameMap.get(socket.id);
        if (gameId) {
            const game = gameIdMap.get(gameId);
            if (game) {
                const turnResult = game.takeTurn(position[0], position[1], 1);
                socket.emit('board-update', game.getBoard());

                /*  If turnResult is a 1 or 2, one of the players have won
                    the game */
                if (turnResult === 1 || turnResult === 2) {
                    socket.emit('game-won', turnResult);
                }
            } else {
                console.log(`Unable to locate game with id ${gameId}`);
                // TODO: Send error back to client
            }
        } else {
            console.log("Unable to locate player's game");
            // TODO: Send error back to client
        }
    });
});

console.log(`Listening on port ${serverConfig.host.port}`);
io.listen(serverConfig.host.port);
