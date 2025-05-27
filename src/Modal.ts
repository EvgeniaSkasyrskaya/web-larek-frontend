import { Component } from "./components/base/component";
import { ICardActions, IEvents, IModalData } from "./types";
import { ensureElement } from "./utils/utils";

export class Modal extends Component<IModalData> implements IModalData {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;
    protected events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents){
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);        
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);
        this.events = events;

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', () => this.close());
        this.contentElement.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(content: HTMLElement) {
        this.contentElement.replaceChildren(content);
    }

    protected open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
    }

    render(data: Partial<IModalData>): HTMLElement {
        Object.assign(this as object, data);
        this.open();
        return this.container;
    }
}