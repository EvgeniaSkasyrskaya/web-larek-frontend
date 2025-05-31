import { AppEvents, IDeliveryInfo, IEvents } from "../types";
import { Form } from "./Form";
import { ensureAllElements } from "../utils/utils";

export class OrderForm extends Form<IDeliveryInfo> implements IDeliveryInfo {
    
    protected payMethodButtonElements: HTMLButtonElement[];
       
    constructor(protected container: HTMLFormElement, protected events: IEvents){
        super(container, events);
        this.payMethodButtonElements = Array.from(ensureAllElements('button[type=button]', container));
        
        this.payMethodButtonElements.forEach(element => {
            element.addEventListener('click', () => {
                const activeButton = this.container.querySelector('.button_alt-active');
                if (activeButton) activeButton.classList.remove('button_alt-active');
                element.classList.add('button_alt-active');
                events.emit(AppEvents["payMethod:select"], element.name);
            })
        })
        this.inputElements.forEach(input => {
            input.addEventListener('input', (event: Event) => {
                const field = input.name;
                const value = input.value;
                this.events.emit(AppEvents["order-field:input"], {field, value});
                
            })
        })
     
        container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(AppEvents["order-form:submit"]);
        })    
    }
    
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
        
    set payment(value: string) {
        this.payMethodButtonElements.forEach(button => button.classList.remove('button_alt-active'))
        if (value) {
        const currentPayMethod = this.payMethodButtonElements.find(element => element.name === value);
        currentPayMethod.classList.add('button_alt-active');
        }
    }
}