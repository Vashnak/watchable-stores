function deepFreeze(o: any): any {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(prop => {
    if (
      o.hasOwnProperty(prop) &&
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}

export interface IHandler {
  id: number;
  handler: (data: any) => any;
}

export interface IOptions {
  disableDeepFreeze: boolean;
}

/**
 *
 * Base Store to extend
 *
 * data attribute contains the state of the store
 *
 * You can subscribe to data to be notified when data change
 * Example :
 * let subscription = store.watch(cb)
 * store.unwatch(subscription) // when you're done with it
 *
 */
export const WatchableStore = <T>(initialData: T, options: IOptions = { disableDeepFreeze: false }) => {
  const handlers = [] as IHandler[];
  let nextHandlerId = 0;

  return {
    get data(): T {
      return initialData;
    },
    set data(t: T) {
      initialData = options.disableDeepFreeze ? t : deepFreeze(t);
      handlers.forEach(handler => {
        handler.handler(initialData);
      });
    },
    watch(cb: (data: T) => any): number {
      const ID = nextHandlerId++;
      handlers.push({
        handler: cb,
        id: ID,
      });
      return ID;
    },
    unwatch(id: number) {
      for (let i = 0; i < handlers.length; i++) {
        if (handlers[i].id === id) {
          handlers.splice(i, 1);
          break;
        }
      }
    },
  };
};
