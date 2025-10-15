import { __const } from '@/app/core/infrastructure/utilities/_internal/helpers';
import { CheckableProcess, ProcessChecker } from '@/app';

export class Reverb
{
    constructor() {
        ProcessChecker.startBtnListeners();
        ProcessChecker.startListenCheckChannels();
        ProcessChecker.displayMessageBasedOnStorage(CheckableProcess.reverb);
        ProcessChecker.displayMessageBasedOnStorage(CheckableProcess.queue);
    }

    startListenChannel(channelName: string, events: { event: string, callback: Function }[]) {
        if (__const('VITE_BROADCASTING_ENABLED')) {
            let channel = window.Echo.channel(channelName);
            events.forEach(event => {
                channel = channel.listen(event.event, (e: any) => {
                    ProcessChecker.STORAGE.reverb.setAsWorked();
                    ProcessChecker.displayMessageBasedOnStorage(CheckableProcess.reverb);
                    event.callback(e);
                });
            });
        }
    }

}