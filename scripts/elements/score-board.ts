import { createHTMLElements } from '../helpers';

export class ScoreBoard {
    private $domElement = null;
    private points = 0;

    constructor() {
        this.create();
    }

    public getPoints(): number {
        return this.points;
    }

    public getElement(): HTMLElement {
        return this.$domElement;
    }

    public updateScore(points: number): void {
        this.points += points;
        this.$domElement.querySelector('.score-value').innerHTML = this.points;
    }

    private create(): void {
        const boardElements = createHTMLElements(
            [
                { tagName: 'div', classList: 'score-board' },
                { tagName: 'p', classList: 'score', innerHTML: 'Score:' },
                { tagName: 'span', classList: 'score-value', innerHTML: ` ${this.points}` },
            ]
        );
        const [$scoreBoard, $score, $scoreValue] = boardElements;
        $score.appendChild($scoreValue);
        $scoreBoard.appendChild($score);
        this.$domElement = $scoreBoard;
    }
}