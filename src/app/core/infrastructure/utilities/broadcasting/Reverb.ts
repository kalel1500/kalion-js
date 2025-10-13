import { ProcessChecker } from './ProcessChecker';
import { __const } from '../_internal/helpers';
import { CheckableProcess } from '../../../_types';

export class Reverb
{
    constructor() {
        ProcessChecker.startBtnListeners();
        ProcessChecker.startListenCheckChannels();
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