# Release Notes

## [Unreleased](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.14...master)

## [v1.2.0-beta.14](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.13...v1.2.0-beta.14) - 2024-09-26

### Added

* development-tips.md: añadida información sobre paquetes interesantes

### Fixed

* (fix) solucionado error en el "vite-plugin-laravel-ts-utils", ya que las dependencias externas solo funcionaban con el "npm run build".
  Al hacer el "npm run dev" Vite utiliza otros métodos para resolver las dependencias que no se habían contemplado

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