import { BTCData } from '../types.ts';

export interface BTCWebSocketService {
    connect: () => void;
    disconnect: () => void;
}

export interface CreateBTCWebSocketServiceProps {
    statusListener: (status: string) => void;
    dataListener: (data: BTCData) => void;
}

export const createBTCWebSocketService = ({
                                              statusListener,
                                              dataListener,
                                          }: CreateBTCWebSocketServiceProps): BTCWebSocketService => {

    let ws: WebSocket | null = null;

    const connect = () => {
        ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

        ws.onopen = () => statusListener('WebSocket connected');

        ws.onmessage = (event) => {
            const data: BTCData = JSON.parse(event.data);
            dataListener(data);
            statusListener('')
        };

        ws.onclose = () => {
            statusListener('WebSocket disconnected. Reconnecting...');
            setTimeout(connect, 5000);
        };

        ws.onerror = (error: Event) => {
            statusListener(error instanceof ErrorEvent ? 'WebSocket error:' + error.message : 'An unknown error occurred');
            console.error('WebSocket error:', error);
        };
    };

    const disconnect = () => {
        if (ws) {
            ws.close();
        }
    };

    return {connect, disconnect};
};