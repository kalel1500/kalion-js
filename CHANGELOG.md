# Release Notes

## [Unreleased](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.3.0-beta.4...master)

## [v1.3.0-beta.4](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.3.0-beta.2...v1.3.0-beta.4) - 2024-11-26

### Added

* cookies: Nueva clase `Cookie.ts` para manejar las Cookies desde el front

### Changed

* stubs: Cambios ruta `/home`:
  * renombrar y mover controller de `.../src/home/infrastructure/HomeController.ts` a `.../src/shared/infrastructure/DefaultController.ts`
  * renombrar método `HomeController::index()` a `DefaultController::home()`
  * crear nuevo `HomeUseCase` llamarlo en el `DefaultController` para no tener toda la lógica en el controller
* cookies: Modificar `DomService.ts` para utilizar las `Cookies` en vez del `localStorage`
* Actualizar dependencias `vite-plugin-dts` y `vite-plugin-static-copy`
* Eliminar `sass` como dependencia de desarrollo y pasar todo el `scss` a `css` (añadir dependencias `autoprefixer` y `postcss-nested` y nuevo archivo `postcss.config.js`)
* Actualizar dependencias y adaptar código relacionado con `laravel-echo` y `sass`

## [v1.3.0-beta.2](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.3.0-beta.1...v1.3.0-beta.2) - 2024-11-09

### Removed

* stubs: archivo `.env.local` eliminado (ya que ahora está en el paquete de composer `laravel-hexagonal-and-ddd-architecture-utilities`

## [v1.3.0-beta.1](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.3.0-beta.0...v1.3.0-beta.1) - 2024-11-05

### Added

* stubs: añadir archivo `.env.local`
* docs: guardar código del parámetro como código interesante
* stubs: añadir archivo `resources/images/favicon.ico`
* docs: Ejemplo de import dinámico con Tabulator

### Changed

* cli: unir los arrays `typeScriptFiles` y `tailwindFiles` en un solo array `filesToCreate` con los archivos que se crearan siempre
* cli: añadir código para detectar si el archivo es binario (`.ico`) y en ese caso pasar la codificación como null
* cli: añadir código para eliminar archivos preexistentes (se definen en el array `filesToRemove`)
* (refactor) stubs: identar `postcss.config.js` y `tailwind.config.ts` con 4 espacios

### Fixed

* (fix) corregir numero version en el `CHANGELOG.md`

## [v1.3.0-beta.0](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.14...v1.3.0-beta.0) - 2024-10-31

### Added

* tailwindcssPlugin: actualizar archivo `tailwind.config.ts` en los stubs
* tailwindcssPlugin: Exportar nuevo array `laravelDefaultPlugins` en el `tailwindcss-plugin.ts` + instalada dependencia flowbite
* tailwindcssPlugin: Nuevo plugin de tailwind (`tailwindcss-plugin.ts`) para establecer las configuraciones de laravel en todos los proyectos: 
  * código del plugin
  * compilar en vite
  * instalar dependencia de tailwindcss
* docs: nuevos archivos con código interesante
* stubs: añadir tsconfig.json
* docs: guardar ejemplo de tsconfig full con todos los parámetros en docs
* Nueva clase `DomService` con los métodos `startDarkMode()` y `startSidebarState()` + código añadido como feature en el `ServiceProvider` (a través de un UseCase)
* Nuevas clases de utilidades: `Html`, `Instantiable` y `Mutation`

### Changed

* stubs: simplificar `HomeController` (guardar código example1 en la documentación)
* cli: añadir función para eliminar archivos con otras extensiones si existen
* stubs: añadir las rutas del paquete de laravel en la configuración de tailwind para que se compilen los estilos de los componentes
* stubs: modificar extension del postcss de `.ts` a `.js`
* stubs: añadir archivos `.prettierrc` y `vite.config.ts`
* stubs: eliminar ruta `SharedController@compare`, ya que ese código se moverá al paquete de laravel
* stubs: igualar archivos a la template ->
  * añadir css del paquete (app.css)
  * nueva variable de entorno VITE_APP_STORAGE_VERSION (bootstrap y constants)
  * añadir feature `startLayoutListeners` (bootstrap)
  * renombrar rutas y quitar `SharedController@layout` (routes y controllers)
  * eliminar método `testFlowbiteCollapse` y añadir el `testMutationObserve` en el `TestController`
  * eliminar método `layout` y añadir el `compare` en el `SharedController`
* stubs: extension `postcss.config` cambiada a `.js`
* stubs: tailwind.config.ts -> añadir pantalla muy pequeña (vsm) y nueva variante para el sidebar-collapsed (sc:)
* Renombrar `main.scss` a `app-old.scss` + trasladar css base de la template en `app.scss` + compilar los dos archivos por separado (por retrocompatibilidad)
* (refactor) formatear código
* (refactor) ordenar features del `UtilitiesServiceProvider.ts`
* (refactor) simplificar `index.ts` del dominio
* (refactor) Mover TestUseCase al dominio (como servicio)
* (refactor) renombrar clase `Test` a `TestUseCase` (ya que está en la carpeta `application`)
* (refactor) mover clase Test a la carpeta de application
* (refactor) mover las clases de utilidades sueltas a la carpeta `general` para no tener una carpeta para cada clase
* cli: simplificar definición de archivos, ya que el destino y el origen son iguales
* stubs: renombrar las extensiones de los archivos para que sean iguales a las finales (`.ts`, `.css` y `.json`) y asi se pueden comparar mejor
* (refactor) reestructurar carpetas para seguir los principios de la arquitectura hexagonal separando el código en las capas de Dominio e Infraestructura
* (refactor) websockets: extraer lógica del `echoConnection.bind('state_change'...)` a la función `pusherSuccessFunction()` y llamarla en `echoConnection.bind('connected'...)`
* (refactor) websockets: mover `startStorageDay()` al `UtilitiesServiceProvider` para no tener que llamarlo en cada proyecto
* (refactor) cli: renombrar variables
* stubs: mover todos los archivos de la carpeta `src/cli/files` a `src/cli/stubs`
* stubs: nuevo código global `SharedController@layout` para gestionar el modo oscuro
* stubs: Flowbite añadido en la configuración de tailwindcss, importado en `bootstrap.txt` y nuevo test `testFlowbiteCollapse()`

### Fixed

* (fix) stubs: varios cambios ->
  * en algún momento se cambió el nombre de los estilos de `style.css` a `styles.css`
  * eliminar imports no usados en `HomeController.ts`
  * simplificar ruta home y eliminar test, ya que en algún momento se eliminó el controlador
* (fix) solucionado error al compilar: incluir ruta completa en los imports de las clases `Instantiable` y `DomService` para que compile las clases en el orden correcto
* (fix) reducir capas `index.ts` para solucionar problemas de importaciones al compilar
* (fix) Solucionado error al exportar las clases
* (fix) EchoService: renombrar `EchoService.isConnected()` a `EchoService.isFailed()`
* (fix) EchoService: eliminar variable `connectionSuccess` (que manejaba el pendiente) y establecer el `connectionFailed` por defecto a `null`
* (fix) websockets: eliminar `checkWebsocketsService()` del `startListenChannel()` ya que se hace en el cambio de estado del `Echo` (`echoConnection.bind('state_change'...)`) y falla si se hace 2 veces seguidas. Además, por ahora no se usa el `isFirstConnectionInDay`

### Removed

* Eliminar `package-lock.json` del repositorio
* stubs: eliminar `TestController`
* Eliminar dependencia `@fortawesome/fontawesome-free`

## [v1.2.0-beta.14](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.13...v1.2.0-beta.14) - 2024-09-26

### Added

* development-tips.md: añadida información sobre paquetes interesantes

### Fixed

* (fix) solucionado error en el `vite-plugin-laravel-ts-utils`, ya que las dependencias externas solo funcionaban con el `npm run build`.
  Al hacer el `npm run dev` Vite utiliza otros métodos para resolver las dependencias que no se habían contemplado

## [v1.2.0-beta.13](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.6...v1.2.0-beta.13) - 2024-09-25

### Changed

* (refactor) stubs: modificar las comillas dobles (`"`) por comillas simples (`'`) + dejar espacios en los imports con llaves (`{ ... }`)
* stubs: Nuevos archivos para configurar `tailwindcss` y poder recibir parámetro en el comando de creación (`npx laravel-ts-utilities`) para poder separar la creación entre `all`, `typescript`, `tailwind`.
* stubs: Ruta `scripts` renombrada `cli` y el `postinstall.js` a `index.js`.
* stubs: Eliminar script `postinstall` y añadir comando (`bin`) `laravel-ts-utilities` en el archivo `package.json` para poder crear los archivos manualmente y no solo tras la instalación (como `npx tailwindcss`).

## [v1.2.0-beta.6](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.5...v1.2.0-beta.6) - 2024-09-23

### Fixed

* (fix) postinstall: se creaban los archivos en el propio paquete. Ahora se sube dos niveles para salir de node_modules y crearlos en la aplicación que lo instala.

## [v1.2.0-beta.5](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.4...v1.2.0-beta.5) - 2024-09-23

### Added

* Nuevo script (postinstall) para crear los archivos iniciales del front de la aplicación tras la instalación del paquete (`dist/scripts/postinstall.js`)

### Changed

* (refactor) Compilar todo el código dentro de la carpeta `dist` separándolo en dos carpetas `dist/app` y `dist/plugins`
* (refactor) Código fuente del front movido a `src/app` para separarlo de los plugins

### Fixed

* Solucionado error al excluir el TypeScript interno de la compilación

## [v1.2.0-beta.4](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.3...v1.2.0-beta.4) - 2024-09-20

### Added

* Se ha añadido en el plugin de Vite toda la configuración que se aplicaba en todos los proyectos de laravel.
  * base
  * build.minify
  * build.sourcemap
  * build.target
  * build.rollupOptions.output.manualChunks (split vendor)
  * css.devSourcemap

### Changed

* (refactor) Lógica para obtener el código de la aplicación mejorada.
* (refactor) Lógica para obtener el código de la aplicación extraída a la función `getAppCode()` + variables de entorno (EnvVariables) marcadas como opcionales (undefined).
* Sufijo paquete renombrado internamente de `...utilities` a `...utils` en la compilación del código. Los nuevos archivos generados son: `dist/laravel-ts-utils.es.js` y `plugins/vite-plugin-laravel-ts-utils.js`.
* Prefijo `vite-plugin-` añadido en el campo name de la función laravelTsUtilsPlugin.
* `development-tips.md` actualizado con nuevos comandos de NPM para administrar los tags.

### Fixed

* Solucionado error en el archivo `.gitignore`.

## [v1.2.0-beta.3](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.2...v1.2.0-beta.3) - 2024-09-19

### Added

* Nuevo plugin de Vite para manejar las dependencias externas (dependiendo de si están instaladas o no). 
  * Permite que las dependencias de los imports asincornos sean opcionales y no falle el build de la aplicación, haciendo que si la aplicación no tiene la dependencia instalada, se añada automáticamente al `build.rollupOptions.external` de la configuración de la aplicación.

### Changed

* Quitar `type Mode` y tipar como string en `export default ({ mode }: { mode: string }) => {`
* Mover configuración Vite (`vite.config.ts`) a una variable

## [v1.2.0-beta.2](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.1...v1.2.0-beta.2) - 2024-08-21

### Added

* Añadido nuevo comando git en `development-tips.md`

### Changed

* Eliminar bootstrap de las dependencias e importar dinámicamente en el helper `global.ts`
* Constantes ordenadas
* Imports bootstrap mejorados (según la documentación)

### Fixed

* Correcciones package.json

## [v1.2.0-beta.1](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.1.0-beta.2...v1.2.0-beta.1) - 2024-08-21

### Added

* Añadir imagen como título del README.md
* Nuevo archivo `development-tips.md` para guardar los comandos de desarrollo

### Changed

* Mover comandos de NPM del `README.md` al nuevo archivo `docs/development-tips.md`
* (breaking) Mejorar función catchCode para poder recibir `title`, `text` y `html`
* package.json: añadir `type`: `module` en el package.json
* CHANGELOG.md actualizado

## [v1.1.0-beta.2](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.1.0-beta.1...v1.1.0-beta.2) - 2024-08-12

### Added

* README.md: Añadidos nuevos comandos de npm
* Añadir CHANGELOG.md con todos los cambios de cada version (todos los tags renombrados por nuevos tags beta)
* package.json: enlaces a bugs y homepage de github

### Changed

* package-lock.json: dependencias actualizadas
* error al actualizar el paquete `sweetalert2` -> `customClass` ya no puede ser string

### Fixed

* package.json: enlace git arreglado

## [v1.1.0-beta.1](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.0.0-beta.4...v1.1.0-beta.1) - 2024-07-18

### Fixed

* Corregido error en el método `addClassEditableOnEditableCells`: ejecutar `editable` si es un método al filtrar las columnas y quitar comprobación `isEditableCell` al añadir la clase, ya que con lo anterior ya basta

### Removed

* (breaking) Eliminado método `addClassEditableOnReceivedEditableCells`, ya que con la corrección anterior ya no hace falta

## [v1.0.0-beta.4](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.0.0-beta.3...v1.0.0-beta.4) - 2024-07-05

### Changed

* Modificar helper pluck() para añadir la funcionalidad de Laravel

### Removed

* Quitar dependencia del paquete `kalel1500/laravel-hexagonal-and-ddd-architecture-utilities` del README.md

## [v1.0.0-beta.3](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.0.0-beta.2...v1.0.0-beta.3) - 2024-06-19

### Changed

* Dependencias actualizadas
* Modificar rutas `checkService` de websockets y queues de `ajax.shared...` a `hexagonal.ajax...` para utilizar las del paquete `laravel-hexagonal-and-ddd-architecture-utilities`
* Mover nombres rutas `checkService` de websockets y queues a constantes
* !Refactor: reestructuración carpetas proyecto para poder añadir en un futuro código para ejecutar en rutas del paquete `laravel-hexagonal-and-ddd-architecture-utilities`
* README.md actualizado para indicar la dependencia del paquete `laravel-hexagonal-and-ddd-architecture-utilities`

## [v1.0.0-beta.2](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.0.0-beta.1...v1.0.0-beta.2) - 2024-06-14

### Added

* Meter código inicial de la aplicación (imports, onerror, tooltips y notifications)
* Crear `UtilitiesServiceProvider` para poder configurar lo que se ejecuta desde la aplicación
* Añadir variables `VITE_MINIFY` y `VITE_SOURCEMAP` en el archivo `.env` para controlar la minificación y el sourcemap

### Changed

* Excluir carpeta `src/_internal` al compilar los tipos con dts para que no se exporte en las funciones internas

### Removed

* Quitar variable .env VITE_ENV

## v1.0.0-beta.1 - 2024-06-14

Primera versión funcional del paquete