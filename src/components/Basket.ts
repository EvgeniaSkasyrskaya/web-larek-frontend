import { Component } from "./base/component";
import { IBasket, IBasketView, IEvents, ICardActions, AppEvents } from "../types";

export class Basket extends Component<IBasketView> implements IBasketView {
    protected basketList: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected events: IEvents

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.basketList = container.querySelector('.basket__list');
        this.totalElement = container.querySelector('.basket__price');
        this.buttonElement = container.querySelector('.basket__button')
        this.toggleButton(true);
        this.events = events;
        this.buttonElement.addEventListener('click', () => this.events.emit(AppEvents["delivery:open"]))
    }

    protected toggleButton(state: boolean) {
        this.setDisabled(this.buttonElement, state);
    }
    
    set items(items: HTMLElement[]) {
        if (items.length) {
            this.basketList.replaceChildren(...items);
            this.toggleButton(false);
        } else {
            this.setText(this.basketList, 'Корзина пуста');
            this.toggleButton(true);
        }
    }

    set total(value: number) {
        this.setText(this.totalElement, value + ' синапсов');
        this.toggleButton(!value);
    }
}