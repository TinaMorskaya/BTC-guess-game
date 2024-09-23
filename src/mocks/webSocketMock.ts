export class WebSocketMock implements Partial<WebSocket> {
    static instances: WebSocketMock[] = [];
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;

    onopen: () => void = vi.fn();
    onmessage: (event: { data: string }) => void = vi.fn();
    onclose: () => void = vi.fn();
    onerror: (error: Event) => void = vi.fn();
    close: () => void = vi.fn();
    url: string;
    readyState: number = WebSocketMock.CONNECTING;

    constructor(url: string) {
        this.url = url;
        WebSocketMock.instances.push(this);
    }

    static clearInstances() {
        WebSocketMock.instances = [];
    }

    toggleOnOpen() {
        this.onopen();
        this.readyState = WebSocketMock.OPEN;
    }

    toggleOnMessage(data: string) {
        this.onmessage({data});
    }

    toggleOnClose() {
        this.onclose();
        this.readyState = WebSocketMock.CLOSING;
    }

    toggleOnError(error: Event) {
        this.onerror(error);
    }

    toggleClose() {
        this.close();
        this.readyState = WebSocketMock.CLOSED;
    }
}