interface IEvent {
    [type: string]: Function[];
}

class EventEmitter {
    events: IEvent;

    constructor() {
        this.events = {};
    }

    on(type: string, callback: Function) {
        if (!this.events[type]) {
            this.events[type] = [callback];
        } else {
            this.events[type].push(callback);
        }
    }

    off(type: string, callback: Function) {
        if (this.events[type]) {
            this.events[type] = this.events[type].filter(item => {
                return item !== callback;
            })
        }
    }

    emit(type: string, ...args: any[]) {
        if (this.events[type]) {
            this.events[type].forEach(callback => {
                callback.apply(this, args);
            })
        }
    }

    once(type: string, callback: Function) {
        const fn = () => {
            callback();
            this.off(type, callback);
        }
        this.on(type, fn);
    }
}

export default new EventEmitter();