import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { __const } from '../_internal/helpers';
import { Websocket } from './Websocket';

export class EchoService {
    static #connectionFailed: boolean | null = null;
    static #isStarted = false;

    static start() {
        if (!__const('VITE_BROADCASTING_ENABLED')) return;

        // initEcho

        window.Pusher = Pusher;

        window.Echo = new Echo({
            broadcaster: 'reverb',
            key: __const('VITE_REVERB_APP_KEY'),
            wsHost: __const('VITE_REVERB_HOST'),
            wsPort: __const('VITE_REVERB_PORT') ?? 80,
            wssPort: __const('VITE_REVERB_PORT') ?? 443,
            forceTLS: (__const('VITE_REVERB_SCHEME') ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        });


        // initBinds

        const pusherErrorFunction = (error: any, type: string) => {
            EchoService.#connectionFailed = true;
            console.error(`[-------------------------------------------------------------]`);
            console.error(`Ha habido un error en la conexion con los websockets [${type}]:`);
            console.error(error);
        };
        const pusherSuccessFunction = (type: string) => {
            EchoService.#connectionFailed = false;
            console.info(`[${type}]`);
        };

        const echoConnection = window.Echo.connector.pusher.connection;

        // Cambio cualquer estado
        echoConnection.bind('state_change', (states: any) => {
            console.info(`pusher.connection.state changed to [${states.current}]`);
            Websocket.checkWebsocketsService().then();
        });

        // ------------------------------------------------------------- Estados de ok -------------------------------------------------------------------

        echoConnection.bind('initialized', () => console.info('[initialized]'));

        echoConnection.bind('connecting', () => console.info('[connecting]'));

        echoConnection.bind('connected', () => pusherSuccessFunction('connected'));

        // ----------------------------------------------------------- Estados de error ------------------------------------------------------------------

        echoConnection.bind('error', (error: any) => pusherErrorFunction(error, 'error'));

        echoConnection.bind('failed', (error: any) => pusherErrorFunction(error, 'failed'));

        echoConnection.bind('disconnected', (error: any) => pusherErrorFunction(error, 'disconnected'));

        echoConnection.bind('unavailable', (error: any) => pusherErrorFunction(error, 'unavailable'));

    }

    // -----------------------------------------------------------------------------------------------------------------
    // ----- GETTERS AND SETTERS----------------------------------------------------------------------------------------

    static isFailed(): boolean {
        return EchoService.#connectionFailed === true;
    }

    static checkAndUpdateConnectedStatus() {
        if (!EchoService.#isStarted) return;
        const echoConnection = window.Echo.connector.pusher.connection;
        if (EchoService.#connectionFailed === true && echoConnection.state === 'connected') {
            EchoService.#connectionFailed = false;
        }
    }
}
