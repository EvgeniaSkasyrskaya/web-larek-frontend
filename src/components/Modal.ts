import { Component } from "./base/component";
import { IEvents, IModalData } from "../types/index";
import { ensureElement } from "../utils/utils";

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

    protected toggleModal(state: boolean = true) {
        this.container.classList.toggle('modal_active', state);
    }

    protected handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    }
    
    protected open() {
        this.toggleModal();
        document.addEventListener('keydown', this.handleEscape);
    }

    close() {
        this.toggleModal(false);
        document.removeEventListener('keydown', this.handleEscape);
        this.content = null;
    }

    render(data: Partial<IModalData>): HTMLElement {
        Object.assign(this as object, data);
        this.open();
        return this.container;
    }
}