import { Form } from "./Form";
import { AppEvents, IContacts, IEvents } from "../types";

export class ContactsForm extends Form<IContacts> implements IContacts {
    
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this.inputElements.forEach(input => {
            input.addEventListener('input', (event: Event) => {
                const field = input.name;
                const value = input.value;
                this.events.emit(AppEvents["contacts-field:input"], {field, value});
            })
        })

        container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(AppEvents["contacts-form:submit"]);
        })
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
        }
    
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
        }    
}