import { IEvents, IAppState, IItem, IOrder, IDeliveryInfo, IContacts, AppEvents, Subscriber } from "../types";

export class AppState implements IAppState {
    catalog: IItem[];
    preview: string | null;
    order: IOrder;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this.order = {
            items: [],
            total: null,
            address: '',
            payment: '',
            email: '',
            phone: '',
        };
    };

    setCatalog(items: IItem[]) {
        this.catalog = items;
        this.events.emit(AppEvents["items:changed"]);
    };

    getItem(id: string) {
        return this.catalog.find((element: IItem) => element.id === id)
    };
    
    isItemInBasket(id: string) {
        return this.order.items.some(item => item === id)
    }

    setPreview(id: string) {
        this.preview = id;
        this.events.emit(AppEvents["preview:changed"], id);
    };

    addBasketItem(id: string) {
        this.order.items.push(id);
        this.events.emit(AppEvents["basket:changed"], id);
    };

    deleteBasketItem(id: string) {
        this.order.items = this.order.items.filter((element: string) => element !== id);
        this.events.emit(AppEvents["basket:changed"], id);
    };

    setTotalCost(): void {
        const totalCost = this.order.items.map(el => this.getItem(el).price).reduce((function (currentTotal: number, currentPrice: number) {
            return currentTotal + currentPrice;
            }), 0)
        this.order.total = totalCost;
    };

    clearOrderInfo() {
        this.order.items = [];
        this.order.total = null;
        this.order.address = '';
        this.order.payment = '';
        this.order.email = '';
        this.order.phone = '';
        this.events.emit(AppEvents["basket:changed"]);
    };

    setPayMethod(value: string) {
        this.order.payment = value;
        this.validateDeliveryInfo();
    } 

    setDeliveryFormField(field: keyof IDeliveryInfo, value: string) {
        this.order[field] = value;
        this.validateDeliveryInfo();
    }
   
    setContactsFormField(field: keyof IContacts, value: string) {
        this.order[field] = value;
        this.validateContacts();
    }
    
    protected validateDeliveryInfo() {
        if (this.order.payment && this.order.address) {
            this.events.emit(AppEvents["deliveryInfo:ready"]);
        } else {
            if (!this.order.payment) {
                this.events.emit(AppEvents["order:validation"], 'Необходимо выбрать способ оплаты');
                } else {
                if (!this.order.address) {
                this.events.emit(AppEvents["order:validation"], 'Необходимо указать адрес доставки');
                }
            }
        }     
    }

    protected validateContacts() {
        if (this.order.email && this.order.phone) {
            this.events.emit(AppEvents["contacts:ready"]);
        } else {
            if (!this.order.email) {
                this.events.emit(AppEvents["contacts:validation"], 'Необходимо указать адрес электронной почты');
            } else {
                if (!this.order.phone) {
                this.events.emit(AppEvents["contacts:validation"], 'Необходимо указать номер телефона');
                }
            }
        }     
    }
}