export interface IWatcher {
    trigger: (props?: any) => {},
    id: number,
}

export class WatchableStore<T> {
    private _watchers: IWatcher[];
    private _data: T;
    private _nextHandlerId: number;

    constructor(initialData: T) {
        this._data = initialData;
        this._watchers = [];
        this._nextHandlerId = 0;
    }

    get data() {
        return this._data;
    }

    set data(data: T) {
        this._data = data;
        this._watchers.forEach(watcher => {
            watcher.trigger(this._data);
        })
    }

    public watch(cb: (data: T) => any): number {
        const id = this._nextHandlerId;
        this._watchers.push({
            trigger: cb,
            id
        });
        this._nextHandlerId++;
        return id;
    }

    public unwatch(id: number): void {
        for (let i = 0; i < this._watchers.length; i++) {
            if (this._watchers[i].id === id) {
                this._watchers.splice(i, 1);
                break;
            }
        }
    }
}
