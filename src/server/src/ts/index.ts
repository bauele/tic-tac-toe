import { Server } from 'socket.io';

import { GameInstance } from './gameInstance';
import { createGame } from './server';
import { Player } from './player';

import { gameModes, gameSettings } from '../../../shared/lib';
import serverConfig from '../../../config.json';

// Map connecting client socket ids to players
const socketGameMap = new Map<string, Player>();

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

                // TODO: Allow players to set names
                const player = {
                    name: 'default-player',
                    mark: gameConfig.mark,
                    gameId: game.getId(),
                };
                socketGameMap.set(socket.id, player);
                gameIdMap.set(game.getId(), game);

                /*  If the player starts a singleplayer game and they are not using
                    the X mark, the computer will take their turn immediately.
                    The board state needs to be sent back to the client */
                console.log('gameplayerturn = ', game.getPlayerTurn());
                socket.emit(
                    'board-update',
                    game.getBoard(),
                    game.getPlayerTurn()
                );
            }
        } catch (error) {
            console.log(`Error starting game: ${error}`);
        }
    });

    socket.on('gameboard-click', (position) => {
        console.log(`\n${socket.id} clicked game board at ${position}`);

        // Find game the player is connected to
        const player = socketGameMap.get(socket.id);
        if (player) {
            const game = gameIdMap.get(player.gameId);
            if (game) {
                const turnResult = game.takeTurn(
                    position[0],
                    position[1],
                    player.mark
                );

                socket.emit(
                    'board-update',
                    game.getBoard(),
                    game.getPlayerTurn()
                );

                /*  If turnResult is a 1 or 2, one of the players have won
                    the game. If it's 3, there was a tie */
                if (turnResult === 1 || turnResult === 2 || turnResult === 3) {
                    socket.emit('game-won', turnResult);
                }
            } else {
                console.log("Unable to locate player's game");
                // TODO: Send error back to client
            }
        } else {
            console.log('Unable to locate player');
            // TODO: Send error back to client
        }
    });

    socket.on('reset-board', () => {
        const player = socketGameMap.get(socket.id);
        if (player) {
            const game = gameIdMap.get(player.gameId);
            if (game) {
                game.resetGame();
                socket.emit(
                    'board-update',
                    game.getBoard(),
                    game.getPlayerTurn()
                );
            } else {
                console.log("Unable to locate player's game");
                // TODO: Send error back to client
            }
        } else {
            console.log('Unable to locate player');
            // TODO: Send error back to client
        }
    });
});

console.log(`Listening on port ${serverConfig.host.port}`);
io.listen(serverConfig.host.port);
