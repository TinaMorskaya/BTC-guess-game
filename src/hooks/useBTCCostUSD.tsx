import { useEffect, useState } from 'react';
import { createBTCWebSocketService } from '../api/createBTCWebSocketService.ts';
import { BTCData } from '../types.ts';
import { useThrottleState } from '../helpers/throttle/useThrottleState.tsx';

export const WAIT_TIME = 3000;

export const useBTCCostUSD = () => {
    const [ price, setPrice ] = useState<number | null>(null);
    const [ date, setDate ] = useState<Date | null>(null);
    const [ status, setStatus ] = useThrottleState<string>('', WAIT_TIME, {leading: false});

    const dataListener = (data: BTCData) => {
        const price = parseFloat(data.p);
        if (isNaN(price)) return;
        setPrice(price);
        setDate(new Date(data.T));
    };

    useEffect(() => {
        const {connect, disconnect} = createBTCWebSocketService({
            dataListener,
            statusListener: setStatus
        });
        connect();

        return () => {
            disconnect();
        };
    }, [ setStatus ]);

    return {price, date, status};
}