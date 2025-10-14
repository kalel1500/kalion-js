import { route } from 'ziggy-js';
import { __const } from '@/app/core/infrastructure/utilities/_internal/helpers';
import {
    CheckableProcess,
    EchoService,
    FetchBroadcastingResponse,
    g,
    LStorage,
    ResponseEventFetch,
    StorageProcessKeys,
} from '@/app';

export class ProcessChecker
{
    public static divMessage = {
        reverb: document.querySelector<HTMLDivElement>('#reverbErrorMessage'),
        queue: document.querySelector<HTMLDivElement>('#queueErrorMessage'),
    };
    public static routes = {
        reverb: route(__const('routeName_checkReverb')),
        queue: route(__const('routeName_checkQueue')),
    };

    public static STORAGE = {
        reverb: {
            check() {
                return LStorage.getItem(StorageProcessKeys.reverb) === '1';
            },
            setAsFailed() {
                LStorage.setItem(StorageProcessKeys.reverb, '1');
            },
            setAsWorked() {
                LStorage.setItem(StorageProcessKeys.reverb, '0');
            },
        },
        queue: {
            check() {
                return LStorage.getItem(StorageProcessKeys.queue) === '1';
            },
            setAsFailed() {
                LStorage.setItem(StorageProcessKeys.queue, '1');
            },
            setAsWorked() {
                LStorage.setItem(StorageProcessKeys.queue, '0');
            },
        }
    };

    public static startBtnListeners() {
        document.getElementById('btnCheckReverb')?.addEventListener('click', () => {
            ProcessChecker.checkReverb().then();
        });

        document.getElementById('btnCheckQueue')?.addEventListener('click', () => {
            ProcessChecker.checkQueue().then();
        });
    }

    public static startListenCheckChannels() {
        if (__const('VITE_BROADCASTING_ENABLED')) {
            window.Echo.channel('process-status')
                .listen('.ProcessStatusChecked', (res: ResponseEventFetch) => {
                    if (res.response.success) {
                        ProcessChecker.STORAGE[res.processName].setAsWorked();
                    } else {
                        ProcessChecker.STORAGE[res.processName].setAsFailed();
                    }

                    ProcessChecker.displayMessageBasedOnStorage(res.processName);
                });
        }
    }

    public static async checkReverb<T extends FetchBroadcastingResponse>(fromResult: T|undefined = undefined) {
        EchoService.checkAndUpdateConnectedStatus();
        if (EchoService.isFailed() || !__const('VITE_BROADCASTING_ENABLED')) {
            ProcessChecker.STORAGE.reverb.setAsFailed();
            ProcessChecker.displayMessageBasedOnStorage(CheckableProcess.reverb);
            return false;
        }

        return await ProcessChecker.checkProcess(CheckableProcess.reverb, fromResult);
    }

    public static async checkQueue<T extends FetchBroadcastingResponse>(fromResult: T|undefined = undefined) {
        return await ProcessChecker.checkProcess(CheckableProcess.queue, fromResult);
    }

    private static async checkProcess(processName: CheckableProcess, fromResult: FetchBroadcastingResponse|undefined) {
        let processResult = false;
        g.addSpinner(ProcessChecker.divMessage[processName]);
        try {
            const result = fromResult ?? await g.fetchStrict<FetchBroadcastingResponse>({url: ProcessChecker.routes[processName]});

            if (!result.data.hasOwnProperty('broadcasting')) {
                throw new Error(`No se ha encontrado la propiedad "broadcasting" en la "response" al comprobar el proceso "${processName}"`);
            }

            if (!result.data.broadcasting.success) {
                ProcessChecker.STORAGE[processName].setAsFailed();
                processResult = true;
            } else {
                ProcessChecker.STORAGE[processName].setAsWorked();
            }

            ProcessChecker.displayMessageBasedOnStorage(processName);
        } catch (e) {
            g.catchCode({error: e});
        }

        g.removeSpinner(ProcessChecker.divMessage[processName]);
        return processResult;
    }

    public static displayMessageBasedOnStorage(processName: CheckableProcess) {
        const hiddenClass = g.getHiddenClass();
        if (ProcessChecker.STORAGE[processName].check()) {
            ProcessChecker.divMessage[processName]?.classList.add(hiddenClass);
        } else {
            ProcessChecker.divMessage[processName]?.classList.remove(hiddenClass);
        }
    }
}