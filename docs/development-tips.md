# Comandos para el desarrollo

## NPM

### Deprecar una version

* `npm deprecate laravel-ts-utilities@*** "Versión ..., no usar"`: deprecar una version publicada que no sirve

### Despublicar una version

* `npm unpublish laravel-ts-utilities@***"`: despublicar la version de un paquete
* `npm unpublish laravel-ts-utilities --force"`: despublicar todas las versiones de un paquete

### Subir una version (actualizar package.json + commit + tag)

* `npm version patch`
* `npm version minor`
* `npm version major`
* `npm version prerelease`: actualiza una version beta
* `npm version preminor --preid=beta`: actualiza la version minor de una beta

### Publicar una version en NPM (Subir el dist tal y como este en ese momento)

* `npm publish`
* `npm publish --tag beta`: publicar una version beta

### Otros comandos

* `npm view laravel-ts-utilities versions`: Verifica las versiones disponibles
* `npm dist-tag add laravel-ts-utilities@*** beta`: Etiqueta una versión específica con `beta`
* `npm dist-tag rm <tu-paquete> beta`: Eliminar o ajustar tags anteriores
* `npm dist-tag ls <tu-paquete>`: Verificar el dist-tag actual
* `npm dist-tag add laravel-ts-utilities@*** latest`: Etiqueta una versión específica con `latest`

## GIT

### Subir un tag

* `git push origin <tag_name>`