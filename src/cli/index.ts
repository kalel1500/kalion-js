#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Función para crear directorios si no existen
const ensureDirectoryExistence = (filePath: string) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, {recursive: true});
    }
};

// Función para eliminar archivos con otras extensiones si existen
const removeFileWithOtherExtensions = (filePath: string, extensionsToRemove: string[]) => {
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));
    extensionsToRemove.forEach(extension => {
        const fileToDelete = path.join(dir, `${baseName}${extension}`);
        if (fs.existsSync(fileToDelete)) {
            fs.unlinkSync(fileToDelete);
            console.log(`Archivo eliminado: ${fileToDelete}`);
        }
    });
};

// Función para crear un archivo con contenido (vacío por defecto)
const createFile = (filePath: string, contentPath = '') => {
    // Código por si queremos que no sobreescriba el archivo si existe
    /*if (fs.existsSync(filePath)) {
        console.log(`El archivo ya existe: ${filePath}`);
        return;
    }*/

    // Borrar el archivo si ya existe con otra extension
    const extensionsToRemove = ['.js', '.jsx', '.ts', '.tsx'];
    removeFileWithOtherExtensions(filePath, extensionsToRemove.filter(ext => ext !== path.extname(filePath)));

    // Detecta si es un archivo binario
    const isBinary = path.extname(filePath) === '.ico';

    // Leer y escribir archivo, especificando 'utf8' para texto y `null` para binarios
    const content = fs.readFileSync(contentPath, isBinary ? null : 'utf8');
    fs.writeFileSync(filePath, content, isBinary ? null : 'utf8');
    console.log(`Archivo creado: ${filePath}`);
};

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDirectory = path.join(__dirname, 'stubs'); // Ruta de la carpeta donde se ubican los archivos de contenido
let projectRoot = process.cwd(); // Ruta de la carpeta donde se crearán los archivos

// Comprobar si `process.cwd()` está dentro de `node_modules` y ajustar si es necesario
if (projectRoot.includes('node_modules')) {
    projectRoot = path.resolve(projectRoot, '../../'); // Sube dos niveles para salir de node_modules
}

// Definir las rutas de los archivos que quieres crear
const filesToCreate = [
    'resources/css/app.css',
    'resources/js/app.ts',
    'resources/js/app/bootstrap.ts',
    'resources/js/app/constants.ts',
    'resources/js/app/routes.ts',
    'resources/js/app/translations.ts',
    'resources/js/app/lang/es.json',
    'resources/js/app/lang/en.json',
    'resources/js/src/shared/application/HomeUseCase.ts',
    'resources/js/src/shared/infrastructure/DefaultController.ts',
    '.prettierrc',
    'tsconfig.json',
    'vite.config.ts',
];

// Definir las rutas de los archivos a eliminar
const filesToRemove = [
    'resources/js/bootstrap.js',
];

// Eliminar archivos antiguos
filesToRemove.forEach(file => {
    const filePath = path.join(projectRoot, file);
    removeFileWithOtherExtensions(filePath, ['.js', '.jsx', '.ts', '.tsx']);
});

// Crear cada archivo
filesToCreate.forEach(file => {
    const filePath = path.join(projectRoot, file);
    const contentPath = path.join(contentDirectory, file);
    ensureDirectoryExistence(filePath);
    createFile(filePath, contentPath);
});
