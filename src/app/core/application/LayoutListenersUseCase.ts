import { LStorage } from '../infrastructure';
import { Instantiable } from '../infrastructure/utilities/general/Instantiable';
import { DomService } from '../domain/services/DomService';

export class LayoutListenersUseCase extends Instantiable {
    __invoke() {
        LStorage.checkAndUpdateVersion();
        DomService.new().startDarkMode();
        DomService.new().startSidebarState();
        DomService.new().startSidebarArrowsObserve();
    }
}