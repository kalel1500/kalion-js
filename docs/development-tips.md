# Comandos para el desarrollo

## NPM

### Deprecar una version

* `npm deprecate @kalel1500/kalion-js@*** "Versión ..., no usar"`: deprecar una version publicada que no sirve

### Despublicar una version

* `npm unpublish @kalel1500/kalion-js@***"`: despublicar la version de un paquete
* `npm unpublish @kalel1500/kalion-js --force"`: despublicar todas las versiones de un paquete

### Subir una version (actualizar package.json + commit + tag)

### Estructura: v0.<minor>.<patch>-beta.<build>

* `npm version patch`
* `npm version minor`
* `npm version major`
* `npm version preminor --preid=beta`: actualiza "minor"
* `npm version prepatch --preid=beta`: actualiza "patch"
* `npm version prerelease`: actualiza "build"

### Publicar una version en NPM (Subir el dist tal y como este en ese momento)

* `npm publish`
* `npm publish --tag beta`: publicar una version beta
* `npm publish --access public`: publicar un paquete con scope de forma publica

### Otros comandos

* `npm view @kalel1500/kalion-js versions`: Verifica las versiones disponibles
* `npm dist-tag add @kalel1500/kalion-js@*** beta`: Etiqueta una versión específica con `beta`
* `npm dist-tag rm <tu-paquete> beta`: Eliminar o ajustar tags anteriores
* `npm dist-tag ls <tu-paquete>`: Verificar el dist-tag actual
* `npm dist-tag add @kalel1500/kalion-js@*** latest`: Etiqueta una versión específica con `latest`

## GIT

### Subir un tag

* `git push origin <tag_name>`

## Otros paquetes de interes

Para facilitar la externalización de dependencias nos pueden interesar estos paquetes:

* `vite-plugin-externalize-dependencies` (simple)
* `vite-plugin-externals` (complex)
