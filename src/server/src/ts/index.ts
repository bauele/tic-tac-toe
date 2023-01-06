import EventEmitter from 'events';
import { Server } from 'socket.io';

import { Player, PlayerType, playerAIStrategy } from './player';

import { gameModes, gameSettings } from './lib';
import serverConfig from './config.json';
import { Session } from './session';
import { Mark } from './enums';

// Map connecting client socket ids to players
const socketGameMap = new Map<string, Player[]>();

// Map connecting game ids to GameInstance objects
const sessionIdMap = new Map<Player, Session>();

const io = new Server({
    cors: {
        origin: ['http://localhost:3000'],
    },
});

io.on('connection', (socket) => {
    console.log(`New connection established: ${socket.id}`);

    socket.on('disconnect', (reason) => {
        console.log(`Socket disconnected for ${reason}`);

        /*

        // Delete player's game
        const player = socketGameMap.get(socket.id);
        if (player) {
            if (gameIdMap.delete(player.gameId)) {
                console.log(`Deleted ${socket.id}'s game`);
            } else {
                console.log(`Error: failed to deleted ${socket.id}'s game`);
            }

            // Delete player's socket
            socketGameMap.delete(socket.id);
        }
        */
    });

    socket.on('new-game', (gameConfig: gameSettings) => {
        console.log(
            `\nNew game requested with configurations: ${JSON.stringify(
                gameConfig
            )}`
        );

        //  Identify the player and add it to the list of players
        const newPlayer = {
            name: 'default-human-player-name',
            type: PlayerType.HUMAN,
            mark: gameConfig.mark,
            eventListener: new EventEmitter(),
        };

        newPlayer.eventListener.on('new-turn', (mark: Mark) => {
            socket.emit(
                'board-update',
                session.getGame().getBoard(),
                session.turnHandler.currentMarkTurn
            );
        });

        socketGameMap.set(socket.id, [newPlayer]);

        //  Create a new session for the player and add the player to it
        const session = new Session();
        sessionIdMap.set(newPlayer, session);
        session.addPlayer(newPlayer);

        //  If player wanted a single player game, add an AI player to session
        if (gameConfig.mode === 'singlePlayer') {
            const newAIPlayer = {
                name: 'default-ai-player-name',
                type: PlayerType.AI,
                mark: gameConfig.mark === Mark.ONE ? Mark.TWO : Mark.ONE,
                eventListener: new EventEmitter(),
            };

            newAIPlayer.eventListener.on('new-turn', (mark: Mark) => {
                if (mark === newAIPlayer.mark) {
                    let boardPosition = playerAIStrategy(session.getGame());

                    if (boardPosition) {
                        session.takeTurn(newAIPlayer, boardPosition);
                    }
                }
            });

            session.addPlayer(newAIPlayer);
            session.start();
        } else if (gameConfig.mode === 'localMultiplayer') {
            const newLocalPlayer = {
                name: 'default-human-player-name',
                type: PlayerType.HUMAN,
                mark: gameConfig.mark === Mark.ONE ? Mark.TWO : Mark.ONE,
                eventListener: new EventEmitter(),
            };

            const currentPlayer = socketGameMap.get(socket.id);
            if (currentPlayer) {
                socketGameMap.set(socket.id, [
                    currentPlayer[0],
                    newLocalPlayer,
                ]);
                session.addPlayer(newLocalPlayer);
            }
        }

        /*
        try 
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

                socket.emit(
                    'board-update',
                    game.getBoard(),
                    game.getPlayerTurn()
                );
            }
        } catch (error) {
            console.log(`Error starting game: ${error}`);
        }
        */
    });

    socket.on('gameboard-click', (position) => {
        // Find the session the player is connected to
        const players = socketGameMap.get(socket.id);
        if (players) {
            const player = players[0];
            const session = sessionIdMap.get(player);

            if (players.length === 1) {
                if (session) {
                    session.takeTurn(player, {
                        row: position[0],
                        col: position[1],
                    });
                    socket.emit(
                        'board-update',
                        session.getGame().getBoard(),
                        session.turnHandler.currentMarkTurn
                    );
                }
            } else if (players.length === 2) {
                if (session) {
                    const playerTurn =
                        player.mark === session?.turnHandler.currentMarkTurn
                            ? player
                            : players[1];
                    console.log('playerTurn = ', playerTurn);
                    session.takeTurn(playerTurn, {
                        row: position[0],
                        col: position[1],
                    });

                    socket.emit(
                        'board-update',
                        session.getGame().getBoard(),
                        session.turnHandler.currentMarkTurn
                    );
                }
            }
        }

        /*
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


                if (turnResult === 1 || turnResult === 2 || turnResult === 3) {
                    const victoryPosition = game.getVictoryPosition();
                    socket.emit('game-won', turnResult, victoryPosition);
                }
            } else {
                console.log("Unable to locate player's game");
                // TODO: Send error back to client
            }
        } else {
            console.log('Unable to locate player');
            // TODO: Send error back to client
            socket.emit('invalid-player');
        }
        */
    });

    /*
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
    
    ) */
});

console.log(`Listening on port ${serverConfig.host.port}`);
io.listen(serverConfig.host.port);
