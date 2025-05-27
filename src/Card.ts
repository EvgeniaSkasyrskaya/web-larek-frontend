import { Component } from "./components/base/component";
import { IEvents } from "./types";
import { IItem, ICardActions } from "./types";
import { ensureElement } from "./utils/utils";

export class Card extends Component<IItem> implements IItem {
    protected imageElement?: HTMLImageElement; 
    protected categoryElement?: HTMLElement; 
    protected titleElement: HTMLElement; 
    protected textElement?: HTMLElement; 
    protected priceElement: HTMLElement;
    protected indexElement? : HTMLElement;
    protected buttonElement?: HTMLButtonElement;
    protected events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents, protected actions?: ICardActions) {
      super(container);
      this.imageElement = container.querySelector('.card__image');
      this.categoryElement = container.querySelector('.card__category');
      this.titleElement = ensureElement('.card__title', container);
      this.textElement = container.querySelector('.card__text');
      this.priceElement = ensureElement('.card__price', container);
      this.indexElement = container.querySelector('.basket__item-index');
      this.buttonElement = container.querySelector('.card__button');
      this.events = events;

      if (actions.onClick) {
        if (this.buttonElement) {
          this.buttonElement.addEventListener('click', actions.onClick);
          } else {
          container.addEventListener('click', actions.onClick);
          }
      }
    }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set description(value: string) {
    this.setText(this.textElement, value)
  }
  
  set title(value: string) {
    this.setText(this.titleElement, value)
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title)
  }
  
  set category(value: string) {
    this.setText(this.categoryElement, value);
    if (value === 'софт-скил') this.categoryElement.classList.add('card__category_soft');
    if (value === 'другое') this.categoryElement.classList.add('card__category_other');
    if (value === 'дополнительное') this.categoryElement.classList.add('card__category_additional');
    if (value === 'кнопка') this.categoryElement.classList.add('card__category_button');
    if (value === 'хард-скил') this.categoryElement.classList.add('card__category_hard');
  }

  set price(value: number) {
    if (value !== null) {
        this.setText(this.priceElement, value + ' синапсов')
    } else {
        this.setText(this.priceElement, 'Бесценно')
    } 
  }
 
  set isInBasket(value: boolean) {
    if (value) {
        this.setText(this.buttonElement, 'Убрать из корзины');
    } else {
    this.setText(this.buttonElement, 'В корзину');
    }
  }

  set index(value: number) {
    this.setText(this.indexElement, value + 1);
  }
}