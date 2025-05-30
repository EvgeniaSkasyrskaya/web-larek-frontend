import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { AppEvents, IDeliveryInfo, IContacts, IItem } from './types';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardViewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplateElement = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplateElement = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplateElement = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplateElement = ensureElement<HTMLTemplateElement>('#success');
const pageElement = ensureElement<HTMLElement>('.page');
const modalElement = ensureElement<HTMLElement>('#modal-container');

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const appState = new AppState(events);
const page = new Page(pageElement, events)
const modalView = new Modal(modalElement, events);
const basketView = new Basket(cloneTemplate(basketTemplateElement), events);
const orderFormView = new OrderForm(cloneTemplate(orderTemplateElement), events);
const contactsFormView = new ContactsForm(cloneTemplate(contactsTemplateElement), events);
const successView = new Success(cloneTemplate(successTemplateElement), events);
const cardView = new Card(cloneTemplate(cardViewTemplate), events, {
        onClick: () => {
            if (appState.isItemInBasket(appState.preview)) {
            events.emit(AppEvents['basket:deleteItem'], appState.preview);
            } else {
            events.emit(AppEvents['basket:addItem'], appState.preview);
            };
        }
});

events.onAll((event) => console.log(event))

events.on(AppEvents['items:changed'], () => {
    page.catalog = appState.catalog.map(item => {
          const card = new Card(cloneTemplate(cardCatalogTemplate), events, {
            onClick: () => events.emit(AppEvents['item:select'], item.id)
        });
          return card.render({
            id: item.image,
            description: item.description,
            image: item.image,
            title: item.title,
            category: item.category,
            price: item.price
          });
        }) 
    page.counter = appState.order.items.length;    
});

events.on(AppEvents['item:select'], (id: string) => {
    appState.setPreview(id);
 });

events.on(AppEvents['preview:changed'], () => {
    const previewItem: IItem = appState.getItem(appState.preview);
    modalView.render({
        content: cardView.render({
            id: previewItem.id,
            description: previewItem.description,
            image: previewItem.image,
            title: previewItem.title,
            category: previewItem.category,
            price: previewItem.price,
            isInBasket: appState.isItemInBasket(previewItem.id)
        })
    })
 })

events.on(AppEvents['basket:addItem'], (id: string) => {
    appState.addBasketItem(id);
})

events.on(AppEvents['basket:deleteItem'], (id: string) => {
    appState.deleteBasketItem(id);
})

events.on(AppEvents['basket:changed'], (id: string) => {
    appState.setTotalCost();
    page.render({counter: appState.order.items.length});
    cardView.render({isInBasket: appState.isItemInBasket(id)});
    basketView.render({
            items: appState.order.items.map((item) => {
                const basketItem = appState.getItem(item);
                const basketItemCard = new Card(cloneTemplate(cardBasketItemTemplate), events, {
                    onClick: () => events.emit(AppEvents['basket:deleteItem'], item)                        
                    })
                return basketItemCard.render({
                    id: item,
                    title: basketItem.title,
                    price: basketItem.price,
                    index: appState.order.items.indexOf(item)
                })
            }),
        total: appState.order.total    
    }) 
})

events.on(AppEvents['basket:open'], () => {
    modalView.render({
        content: basketView.render({
            items: appState.order.items.map((item) => {
                const basketItem = appState.getItem(item);
                const basketItemCard = new Card(cloneTemplate(cardBasketItemTemplate), events, {
                    onClick: () => events.emit(AppEvents['basket:deleteItem'], item)                        
                    })
                return basketItemCard.render({
                    id: item,
                    title: basketItem.title,
                    price: basketItem.price,
                    index: appState.order.items.indexOf(item)
                })
            }),
        total: appState.order.total   
        }) 
    })
})

events.on(AppEvents['delivery:open'], () => {
    modalView.render({
        content: orderFormView.render({
            address: appState.order.address,
            payment: appState.order.payment,
            valid: false,
            errors: ''
        })
    });
})

events.on(AppEvents['payMethod:select'], (data: string) => {
    appState.setPayMethod(data);
})

events.on(AppEvents['order-field:input'], (data: {field: keyof IDeliveryInfo, value: string}) => {
    appState.setDeliveryFormField(data.field, data.value);
})

events.on(AppEvents['order:validation'], (message: string) => {
    orderFormView.render({
        valid: false,
        errors: message
    })
})

events.on(AppEvents['deliveryInfo:ready'], () => {
    orderFormView.render({
        valid: true,
        errors: ''
    });
})

events.on(AppEvents['order-form:submit'], () => {
    modalView.render({
        content: contactsFormView.render({
            email: appState.order.email,
            phone: appState.order.phone,
            valid: false,
            errors: ''
        })
    })
})

events.on(AppEvents['contacts-field:input'], (data: {field: keyof IContacts, value: string}) => {
    appState.setContactsFormField(data.field, data.value);
})

events.on(AppEvents['contacts:validation'], (message: string) => {
    contactsFormView.render({
        valid: false,
        errors: message
    })
})

events.on(AppEvents['contacts:ready'], () => {
    contactsFormView.render({
        valid: true,
        errors: ''
    });
})

events.on(AppEvents['contacts-form:submit'], () => {
    api.sendOrder(appState.order)
        .then((data) => {
            events.emit(AppEvents['order:send'], data.total);
        })
        .catch(console.error);
    });

events.on(AppEvents['order:send'], (total: number) => {  
    modalView.render({
        content: successView.render({
            total: total
        })
    });
    appState.clearOrderInfo();
})    

events.on(AppEvents['order:finished'], () => {
        modalView.close();
    })

api.getCatalog()
    .then((data) => {
        appState.setCatalog(data);
    })
    .catch(console.error);
