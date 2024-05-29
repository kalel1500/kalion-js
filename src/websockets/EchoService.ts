import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {_const} from "../../app/config";
import Websocket from "./Websocket";

export default class EchoService
{
    static #connectionFailed = false
    static #connectionSuccess = false
    static #isStarted = false

    static start()
    {
        if (!_const.VITE_BROADCASTING_ENABLED) return

        // initEcho

        window.Pusher = Pusher

        window.Echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
            wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        })


        // initBinds

        const pusherErrorFunction = (error: any, type: string) => {
            EchoService.#connectionFailed = true
            console.error(`[-------------------------------------------------------------]`);
            console.error(`Ha habido un error en la conexion con los websockets [${type}]:`);
            console.error(error);
        }

        const echoConnection = window.Echo.connector.pusher.connection;

        // Cambio cualquer estado
        echoConnection.bind('state_change', (states: any) => {
            EchoService.#connectionSuccess = true;
            if (states.current === 'connected') {
                EchoService.#connectionFailed = false
            }

            console.info('[change]')
            Websocket.checkWebsocketsService().then()
        });

        // ------------------------------------------------------------- Estados de ok -------------------------------------------------------------------

        echoConnection.bind('initialized', () => console.info('[initialized]'));

        echoConnection.bind('connecting', () => console.info('[connecting]'));

        echoConnection.bind('connected', () => {console.info('[connected]')});

        // ----------------------------------------------------------- Estados de error ------------------------------------------------------------------

        echoConnection.bind('error', (error: any) => pusherErrorFunction(error, 'error'));

        echoConnection.bind('failed', (error: any) => pusherErrorFunction(error, 'failed'));

        echoConnection.bind('disconnected', (error: any) => pusherErrorFunction(error, 'disconnected'));

        echoConnection.bind('unavailable', (error: any) => pusherErrorFunction(error, 'unavailable'));

    }

    // -----------------------------------------------------------------------------------------------------------------
    // ----- GETTERS AND SETTERS----------------------------------------------------------------------------------------

    static isConnected(): boolean
    {
        return EchoService.#connectionSuccess || !EchoService.#connectionFailed;
    }

    static checkAndUpdateConnectedStatus()
    {
        if (!EchoService.#isStarted) return;
        const echoConnection = window.Echo.connector.pusher.connection;
        if (EchoService.#connectionFailed && echoConnection.state === 'connected') {
            EchoService.#connectionFailed = false
        }
    }
}
