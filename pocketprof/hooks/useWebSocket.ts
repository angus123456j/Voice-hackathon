'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type MessageHandler = (message: any) => void;

export function useWebSocket(onMessage: MessageHandler) {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    const onMessageRef = useRef<MessageHandler>(onMessage);

    // Update the ref whenever the handler changes, without triggering effects
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const connect = useCallback(() => {
        // Prevent multiple simultaneous connection attempts
        if (wsRef.current && (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)) {
            return;
        }

        try {
            console.log('[WS] Connecting to 127.0.0.1:5000...');
            const ws = new WebSocket("ws://127.0.0.1:5000");
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[WS] Connected successfully');
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    onMessageRef.current(message);
                } catch (error) {
                    console.error('[WS] Parse error:', error);
                }
            };

            ws.onerror = (error) => {
                // Silencing error logs during normal dev reloads
            };

            ws.onclose = (event) => {
                setIsConnected(false);
                // Only log and reconnect if it wasn't a clean intentional close
                if (event.code !== 1000 && event.code !== 1001) {
                    console.log(`[WS] Connection lost (Code: ${event.code}). Reconnecting in 3s...`);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, 3000);
                }
            };
        } catch (error) {
            console.error('[WS] Setup failed:', error);
        }
    }, []);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                // Remove the onclose handler before closing to prevent reconnection loops during unmount
                wsRef.current.onclose = null;
                wsRef.current.close();
            }
        };
    }, [connect]);

    const sendMessage = useCallback((message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    }, []);

    return { sendMessage, isConnected };
}
