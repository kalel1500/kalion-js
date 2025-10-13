import { DomService, Instantiable, LStorage } from '@/app';

export class LayoutListenersUseCase extends Instantiable {
    __invoke() {
        LStorage.checkAndUpdateVersion();
        DomService.new().startDarkMode();
        DomService.new().startSidebarState();
        DomService.new().startSidebarArrowsObserve();
    }
}