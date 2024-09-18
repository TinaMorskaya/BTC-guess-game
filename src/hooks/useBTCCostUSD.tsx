import { useEffect, useState } from 'react';
import { createBTCWebSocketService } from '../api/createBTCWebSocketService.ts';
import { BTCData } from '../types.ts';

export const useBTCCostUSD = () => {
    const [ price, setPrice ] = useState<number | null>(null);
    const [ date, setDate ] = useState<Date | null>(null);
    const [ status, setStatus ] = useState('');

    const dataListener = (data: BTCData) => {
        const price = parseFloat(data.p);
        if (isNaN(price)) return;
        setPrice(price);
        setDate(new Date(data.T));
    }
    const statusListener = (status: string) => setStatus(status);

    useEffect(() => {
        const {connect, disconnect} = createBTCWebSocketService({dataListener, statusListener});
        connect();

        return () => {
            disconnect();
        };
    }, []);

    return {price, date, status};
}