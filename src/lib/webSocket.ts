interface wsConfig {
    store: {
        update: (updater: (messenger: any) => any) => void;
    };
    url: string;
    onmessage?: Array<() => void>;
    onopen?: Array<() => void>;
}

export class Socket {
    ws: WebSocket;
    store: {
        update: (updater: (messenger: any) => any) => void;
    };
    onmessage?: Array<() => void>;
    onopen?: Array<() => void>;

    constructor(config: wsConfig) {
        this.store = config.store;
        this.onmessage = config.onmessage;
        this.onopen = config.onopen;
        this.ws = new WebSocket(config.url);
        this.ws.onopen = (e) => this.onOpen(e);
        this.ws.onmessage = (e) => this.onMessage(e);
        this.ws.onerror = (e) => this.onError(e);
        this.ws.onclose = (e) => this.onClose(e);
    }

    onOpen(event: Event): void {
        console.debug("MessageBox opened");

        if (this.onopen)
            for (let func of this.onopen)
                func();
    }

    onMessage(event: MessageEvent, store?: { update: (updater: (messenger: any) => any) => void }): void {
        const storer = store ? store : this.store;
        const data = JSON.parse(event.data);

        console.debug("Message received", data);

        storer.update((messenger: any) => [...messenger, data]);
        if (this.onmessage)
            for (let func of this.onmessage)
                func();
    }

    onError(event: Event): void {
        // Optionally handle error
        console.debug("MessageBox Error!");
    }

    onClose(event: CloseEvent): void {
        // Optionally handle close
        console.debug("MessageBox closed");
    }

    sendData(data: string): void {
        console.debug("MessageBox sending data", data);
        this.ws.send(data);
    }
}