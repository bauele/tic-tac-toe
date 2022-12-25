import { GameInstance } from './gameInstance';
import { SinglePlayerGameInstance } from './singlePlayerGameInstance';
import { LocalMultiplayerGameInstance } from './localMultiplayerGameInstance';

let gameInstances = new Array<GameInstance>();

let singlePlayerGame = new SinglePlayerGameInstance('game-1');
let localMultiplayerGame = new LocalMultiplayerGameInstance('game-2');

gameInstances.push(singlePlayerGame);
gameInstances.push(localMultiplayerGame);

gameInstances.forEach((game) => {
    game.takeTurn(0, 0, 1);
    console.log(game.getBoard());
});
