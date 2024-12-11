import { describe, it, expect, beforeEach } from 'vitest';
import { WebSocketMock, WebSocketMockInterface } from '../webSocketMock.ts';

describe('WebSocketMock', () => {
    let webSocketMock: WebSocketMockInterface<unknown>;

    beforeEach(() => {
        WebSocketMock.clearInstances();
        webSocketMock = new WebSocketMock('ws://localhost');
    });

    it('should initialize with the correct URL', () => {
        expect(webSocketMock.url).toBe('ws://localhost');
    });

    it('should initialize with CONNECTING readyState', () => {
        expect(webSocketMock.readyState).toBe(WebSocketMock.CONNECTING);
    });

    it('should change readyState to OPEN when toggleOnOpen is called', () => {
        webSocketMock.toggleOnOpen();
        expect(webSocketMock.readyState).toBe(WebSocketMock.OPEN);
    });

    it('should change readyState to CLOSING when toggleOnClose is called', () => {
        webSocketMock.toggleOnClose();
        expect(webSocketMock.readyState).toBe(WebSocketMock.CLOSING);
    });

    it('should change readyState to CLOSED when close is called', () => {
        webSocketMock.close();
        expect(webSocketMock.readyState).toBe(WebSocketMock.CLOSED);
    });

    it('should add instances to the static instances array', () => {
        expect(WebSocketMock.instances).toContain(webSocketMock);
    });

    it('should clear instances when clearInstances is called', () => {
        WebSocketMock.clearInstances();
        expect(WebSocketMock.instances).toHaveLength(0);
    });
});