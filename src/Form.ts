import { Component } from "./components/base/component";
import { IEvents, IFormState } from "./types";
import { ensureAllElements, ensureElement } from "./utils/utils";

export abstract class Form<T> extends Component<IFormState> implements IFormState {
    
    protected inputElements: HTMLInputElement[];
    protected errorElement: HTMLElement;
    protected submitButtonElement: HTMLButtonElement;
    protected events: IEvents;
   
    constructor(protected container: HTMLFormElement, events: IEvents){
        super(container);
        
        this.inputElements = Array.from(ensureAllElements('.form__input', container));
        this.submitButtonElement = container.querySelector('button[type=submit]');
        this.errorElement = ensureElement('.form__errors', container);
        this.events = events;
       
        this.inputElements.forEach(input => {
            input.addEventListener('input', (event: Event) => {
                const field = input.name;
                const value = input.value;
                this.events.emit(`${container.name}-field:input`, {field, value});
            })
        })
     
        container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(`${container.name}-form:submit`);
            })
        }
    
    set valid(value: boolean) {
        this.setDisabled(this.submitButtonElement, !value)
    } 

    set errors(value: string) {
        this.setText(this.errorElement, value)
    }
    
    render(data?: Partial<T & IFormState>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
      
}