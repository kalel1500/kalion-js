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

## GIT

### Subir un tag

* `git push origin <tag_name>`