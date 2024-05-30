import LStorage from "../storage/LStorage";
import g from "../helpers/global";
import {route} from "ziggy-js";
import EchoService from "./EchoService";
import SModal from "../modals/sweetalert/SModal";
import {_const} from "../helpers/Config";
import {FetchBroadcastingResponse, FetchResponse, FetchResponseOrBroadcasting, ResponseEventFetch} from "../../types";

export default class Websocket
{
    static STORAGE = {
        check() {
            return LStorage.getItem('websocketsFailed') === '1'
        },
        setAsFailed() {
            LStorage.setItem('websocketsFailed', '1');
        },
        setAsWorked() {
            LStorage.setItem('websocketsFailed', '0');
        },
    };

    static divMessageWebsockets= document.querySelector<HTMLDivElement>('#websocketsErrorMessage');
    static divMessageQueues= document.querySelector<HTMLDivElement>('#queuesErrorMessage');

    constructor()
    {
        document.getElementById('btnCheckWebsockets')?.addEventListener('click', () => {
            Websocket.checkWebsocketsService().then();
        });

        document.getElementById('btnCheckQueues')?.addEventListener('click', () => {
            Websocket.#checkQueuesService().then();
        });

        if (_const.VITE_BROADCASTING_ENABLED) {
            window.Echo.channel('check-websockets-status')
                .listen('.EventCheckWebsocketsStatus', () => {
                    Websocket.STORAGE.setAsWorked();
                    Websocket.#checkStorageAndToggleError()
                });
            window.Echo.channel('check-queues-status')
                .listen('.EventCheckQueuesStatus', (res: ResponseEventFetch) => {
                    Websocket.toggleErrorQueues(res.response)
                });
        }
    }

    static async checkWebsocketsService()
    {
        g.addSpinner(Websocket.divMessageWebsockets);
        try {
            EchoService.checkAndUpdateConnectedStatus();

            const ajaxResult = await g.newFetch<FetchBroadcastingResponse>({url: route('ajax.shared.websockets.checkService')});
            Websocket.checkBroadcastingFetch({result: ajaxResult});
            g.removeSpinner(Websocket.divMessageWebsockets);
        } catch (e) {
            g.catchCode({error: e, from: 'Websocket->checkWebsocketsService()'});
            Websocket.#checkStorageAndToggleError()
        }
    }

    static async #checkQueuesService()
    {
        g.addSpinner(Websocket.divMessageQueues);
        let result: FetchResponseOrBroadcasting | undefined
        try {
            result = await g.newFetch<FetchResponseOrBroadcasting>({url: route('ajax.shared.queues.checkService')});
        } catch (e) {
            result = (e as FetchResponseOrBroadcasting)
            g.catchCode({error: e, from: 'Websocket->checkQueuesService()'});
        } finally {
            if (result !== undefined) Websocket.checkBroadcastingFetch({result, onError: (res) => Websocket.toggleErrorQueues(res)});
            g.removeSpinner(Websocket.divMessageQueues);
        }
    }

    static #checkStorageAndToggleError()
    {
        if (!Websocket.divMessageWebsockets) return;

        if (Websocket.STORAGE.check()) {
            Websocket.divMessageWebsockets.classList.remove('d-none');
        } else {
            Websocket.divMessageWebsockets.classList.add('d-none');
        }
    }

    static toggleErrorQueues(res: FetchResponse)
    {
        if (res.success) {
            Websocket.divMessageQueues?.classList.add('d-none');
        } else {
            Websocket.divMessageQueues?.classList.remove('d-none');
        }
    }


    startListenChannel(channelName: string, events: {event: string, callback: Function}[])
    {
        if (_const.VITE_BROADCASTING_ENABLED) {
            let channel = window.Echo.channel(channelName);
            events.forEach(event => {
                channel = channel.listen(event.event, (e: any) => {
                    Websocket.STORAGE.setAsWorked()
                    Websocket.#checkStorageAndToggleError()
                    event.callback(e)
                })
            })
        }

        if (LStorage.isFirstConnectionInDay()) {
            Websocket.checkWebsocketsService().then();
        } else {
            Websocket.#checkStorageAndToggleError()
        }
    }

    static checkBroadcastingFetch({result, onError, showAlert = false}: {result: FetchBroadcastingResponse | FetchResponse, onError?: (res: FetchBroadcastingResponse) => void, showAlert?: boolean})
    {
        if (!result.data?.hasOwnProperty('broadcasting')) return
        const resultB = (result as FetchBroadcastingResponse)

        if (showAlert) {
            SModal.toastBoth({success: resultB.success, title: resultB.message}).then()
        }

        const emittingEventHasFailed = !resultB.data.broadcasting.success || !EchoService.isConnected()
        if (!_const.VITE_BROADCASTING_ENABLED || emittingEventHasFailed) { // Codigo que se ejecuta cuando NO estan activos los websoquets
            Websocket.STORAGE.setAsFailed()
            if (typeof onError === 'function') onError(resultB)
        }

        Websocket.#checkStorageAndToggleError()
    }

}
