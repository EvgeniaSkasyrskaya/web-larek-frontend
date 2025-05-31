import { Component } from "./base/component";
import { AppEvents, IEvents, ISuccess } from "../types";

export class Success extends Component<ISuccess> implements ISuccess {

    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected events: IEvents;
    
    constructor(protected container: HTMLFormElement, events: IEvents) {
        super(container);
        this.totalElement = container.querySelector('.order-success__description');
        this.buttonElement = container.querySelector('.order-success__close');
        this.events = events;

        this.buttonElement.addEventListener('click', () => {
            this.events.emit(AppEvents["order:finished"])
        })
    }

    set total(value: number) {
        this.setText(this.totalElement, `Списано ${value} синапсов`)
    }
}