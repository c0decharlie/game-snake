import { GameController } from './controllers/game.controller';

new GameController({
    container: 'game-container',
    borderWidth: 2
}).init();