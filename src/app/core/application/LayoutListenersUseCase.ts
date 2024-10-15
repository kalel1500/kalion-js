import { Instantiable, LStorage } from '../infrastructure';
import { DomService } from '../domain';

export class LayoutListenersUseCase extends Instantiable
{
    __invoke()
    {
        LStorage.checkAndUpdateVersion();
        DomService.new().startDarkMode();
        DomService.new().startSidebarState();
    }
}