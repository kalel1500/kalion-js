# Release Notes

## [Unreleased](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.2.0-beta.1...master)

## [v1.2.0-beta.1](https://github.com/kalel1500/laravel-ts-utilities/compare/v1.1.0-beta.2...v1.2.0-beta.1) - 2024-08-21

### Added

* Añadir imagen como título del README.md
* Nuevo archivo "development-tips.md" para guardar los comandos de desarrollo

### Changed

* Mover comandos de NPM del "README.md" al nuevo archivo "docs/development-tips.md"
* (breaking) Mejorar función catchCode para poder recibir "title", "text" y "html"
* package.json: añadir "type": "module" en el package.json
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