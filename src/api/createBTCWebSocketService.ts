import { BTCData } from '../types/types.ts';
import { isBTCData } from '../utils/type-guards/isBTCData.ts';

export interface BTCWebSocketService {
    connect: () => void;
    disconnect: () => void;
}

export interface CreateBTCWebSocketServiceProps {
    dataListener: (data: BTCData) => void;
    statusListener: (status: string) => void;
}

const MAX_RECONNECT_ATTEMPTS = 1000;

export const createBTCWebSocketService = (
    {
        statusListener,
        dataListener
    }: CreateBTCWebSocketServiceProps): BTCWebSocketService => {

    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
        if (ws && (ws.readyState !== WebSocket.CLOSED)) {
            return;
        }

        const url = import.meta.env.VITE_BITCOIN_COST_WS_URL;
        ws = new WebSocket(url);

        ws.onopen = () => {
            statusListener('WebSocket connected');
            reconnectAttempts = 0;
        }

        ws.onmessage = (event: MessageEvent<string>) => {
            const data: unknown = JSON.parse(event.data);
            if (isBTCData(data)) {
                dataListener(data);
                statusListener('Successfully received data');
            } else {
                statusListener('Received malformed data');
                console.error('Invalid data format received:', data);
            }
        };

        ws.onclose = () => {
            statusListener('WebSocket disconnected. Reconnecting...');
            reconnect();
        };

        ws.onerror = (error: Event) => {
            const errorMessage = error instanceof ErrorEvent ? 'WebSocket error:' + error.message : 'An unknown error occurred';
            statusListener(errorMessage);
            console.error('WebSocket error:', error);
        };
    };

    const reconnect = () => {
        reconnectAttempts++;

        if (reconnectTimeout !== null) {
            clearTimeout(reconnectTimeout);
        }

        if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
            statusListener('Max reconnection attempts reached. Please refresh the page.');
            disconnect();
            return;
        }

        const baseDelay = 100;
        const scaleFactor = 1.5;
        const maxDelay = 10000;

        const delay = Math.round(Math.min(baseDelay * (scaleFactor ** (reconnectAttempts - 1)), maxDelay));
        statusListener(`Connection lost. Reconnecting in ${(delay / 1000).toFixed(1)} seconds...`);

        reconnectTimeout = setTimeout(() => {
            statusListener(`Reconnection attempt ${reconnectAttempts}...`);
            connect();
        }, delay);
    };

    const disconnect = () => {
        if (reconnectTimeout !== null) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
        }

        if (ws && ws.readyState !== WebSocket.CLOSED) {
            ws.close();
            ws = null;
        }

        reconnectAttempts = 0;
    };

    return {connect, disconnect};
};