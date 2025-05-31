// Хорошая практика даже простые типы выносить в алиасы

import { AppEvents } from "../../types";
import { EmitterEvent, EventName, Subscriber, IEvents } from "../../types";
// Зато когда захотите поменять это достаточно сделать в одном месте
// type EventName = AppEvents;
// type Subscriber = Function;
// type EmitterEvent = {
//     eventName: string,
//     data: unknown
// };

// export interface IEvents {
//     on<T extends object>(event: EventName, callback: (data: T) => void): void;
//     emit<T extends object>(event: string, data?: T): void;
//     trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
// }

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
        
    }

    /**
     * Установить обработчик на событие
     */
    on<T>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }
    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициировать событие с данными
     */
    // emit<T extends object>(eventName: string, data?: T) {
    //     this._events.forEach((subscribers, name) => {
    //         if (name === '*') subscribers.forEach(callback => callback({
    //             eventName,
    //             data
    //         }));
    //         if (name instanceof RegExp && name.test(eventName) || name === eventName) {
    //             subscribers.forEach(callback => callback(data));
    //         }
    //     });
    // // }
    emit<T>(eventName: EventName, data?: T) {
        this._events.forEach((subscribers, name) => {
            // if (name === eventName) subscribers.forEach(callback => callback({
            //     eventName,
            //     data
            // }));
            if (name === eventName) {
                subscribers.forEach(callback => callback(data));
                // this._events.get(eventName)!.forEach(callback => callback(data));
            }
        });
    }
    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        const events = Object.values(AppEvents) as AppEvents[]
        events.forEach(evt => {
            this.on(evt, callback)
        })
        // this.on("*", callback);
    }

    /**
     * Сбросить все обработчики
     */
    offAll() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T>(eventName: EventName, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}




// // Хорошая практика даже простые типы выносить в алиасы
// // Зато когда захотите поменять это достаточно сделать в одном месте

// import { AppEvents } from "../../types";

// type EventName = string | RegExp;
// type Subscriber = Function;
// type EmitterEvent = {
//     eventName: AppEvents,
//     data: unknown
// };

// export interface IEvents {
//     on<T extends object>(event: AppEvents, callback: (data: T) => void): void;
//     emit<T extends object>(event: AppEvents, data?: T): void;
//     trigger<T extends object>(event: AppEvents, context?: Partial<T>): (data: T) => void;
// }

// /**
//  * Брокер событий, классическая реализация
//  * В расширенных вариантах есть возможность подписаться на все события
//  * или слушать события по шаблону например
//  */
// export class EventEmitter implements IEvents {
//     _events: Map<AppEvents, Set<Subscriber>>;

//     constructor() {
//         this._events = new Map<AppEvents, Set<Subscriber>>();
//     }

//     /**
//      * Установить обработчик на событие
//      */
//     on<T>(eventName: AppEvents, callback: (event: T) => void) {
//         // if (!this._events.has(eventName)) {
//         //     this._events.set(eventName, new Set<Subscriber>());
//         // }
//         this._events.get(eventName)?.add(callback);
//     }

//     /**
//      * Снять обработчик с события
//      */
//     off(eventName: AppEvents, callback: Subscriber) {
//         if (this._events.has(eventName)) {
//             this._events.get(eventName)!.delete(callback);
//             if (this._events.get(eventName)?.size === 0) {
//                 this._events.delete(eventName);
//             }
//         }
//     }

//     /**
//      * Инициировать событие с данными
//      */
//     emit<T>(eventName: AppEvents, data?: T) {
//         this._events.forEach((subscribers, name) => {
//             if (name === eventName) subscribers.forEach(callback => callback({
//                 eventName,
//                 data
//             })
//         );
//             // if (name === eventName) {
//             //     subscribers.forEach(callback => callback(data));
//             // }
//         console.log(eventName, data)
//         });

//     /**
//      * Слушать все события
//      */
//     onAll(callback: (event: EmitterEvent) => void) {
//         const events = Object.values(AppEvents) as AppEvents[]
//         events.forEach(evt => {
//             this.on(evt, callback)
//         })
//     }
     
//     /**
//      * Сбросить все обработчики
//      */
//     offAll() {
//         this._events = new Map<AppEvents, Set<Subscriber>>();
//     }

//     /**
//      * Сделать коллбек триггер, генерирующий событие при вызове
//      */
//     trigger<T>(eventName: AppEvents, context?: Partial<T>) {
//         return (event: object = {}) => {
//             this.emit(eventName, {
//                 ...(event || {}),
//                 ...(context || {})
//             });
//         };
//     }
// }

