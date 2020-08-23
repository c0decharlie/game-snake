import { GameController } from './controllers/game.controller';

const gameController = new GameController({
    container: 'game-container',
    borderWidth: 2
});
gameController.createGame();
