export interface WebSocketMockInterface<T> {
    readonly url: string;
    toggleOnOpen: () => void;
    toggleOnMessage: (event: MessageEvent<T>) => void;
    toggleOnClose: () => void;
    toggleOnError: (error: Event) => void;
    close: () => void;

    get readyState(): number;
}

export class WebSocketMock<T = unknown> implements WebSocketMockInterface<T> {
    static instances: WebSocketMock[] = [];
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;
    readonly url: string;
    private onmessage: (event: MessageEvent<T>) => void = vi.fn();
    private onclose: () => void = vi.fn();
    private onerror: (error: Event) => void = vi.fn();
    private onopen: () => void = vi.fn();

    constructor(url: string) {
        this.url = url;
        WebSocketMock.instances.push(this as WebSocketMock);
    }

    private _readyState: number = WebSocketMock.CONNECTING;

    get readyState() {
        return this._readyState;
    }

    static clearInstances() {
        WebSocketMock.instances = [];
    }

    close: () => void = () => {
        this._readyState = WebSocketMock.CLOSED;
    };

    toggleOnOpen() {
        this.onopen();
        this._readyState = WebSocketMock.OPEN;
    }

    toggleOnMessage(event: MessageEvent<T>) {
        this.onmessage(event);
    }

    toggleOnClose() {
        this.onclose();
        this._readyState = WebSocketMock.CLOSING;
    }

    toggleOnError(error: Event) {
        this.onerror(error);
    }
}