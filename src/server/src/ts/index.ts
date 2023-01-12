import EventEmitter from 'events';
import { Server } from 'socket.io';

import { Player, PlayerType, playerAIStrategy } from './player';

import { gameSettings } from './lib';
import serverConfig from './config.json';
import { Session } from './session';
import { Mark } from './enums';
import { GameStatus } from './ticTacToeBoard';

//  Map connecting client socket ids to players
const socketPlayerMap = new Map<string, Player[]>();

//  Map connecting players to sessions
const playerSessionMap = new Map<Player, Session>();

const io = new Server({
    cors: {
        origin: ['http://localhost:3000'],
    },
});

io.on('connection', (socket) => {
    console.log(`New connection established: ${socket.id}`);

    socket.on('disconnect', (reason) => {
        console.log(`Socket disconnected for ${reason}`);

        //  Delete player's game
        const player = socketPlayerMap.get(socket.id);
        if (player && player.length > 0) {
            //  As long as the returned player array has at least one player in
            //  it, that player can be used to delete the entire session
            if (playerSessionMap.delete(player[0])) {
                console.log(`Deleted ${socket.id}'s game`);
            } else {
                console.log(`Error: failed to deleted ${socket.id}'s game`);
            }

            // Delete players
            socketPlayerMap.delete(socket.id);
            console.log(`Removed ${socket.id} from server`);
        }
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

        //  Set up the player's event listener. Whenever they are notified
        //  that another player took their turn, send them the new game
        //  state
        newPlayer.eventListener.on('new-turn', (mark: Mark) => {
            const gameState = session.getGame().getGameState();
            socket.emit(
                'game-state-update',
                gameState,
                session.getTurnHandler().getCurrentMarkTurn()
            );
        });

        socketPlayerMap.set(socket.id, [newPlayer]);

        //  Create a new session for the player and add the player to it
        const session = new Session();
        playerSessionMap.set(newPlayer, session);
        session.addPlayer(newPlayer);

        //  If player wanted a single player game, add an AI player to session
        if (gameConfig.mode === 'singlePlayer') {
            const newAIPlayer = {
                name: 'default-ai-player-name',
                type: PlayerType.AI,
                mark: gameConfig.mark === Mark.ONE ? Mark.TWO : Mark.ONE,
                eventListener: new EventEmitter(),
            };

            //  The AI's eventListener will trigger them to take their turn
            newAIPlayer.eventListener.on('new-turn', (mark: Mark) => {
                if (mark === newAIPlayer.mark) {
                    //  Determine an amount of time for the AI to think about their
                    //  turn. This can be either 1 or 2 seconds
                    const turnLengthMs =
                        Math.floor(Math.random() * 2 + 1) * 1000;

                    setTimeout(function () {
                        let boardPosition = playerAIStrategy(session.getGame());
                        if (boardPosition) {
                            session.takeTurn(newAIPlayer, boardPosition);
                        }

                        const gameState = session.getGame().getGameState();
                        socket.emit(
                            'game-state-update',
                            gameState,
                            session.getTurnHandler().getCurrentMarkTurn()
                        );
                    }, turnLengthMs);
                }
            });

            //  Add the AI player and start the session
            session.addPlayer(newAIPlayer);
            session.start();

            //  If game is a local multiplayer game, add another human player
        } else if (gameConfig.mode === 'localMultiplayer') {
            const newLocalPlayer = {
                name: 'default-human-player-name',
                type: PlayerType.HUMAN,
                mark: gameConfig.mark === Mark.ONE ? Mark.TWO : Mark.ONE,
                eventListener: new EventEmitter(),
            };

            //  Add this human player to the socketPlayerMap
            const currentPlayer = socketPlayerMap.get(socket.id);
            if (currentPlayer) {
                socketPlayerMap.set(socket.id, [
                    currentPlayer[0],
                    newLocalPlayer,
                ]);
                session.addPlayer(newLocalPlayer);
            } else {
                throw Error(
                    "Couldn't find first player while adding second player"
                );
            }
        }
    });

    socket.on('gameboard-click', (position) => {
        //  Find the session the player is connected to
        const players = socketPlayerMap.get(socket.id);
        if (players) {
            const player = players[0];
            const session = playerSessionMap.get(player);

            if (!session) {
                throw new Error('Error finding player session');
            }

            //  If the map has two players for a single socket, then it is a
            //  single player game. The player should simply be allowed to
            //  take their turn
            if (players.length === 1) {
                session.takeTurn(player, {
                    row: position[0],
                    col: position[1],
                });

                //  Get the updated game state
                const gameState = session.getGame().getGameState();
                socket.emit(
                    'game-state-update',
                    gameState,
                    session.getTurnHandler().getCurrentMarkTurn()
                );

                //  If there are two players for a single socket, it is a local
                //  multiplayer game and the turn should be taken by whichever
                //  player is supposed to be going next
            } else if (players.length === 2) {
                const playerTurn =
                    player.mark === session?.turnHandler.currentMarkTurn
                        ? player
                        : players[1];
                session.takeTurn(playerTurn, {
                    row: position[0],
                    col: position[1],
                });

                //  Get the updated game state
                const gameState = session.getGame().getGameState();
                socket.emit(
                    'game-state-update',
                    gameState,
                    session.getTurnHandler().getCurrentMarkTurn()
                );
            }
        } else {
            socket.emit('invalid-player');
            throw Error('Error finding players for session');
        }
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
    */
});

console.log(`Listening on port ${serverConfig.host.port}`);
io.listen(serverConfig.host.port);
