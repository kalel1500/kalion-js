#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ESM
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para crear directorios si no existen
const ensureDirectoryExistence = (filePath: string) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

// Función para crear un archivo con contenido (vacío por defecto)
const createFile = (filePath: string, contentPath = '') => {
    /*if (fs.existsSync(filePath)) {
        console.log(`El archivo ya existe: ${filePath}`);
        return;
    }*/
    const content = fs.readFileSync(contentPath, 'utf8');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Archivo creado: ${filePath}`);
};

let projectRoot = process.cwd(); // Ruta de la carpeta donde se crearán los archivos
const contentDirectory = path.join(__dirname, 'files'); // Ruta de la carpeta donde ubican los archivos de contenido

// Comprobar si `process.cwd()` está dentro de `node_modules` y ajustar si es necesario
if (projectRoot.includes('node_modules')) {
    projectRoot = path.resolve(projectRoot, '../../'); // Sube dos niveles para salir de node_modules
}

// Definir las rutas de los archivos que quieres crear
const filesToCreate = [
    { path: 'resources/js/app.ts',                                      filename: 'app.txt' },
    { path: 'resources/js/app/bootstrap.ts',                            filename: 'app/bootstrap.txt' },
    { path: 'resources/js/app/constants.ts',                            filename: 'app/constants.txt' },
    { path: 'resources/js/app/routes.ts',                               filename: 'app/routes.txt' },
    { path: 'resources/js/app/translations.ts',                         filename: 'app/translations.txt' },
    { path: 'resources/js/app/lang/es.json',                            filename: 'app/lang/es.txt' },
    { path: 'resources/js/app/lang/en.json',                            filename: 'app/lang/en.txt' },
    { path: 'resources/js/src/home/infrastructure/HomeController.ts',   filename: 'src/home/infrastructure/HomeController.txt' },
    { path: 'resources/js/src/shared/infrastructure/TestController.ts', filename: 'src/shared/infrastructure/TestController.txt' }
];

// Crear cada archivo
filesToCreate.forEach(file => {
    const filePath = path.join(projectRoot, file.path);
    const contentPath = path.join(contentDirectory, file.filename);
    ensureDirectoryExistence(filePath);
    createFile(filePath, contentPath);
});
