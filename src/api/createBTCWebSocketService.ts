import { BTCData } from '../types.ts';

export interface BTCWebSocketService {
    connect: () => void;
    disconnect: () => void;
}

export interface CreateBTCWebSocketServiceProps {
    dataListener: (data: BTCData) => void;
    statusListener: (status: string) => void;
}

export const createBTCWebSocketService = (
    {
        statusListener,
        dataListener
    }: CreateBTCWebSocketServiceProps): BTCWebSocketService => {

    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    let reconnectTimeout: number | null = null;
    const MAX_RECONNECT_ATTEMPTS = 5;

    const connect = () => {
        if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
            return;
        }

        const url = import.meta.env.VITE_BITCOIN_COST_WS_URL;
        ws = new WebSocket(url);

        ws.onopen = () => {
            statusListener('WebSocket connected');
            reconnectAttempts = 0;
        }

        ws.onmessage = (event) => {
            const data: BTCData = JSON.parse(event.data);
            dataListener(data);
            statusListener('Successfully received data');
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
        if (reconnectTimeout !== null) {
            clearTimeout(reconnectTimeout);
        }

        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            statusListener('Max reconnection attempts reached. Please refresh the page to try again.');
            return;
        }

        const baseDelay = 100;
        const scaleFactor = 1.5;
        const maxDelay = 10000;

        const delay = Math.min(baseDelay * (scaleFactor ** reconnectAttempts), maxDelay);
        reconnectAttempts++;

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

        if (ws) {
            ws.close();
            ws = null;
        }

        reconnectAttempts = 0;
    };

    return {connect, disconnect};
};