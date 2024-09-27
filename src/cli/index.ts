#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

type FileEntry = {
    path: string;
    filename: string;
};

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

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDirectory = path.join(__dirname, 'files'); // Ruta de la carpeta donde ubican los archivos de contenido
let projectRoot = process.cwd(); // Ruta de la carpeta donde se crearán los archivos

// Comprobar si `process.cwd()` está dentro de `node_modules` y ajustar si es necesario
if (projectRoot.includes('node_modules')) {
    projectRoot = path.resolve(projectRoot, '../../'); // Sube dos niveles para salir de node_modules
}

// Definir las rutas de los archivos que quieres crear
const typeScriptFiles: FileEntry[] = [
    { path: 'resources/js/app.ts',                                          filename: 'resources/js/app.txt'                                        },
    { path: 'resources/js/app/bootstrap.ts',                                filename: 'resources/js/app/bootstrap.txt'                              },
    { path: 'resources/js/app/constants.ts',                                filename: 'resources/js/app/constants.txt'                              },
    { path: 'resources/js/app/routes.ts',                                   filename: 'resources/js/app/routes.txt'                                 },
    { path: 'resources/js/app/translations.ts',                             filename: 'resources/js/app/translations.txt'                           },
    { path: 'resources/js/app/lang/es.json',                                filename: 'resources/js/app/lang/es.txt'                                },
    { path: 'resources/js/app/lang/en.json',                                filename: 'resources/js/app/lang/en.txt'                                },
    { path: 'resources/js/src/home/infrastructure/HomeController.ts',       filename: 'resources/js/src/home/infrastructure/HomeController.txt'     },
    { path: 'resources/js/src/shared/infrastructure/TestController.ts',     filename: 'resources/js/src/shared/infrastructure/TestController.txt'   },
    { path: 'resources/js/src/shared/infrastructure/SharedController.ts',   filename: 'resources/js/src/shared/infrastructure/SharedController.txt' },
];

// Definir las rutas de los archivos que quieres crear
const tailwindFiles: FileEntry[] = [
    { path: 'resources/css/app.css',    filename: 'resources/css/app.txt'   },
    { path: 'postcss.config.js',        filename: 'postcss.config.txt'      },
    { path: 'tailwind.config.js',       filename: 'tailwind.config.txt'     },
];

const command = ((arg = '') => (arg.startsWith('-') ? undefined : arg))(process.argv[2]) || 'all';

let filesToCreate: FileEntry[];
switch (command) {
    case 'all':
        filesToCreate = [...typeScriptFiles, ...tailwindFiles];
        break;
    case 'typescript':
        filesToCreate = typeScriptFiles;
        break;
    case 'tailwind':
        filesToCreate = tailwindFiles;
        break;
    default:
        filesToCreate = [];
        break;
}

// Crear cada archivo
filesToCreate.forEach(file => {
    const filePath = path.join(projectRoot, file.path);
    const contentPath = path.join(contentDirectory, file.filename);
    ensureDirectoryExistence(filePath);
    createFile(filePath, contentPath);
});
