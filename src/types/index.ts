export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    readonly baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IAppApi {
    readonly cdn: string;
    getCatalog(): Promise<IItem[]>;
    sendOrder(order: IOrder): Promise<IOrderResult>;
}

export type EventName = string | RegExp;

export type Subscriber = Function

export interface EmitterEvent {
    eventName: string,
    data: unknown
}

export interface IEvents {
    _events: Map<EventName, Set<Subscriber>>
    on<T>(event: EventName, callback: (data: T) => void): void;
    off(eventName: EventName, callback: Subscriber): void;
    emit<T>(event: string, data?: T): void;
    onAll(callback: (event: EmitterEvent) => void): void;
    offAll(): void;
}

export interface IItem {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number | null;
    isInBasket: boolean;
    index?: number;
}

export interface IBasket {
    items: string[];
    total: number;
}    

export interface IDeliveryInfo {
    address: string;
    payment: string;
}

export interface IContacts {
    email: string;
    phone: string;
}

export type IOrder = IBasket & IDeliveryInfo & IContacts

export interface IModalData {
    content: HTMLElement;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface IFormState {
    valid: boolean;
    errors: string;
}

export interface ISuccess {
    total: number;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
}

export interface IAppState {
    catalog: IItem[];
    preview: string | null;
    order: IOrder;
    setCatalog(items: IItem[]): void;
    getItem(id: string): IItem;
    isItemInBasket(id: string): boolean;
    setPreview(id: string): void;
    addBasketItem(id: string): void;
    deleteBasketItem(id: string): void;
    clearOrderInfo(): void;
    setPayMethod(value: string): void;
    setDeliveryFormField(field: keyof IDeliveryInfo, value: string): void;
    setContactsFormField(field: keyof IContacts, value: string): void;
}
