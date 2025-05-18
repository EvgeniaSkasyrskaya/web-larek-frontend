export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    options: RequestInit
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
    handleResponse(response: Response): Promise<object>;
}

export type EventName = string | RegExp;

export type Subscriber = Function

export interface EmitterEvent {
    eventName: string,
    data: unknown
}

export interface IEvents {
    events: Map<EventName, Set<Subscriber>>
    on<T>(event: EventName, callback: (data: T) => void): void;
    off(eventName: EventName, callback: Subscriber): void;
    emit<T>(event: string, data?: T): void;
    onAll(callback: (event: EmitterEvent) => void): void;
    offAll(): void;
    trigger<T>(event: string, context?: Partial<T>): (data: T) => void;
}

export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type ICard = Omit<IItem, 'description'>

export type IBasketItem = Pick<IItem, 'id' | 'title' | 'price'>

export interface IBasket {
    items: string[];
}    

export interface IModalData {
    content: HTMLElement;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface IDeliveryInfo {
    address: string;
    payMethod: 'cash' | 'card';
}

export interface IContacts {
    email: string;
    phone: string;
}

export type IOrder = IDeliveryInfo & IContacts & IBasket 

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IFormState {
    valid: boolean;
    errors: string;
}

export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    onClick: () => void;
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
    basket: IBasket;                  
    order: IOrder | null;
    setCatalog(items: IItem[]): void;
    getItem(id: string): IItem;
    setPreview(id: string): void;
    addBasketItem(id: string): void;
    deleteBasketItem(id: string): void;
    getTotalAmount(): number | null;
    getTotalCost(): number | null;
    clearBasket(): void;
    setDeliveryFormField(field: keyof IDeliveryInfo, value: string): void;
    setContactsFormField(field: keyof IContacts, value: string): void;
    validateOrder(): boolean; 
}
