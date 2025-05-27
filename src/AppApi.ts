import { Api, ApiListResponse } from "./components/base/api";
import { IAppApi, IOrderResult, IItem, IOrder } from "./types";

export class AppApi extends Api implements IAppApi 
{
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
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