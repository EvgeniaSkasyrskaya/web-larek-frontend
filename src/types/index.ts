export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type EventName = string | RegExp;

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
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
    items: IItem[];
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
    errors: string[];
}

export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    onClick: () => void;
}

export interface IOrderResult {
    items: string[];
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
