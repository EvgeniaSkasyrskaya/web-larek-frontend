import { Api, ApiListResponse } from "./base/api"
import { IAppApi, IOrderResult, IItem, IOrder } from "../types";

export class AppApi extends Api implements IAppApi 
{
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        // добавлено автоматическое исправление baseUrl для возможности деплоя на gh-pages
        let correctedBaseUrl = baseUrl;
        // Если baseUrl начинается с '/' (относительный путь)
        if (correctedBaseUrl.startsWith('/')) {
            console.warn(`Fixing relative baseUrl: ${correctedBaseUrl}`);
            correctedBaseUrl = 'https://larek-api.nomoreparties.co' + correctedBaseUrl;
        }
        
        // Если baseUrl пустой или undefined
        if (!correctedBaseUrl || correctedBaseUrl === '') {
            console.warn('baseUrl is empty, using default');
            correctedBaseUrl = 'https://larek-api.nomoreparties.co/api/weblarek';
        }
        
        // Убедимся что это абсолютный URL
        if (!correctedBaseUrl.startsWith('http')) {
            correctedBaseUrl = 'https://larek-api.nomoreparties.co/api/weblarek';
        }
        super(correctedBaseUrl, options);
        // аналогично для cdn
        let correctedCdn = cdn;
        if (correctedCdn.startsWith('/')) {
            correctedCdn = 'https://larek-api.nomoreparties.co' + correctedCdn;
        }
        if (!correctedCdn || correctedCdn === '') {
            correctedCdn = 'https://larek-api.nomoreparties.co/content/weblarek';
        }
        this.cdn = correctedCdn;
    }

    getCatalog(): Promise<IItem[]> {
        return this.get('/product')
        .then((data: ApiListResponse<IItem>) =>
        data.items.map(item => ({
            ...item,
            image: this.cdn + item.image 
        })))
    }

    sendOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order)
        .then((data: IOrderResult) => data) 
    }
}
