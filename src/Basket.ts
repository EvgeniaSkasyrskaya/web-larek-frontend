import { Component } from "./components/base/component";
import { IBasket, IBasketView, IEvents, ICardActions } from "./types";

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
        this.setDisabled(this.buttonElement, true);
        this.events = events;
        this.buttonElement.addEventListener('click', () => this.events.emit('delivery:open'))
    }
    
    set items(items: HTMLElement[]) {
        if (items.length) {
            this.basketList.replaceChildren(...items);
        } else {
            this.setText(this.basketList, 'Корзина пуста');
            this.setDisabled(this.buttonElement, true);
        }
    }

    set total(value: number) {
        this.setText(this.totalElement, value + ' синапсов');
        if (value) {
            this.setDisabled(this.buttonElement, false);
        } else {
            this.setDisabled(this.buttonElement, true);
        }
    }
}