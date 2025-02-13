// Declare .env variables
declare global {
    interface ImportMeta {
        readonly env: EnvVariables & {
            VITE_OTHER?: string
        };
    }
}

// Importar plugins
import 'flowbite';

// INICIALIZAR CONSTANTES Y TRADUCCIONES (para que se apliquen en el paquete aunque no se utilicen en la app)
import './constants';
import './translations';

// Los otros imports (debajo)
import { EnvVariables, Route, UtilitiesServiceProvider } from '@kalel1500/laravel-ts-utils';
import { defineRoutes } from './routes';

// Definir que acciones ejecutar del paquete
UtilitiesServiceProvider.features(['registerGlobalError', 'enableNotifications', 'startLayoutListeners']);

// Definimos y ejecutamos las rutas de JS
defineRoutes();
Route.dispatch();
