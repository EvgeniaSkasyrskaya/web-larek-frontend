import { Component } from "./components/base/component";
import { IEvents } from "./types";
import { IPage } from "./types";
import { ensureElement } from "./utils/utils";

export class Page extends Component<IPage> implements IPage {
    protected gallery: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected basketCounter: HTMLElement;
    protected events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.gallery = ensureElement<HTMLElement>('.gallery', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this.events = events;

        this.buttonElement.addEventListener('click', () => events.emit('basket:open'));
    }

    set catalog(items: HTMLElement[]) {
        this.gallery.replaceChildren(...items);
    }

    set counter(value: number) {
        this.setText(this.basketCounter, value);
    }
}