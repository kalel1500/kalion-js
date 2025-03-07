# Release Notes

## [Unreleased](https://github.com/kalel1500/kalion-js/compare/v0.6.0-beta.0...master)

## [v0.6.0-beta.0](https://github.com/kalel1500/kalion-js/compare/v0.5.0-beta.1...v0.6.0-beta.0) - 2025-03-06

### Added

* Nueva funcionalidad del DarkTheme para obtener la configuración del sistema
  * (breaking) Renombrar la Cookie `dark_theme` a `theme` y convertir de `null` a `string`
  * Añadir nuevo botón `btnThemeSystem` para establecer el tema del dispositivo
  * Leer la propiedad `window.matchMedia('(prefers-color-scheme: dark)').matches` en la función `setTheme()` en la comprobación para añadir la clase `dark` al Html
  * Mover toda la lógica del DarkMode a la nueva clase `ThemeSwitcher` (para facilitar la implementación del estado inicial del DarkMode)
  * Nuevo método `init()` en la clase `ThemeSwitcher` para cargar inicialmente la clase `dark` desde el JS (por si no viene en PHP como por ejemplo cuando el `window.matchMedia('(prefers-color-scheme: dark)').matches === true`
  * Añadir `addEventListener` al `mediaQuery` para detectar cuando cambia tema del SO y actualizar el tema en la aplicación
  * Añadir `theme` al `localStorage` (por si se quiere usar en otro sitio)
* Añadir las configuraciones de Tailwind4 (`tailwind-config.css` y `tailwind.config.js`) y compilarlas en el `vite.config.ts` para poder extenderlas en cada proyecto
* Añadir la propiedad `cssMinify` en el plugin de vite (`src/plugins/vite/index.ts`)
* Añadir la propiedad `import` en los `exports` del `package.json` para asegurar que la importación funcione en `ESM`

### Changed

* Paquete de PHP renombrado a de `Hexagonal` a `Kalion`
  * Renombrado sufijo de la `cookiePreferencesName`, ya que se ha cambiado el nombre del paquete de PHP
  * Prefijo de las rutas `hexagonal` renombrado a `kalion`
* (breaking) (refactor) Renombrar shadows (añadir prefijo y la palabra black): 
  * `shadow-h-1xl` => `kal:shadow-xl`
  * `shadow-hb-1xl` => `kal:shadow-black-xl`
  * `shadow-h-2xl` => `kal:shadow-2xl`
  * `shadow-hb-2xl` => `kal:shadow-black-2xl`
* (breaking) (refactor) Renombrar breakpoint `vsm` a `xs` y usar `rem`
* Modificar el import del `flowbite/plugin` y la constante `const laravelPlugin` del archivo `src/plugins/tailwind/index.ts` para que sean compatibles con los `module y moduleResolution` del `tsconfig.json`
* Modificar el `module` y el `moduleResolution` del `tsconfig.json` para que se pueda importar la nueva version del `tailwindcss/plugin` sin errores
* Migrar Tailwindcss a la versiòn 4 y Flowbite a la versiòn 3
  * (stubs) Adaptar archivos de stubs a la version 4 de Tailwindcss

### Fixed

* (fix) (refactor) Mover código de los archivos `plugin.ts` a los `index.ts` para que siga funcionando desde la app la importación con `'moduleResolution': 'nodenext'` en el tsconfig.json

## [v0.5.0-beta.1](https://github.com/kalel1500/kalion-js/compare/v0.5.0-beta.0...v0.5.0-beta.1) - 2025-02-28

### Fixed

* (fix) Mover la variable `useBootstrap` dentro del método `Component.get()` ya que al estar fuera no se sobreescribía bien desde la aplicación

## [v0.5.0-beta.0](https://github.com/kalel1500/kalion-js/compare/v0.4.0-beta.10...v0.5.0-beta.0) - 2025-02-17

### Added

* DarkMode: Estilos `sweetalert` modo oscuro añadidos
* DarkMode: Estilos `slimselect` modo oscuro añadidos
* !!! Nueva funcionalidad de Componentes para renderizar Html y poder definir los componentes tanto para tailwind como para bootstrap y obtenerlos dinámicamente según la config
* Añadir la constante `VITE_APP_CODE`
* DarkMode: Nuevos estilos `Tabulator` para añadir el Dark de forma dinámica (se han unido los archivos originales del plugin `tabulator_bootstrap5.css` y `tabulator_site_dark.css`)
* Nuevo tipo genérico `ViewData<T>` con la estructura típica de respuesta
* Nueva configuración en el plugin de `tailwind` para extender el `boxShadow` y añadir sombras personalizadas
* Nuevo método `slugify()` en el helper `global.ts`

### Changed

* (refactor) stubs: ordenar imports `stubs/resources/js/app/bootstrap.ts` Adrián Moments ago
* Dependencias actualizadas
* (breaking) stubs: Actualizado `app.css`
* slimselect: Definir variables estilos y modificar los valores por defecto
* (refactor) slimselect: Importar los estilos del `slimselect` directamente del `node_modules` en vez de mantener el archivo `slimselect-original.css` manualmente
* Mover la importación de los estilos del `sweetalert` al `css` para que no se inyecten en el head del navegador
* tailwindcssPlugin: añadir el propio paquete en el array `laravelContent` del plugin de tailwind para compilar las clases del paquete
* !!! Cambiar todos los botones de tabulator con clases Bootstrap por los componentes dinámicos
* (breaking) Añadir el Tipo `undefined` a todas las variables de entorno (`EnvVariables`)
* Hacer `readonly` las constantes de Vite
* (breaking) Meter en el paquete la definición de las variables `import.meta.env` (movido de los `stubs` al `app/core/_types/index.ts`)
* (breaking) Constante VITE_APP_STORAGE_VERSION renombrada por VITE_TS_STORAGE_VERSION
* (refactor) Ordenar variables VITE
* README.md: arreglar comando instalación + añadir comando de inicio

### Fixed

* (fix) Excluir la carpeta vendor del `tsconfig.json` para prevenir errores al compilar en proyectos de Laravel
* (fix) Filtrar valores `undefined` del `newConfig` en el método `extend()` para mantener los valores por defecto cuando no se indican en la aplicación
* (fix) tailwindCompatibility: Añadir variable de configuración `VITE_TS_USE_BOOSTRAP_CLASSES` para obtener la `hiddenClass` dinámicamente con el nuevo helper `g.getHiddenClass()`
* (fix) Hacer que la propiedad `cookiePreferencesName` sea dinámica según la variable de entorno `VITE_APP_NAME`

## [v0.4.0-beta.10](https://github.com/kalel1500/kalion-js/compare/v0.4.0-beta.9...v0.4.0-beta.10) - 2025-01-28

### Changed

* Archivo `stubs/resources/images/favicon.ico` eliminado del CLI, ya que se ha movido al paquete `kalel1500/laravel-hexagonal-and-ddd-architecture-utilities`
* Dependencias actualizadas

## [v0.4.0-beta.9](https://github.com/kalel1500/kalion-js/compare/v0.4.0-beta.8...v0.4.0-beta.9) - 2025-01-24

### Changed

* development-tips.md: nuevo comando para actualizar la version `patch` de una beta + diccionario de cuál es cada una

### Fixed

* (fix) Imports `laravel-ts-utilities` cambiados por `@kalel1500/laravel-ts-utils` en los archivos de `src/cli/stubs`

## [v0.4.0-beta.8](https://github.com/kalel1500/kalion-js/compare/v0.4.0-beta.7...v0.4.0-beta.8) - 2025-01-16

### Changed

* Se han renombrado todas las versiones con el primer número a `0` y se ha renombrado el paquete a `@kalel1500/laravel-ts-utils` (para poder limpiar las versiones)
  * versiones renombradas en el `CHANGELOG.md` y en el `package.json`
  * proyecto renombrado en los archivos `package.json`, `README.md`, `CHANGELOG.md` y varios archivos más
  * nuevo comando para publicar paquetes con scope de forma pública en el `development-tips`

## [v0.4.0-beta.7](https://github.com/kalel1500/kalion-js/compare/v0.4.0-beta.6...v0.4.0-beta.7) - 2024-12-17

### Fixed

* (fix) Solucionar error en `DomService.startSidebarArrowsObserve()` cuando no existe el elemento `drawer-navigation` en el Html

## [v0.4.0-beta.6](https://github.com/kalel1500/kalion-js/compare/v0.4.0-beta.5...v0.4.0-beta.6) - 2024-12-16

### Added

* Compilar todos los estilos por separado para poder importarlos independientemente en las aplicaciones

### Changed

* Layout: añadir `startSidebarArrowsObserve()` en el `LayoutListenersUseCase` para añadir la funcionalidad de rotar las flechas de los dropdowns del sidebar
* Mutation: mejoras en la clase -> mover el comportamiento del constructor a la propiedad `Mutation.observeClass()` y crear un nuevo método `Mutation.observe()` más genérico
* Mover las dependencias de los tipos de `devDependencies` a `dependencies` para no tener que instalarlas específicamente en la aplicación

### Fixed

* (fix) stubs: corregir las rutas de los plugins del paquete, ya que se han movido de sitio

## [v0.4.0-beta.5](https://github.com/kalel1500/kalion-js/compare/v0.4.0-beta.4...v0.4.0-beta.5) - 2024-11-26

### Changed

* plugins: 
  * !!! Separar los plugins de `Vite` y de `Tailwind` en dos archivos diferentes para compilar uno en ESM (vite) y otro en CJS (tailwind) para prevenir el error `The CJS build of Vite's Node API is deprecated` durante la compilación
  * renombrar archivos de los plugins a `.../plugin.ts`

## [v0.4.0-beta.4](https://github.com/kalel1500/kalion-js/compare/v0.4.0-beta.3...v0.4.0-beta.4) - 2024-11-26

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

## [v0.4.0-beta.3](https://github.com/kalel1500/kalion-js/compare/v0.4.0-beta.2...v0.4.0-beta.3) - 2024-11-09

### Removed

* stubs: archivo `.env.local` eliminado (ya que ahora está en el paquete de composer `laravel-hexagonal-and-ddd-architecture-utilities`

## [v0.4.0-beta.2](https://github.com/kalel1500/kalion-js/compare/v0.4.0-beta.1...v0.4.0-beta.2) - 2024-11-05

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

## [v0.4.0-beta.1](https://github.com/kalel1500/kalion-js/compare/v0.3.0-beta.8...v0.4.0-beta.1) - 2024-10-31

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

## [v0.3.0-beta.8](https://github.com/kalel1500/kalion-js/compare/v0.3.0-beta.7...v0.3.0-beta.8) - 2024-09-26

### Added

* development-tips.md: añadida información sobre paquetes interesantes

### Fixed

* (fix) solucionado error en el `vite-plugin-laravel-ts-utils`, ya que las dependencias externas solo funcionaban con el `npm run build`.
  Al hacer el `npm run dev` Vite utiliza otros métodos para resolver las dependencias que no se habían contemplado

## [v0.3.0-beta.7](https://github.com/kalel1500/kalion-js/compare/v0.3.0-beta.6...v0.3.0-beta.7) - 2024-09-25

### Changed

* (refactor) stubs: modificar las comillas dobles (`"`) por comillas simples (`'`) + dejar espacios en los imports con llaves (`{ ... }`)
* stubs: Nuevos archivos para configurar `tailwindcss` y poder recibir parámetro en el comando de creación (`npx laravel-ts-utils`) para poder separar la creación entre `all`, `typescript`, `tailwind`.
* stubs: Ruta `scripts` renombrada `cli` y el `postinstall.js` a `index.js`.
* stubs: Eliminar script `postinstall` y añadir comando (`bin`) `laravel-ts-utils` en el archivo `package.json` para poder crear los archivos manualmente y no solo tras la instalación (como `npx tailwindcss`).

## [v0.3.0-beta.6](https://github.com/kalel1500/kalion-js/compare/v0.3.0-beta.5...v0.3.0-beta.6) - 2024-09-23

### Fixed

* (fix) postinstall: se creaban los archivos en el propio paquete. Ahora se sube dos niveles para salir de node_modules y crearlos en la aplicación que lo instala.

## [v0.3.0-beta.5](https://github.com/kalel1500/kalion-js/compare/v0.3.0-beta.4...v0.3.0-beta.5) - 2024-09-23

### Added

* Nuevo script (postinstall) para crear los archivos iniciales del front de la aplicación tras la instalación del paquete (`dist/scripts/postinstall.js`)

### Changed

* (refactor) Compilar todo el código dentro de la carpeta `dist` separándolo en dos carpetas `dist/app` y `dist/plugins`
* (refactor) Código fuente del front movido a `src/app` para separarlo de los plugins

### Fixed

* Solucionado error al excluir el TypeScript interno de la compilación

## [v0.3.0-beta.4](https://github.com/kalel1500/kalion-js/compare/v0.3.0-beta.3...v0.3.0-beta.4) - 2024-09-20

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

## [v0.3.0-beta.3](https://github.com/kalel1500/kalion-js/compare/v0.3.0-beta.2...v0.3.0-beta.3) - 2024-09-19

### Added

* Nuevo plugin de Vite para manejar las dependencias externas (dependiendo de si están instaladas o no). 
  * Permite que las dependencias de los imports asincornos sean opcionales y no falle el build de la aplicación, haciendo que si la aplicación no tiene la dependencia instalada, se añada automáticamente al `build.rollupOptions.external` de la configuración de la aplicación.

### Changed

* Quitar `type Mode` y tipar como string en `export default ({ mode }: { mode: string }) => {`
* Mover configuración Vite (`vite.config.ts`) a una variable

## [v0.3.0-beta.2](https://github.com/kalel1500/kalion-js/compare/v0.3.0-beta.1...v0.3.0-beta.2) - 2024-08-21

### Added

* Añadido nuevo comando git en `development-tips.md`

### Changed

* Eliminar bootstrap de las dependencias e importar dinámicamente en el helper `global.ts`
* Constantes ordenadas
* Imports bootstrap mejorados (según la documentación)

### Fixed

* Correcciones package.json

## [v0.3.0-beta.1](https://github.com/kalel1500/kalion-js/compare/v0.2.0-beta.2...v0.3.0-beta.1) - 2024-08-21

### Added

* Añadir imagen como título del README.md
* Nuevo archivo `development-tips.md` para guardar los comandos de desarrollo

### Changed

* Mover comandos de NPM del `README.md` al nuevo archivo `docs/development-tips.md`
* (breaking) Mejorar función catchCode para poder recibir `title`, `text` y `html`
* package.json: añadir `type`: `module` en el package.json
* CHANGELOG.md actualizado

## [v0.2.0-beta.2](https://github.com/kalel1500/kalion-js/compare/v0.2.0-beta.1...v0.2.0-beta.2) - 2024-08-12

### Added

* README.md: Añadidos nuevos comandos de npm
* Añadir CHANGELOG.md con todos los cambios de cada version (todos los tags renombrados por nuevos tags beta)
* package.json: enlaces a bugs y homepage de github

### Changed

* package-lock.json: dependencias actualizadas
* error al actualizar el paquete `sweetalert2` -> `customClass` ya no puede ser string

### Fixed

* package.json: enlace git arreglado

## [v0.2.0-beta.1](https://github.com/kalel1500/kalion-js/compare/v0.1.0-beta.4...v0.2.0-beta.1) - 2024-07-18

### Fixed

* Corregido error en el método `addClassEditableOnEditableCells`: ejecutar `editable` si es un método al filtrar las columnas y quitar comprobación `isEditableCell` al añadir la clase, ya que con lo anterior ya basta

### Removed

* (breaking) Eliminado método `addClassEditableOnReceivedEditableCells`, ya que con la corrección anterior ya no hace falta

## [v0.1.0-beta.4](https://github.com/kalel1500/kalion-js/compare/v0.1.0-beta.3...v0.1.0-beta.4) - 2024-07-05

### Changed

* Modificar helper pluck() para añadir la funcionalidad de Laravel

### Removed

* Quitar dependencia del paquete `kalel1500/laravel-hexagonal-and-ddd-architecture-utilities` del README.md

## [v0.1.0-beta.3](https://github.com/kalel1500/kalion-js/compare/v0.1.0-beta.2...v0.1.0-beta.3) - 2024-06-19

### Changed

* Dependencias actualizadas
* Modificar rutas `checkService` de websockets y queues de `ajax.shared...` a `hexagonal.ajax...` para utilizar las del paquete `laravel-hexagonal-and-ddd-architecture-utilities`
* Mover nombres rutas `checkService` de websockets y queues a constantes
* !Refactor: reestructuración carpetas proyecto para poder añadir en un futuro código para ejecutar en rutas del paquete `laravel-hexagonal-and-ddd-architecture-utilities`
* README.md actualizado para indicar la dependencia del paquete `laravel-hexagonal-and-ddd-architecture-utilities`

## [v0.1.0-beta.2](https://github.com/kalel1500/kalion-js/compare/v0.1.0-beta.1...v0.1.0-beta.2) - 2024-06-14

### Added

* Meter código inicial de la aplicación (imports, onerror, tooltips y notifications)
* Crear `UtilitiesServiceProvider` para poder configurar lo que se ejecuta desde la aplicación
* Añadir variables `VITE_MINIFY` y `VITE_SOURCEMAP` en el archivo `.env` para controlar la minificación y el sourcemap

### Changed

* Excluir carpeta `src/_internal` al compilar los tipos con dts para que no se exporte en las funciones internas

### Removed

* Quitar variable .env VITE_ENV

## v0.1.0-beta.1 - 2024-06-14

Primera versión funcional del paquete