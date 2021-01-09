interface Observable<T> {
  subscribe: (listener: (data: T) => void) => void;
  unsubscribe: (listener: (data: T) => void) => void;
  notify: (data: T) => void;
}

export function observable<T>(): Observable<T> {
  let listeners: ((data: T) => void)[] = [];

  const subscribe = (listener: (data: T) => void) => {
    listeners.push(listener);
  };

  const unsubscribe = (listener: (data: T) => void) => {
    const removeIndex = listeners.findIndex((obs) => {
      return listener === obs;
    });

    if (removeIndex !== -1) {
      listeners = listeners.slice(removeIndex, 1);
    }
  };

  // Loops over this.observers and calls the update method on each observer.
  // The state object will call this method everytime it is updated.
  const notify = (data: T) => {
    if (listeners.length > 0) {
      listeners.forEach((observer) => observer(data));
    }
  };

  return { subscribe, unsubscribe, notify };
}
