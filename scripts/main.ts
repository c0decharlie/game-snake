import { GameController } from './controllers/game.controller';
import { Alert } from './elements/alert';

const gameController = new GameController({
    container: 'game-container',
    borderWidth: 2
});
gameController.createGame();

// TODO: move alert handling to game controller
const alert = new Alert();
alert.setContent({
    title: 'Press space to start game'
});
alert.open();

window.addEventListener('keydown', ({ code }) => {
    if (code === 'Space' && !gameController.isGameStarted) {
        alert.close();
        gameController.startGame();
    }
});
