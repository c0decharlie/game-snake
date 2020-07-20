import { AlertContent } from './../interfaces/alert.interface';
import { createHTMLElement } from '../helpers';

export class Alert {
    private $instanceElements: {[key: string]: HTMLElement} = {};

    constructor() {
        this.create();
    }

    public close(): void {
        this.$instanceElements.alert.classList.remove('opened');
    }

    public open(): void {
        this.$instanceElements.alert.classList.add('opened');
    }

    public setContent(content: AlertContent): void {
        if (content.title) {
            this.setTitle(content.title);
        }
        if (content.message) {
            this.setMessage(content.message);
        }
    }

    private setTitle(title: string): void {
        this.$instanceElements.alertTitle.innerHTML = title;
    }

    private setMessage(message: string): void {
        this.$instanceElements.alertMessage.innerHTML = message;
    }

    private create(): void {
        const createElementsData = [
            { 
                name: 'alert',
                tagName: 'div',
                classList: 'alert' 
            },
            { 
                name: 'alertTitle',
                tagName: 'h3', 
                classList: 'alert-title',
            },
            {
                name: 'alertMessage',
                tagName: 'p',
                classList: 'alert-message',
            }
        ];

        createElementsData.forEach((elementData) =>
            this.$instanceElements[elementData.name] = createHTMLElement(elementData)
        );

        [this.$instanceElements.alertTitle, this.$instanceElements.alertMessage].forEach(element => 
            this.$instanceElements.alert.appendChild(element));

        document.querySelector('body').appendChild(this.$instanceElements.alert);
    }
}
