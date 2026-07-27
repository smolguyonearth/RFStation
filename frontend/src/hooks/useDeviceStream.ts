import { useState, useEffect, useRef } from 'react';
import type { DeviceData } from '@/types/device.types';

export function useDeviceStream() {
    const [stream, setStream] = useState<DeviceData[]>([]);
    const bufferRef = useRef<DeviceData[]>([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000/ws');
        let counter = 0;

        ws.onmessage = (event) => {
            const rawData = JSON.parse(event.data);
            const newData: DeviceData = {
                ...rawData,
                id: `${Date.now()}-${counter++}`
            };

            bufferRef.current = [newData, ...bufferRef.current].slice(0, 100);
        };

        const interval = setInterval(() => {
            if (bufferRef.current.length > 0) {
                setStream([...bufferRef.current]);
            }
        }, 100);

        return () => {
            ws.close();
            clearInterval(interval);
        };
    }, []);

    return {
        stream,
        latest: stream[0]
    };
}