import { GameController } from './controllers/game.controller';

const gameController = new GameController({
    container: 'gameContainer'
});
gameController.createGame();
