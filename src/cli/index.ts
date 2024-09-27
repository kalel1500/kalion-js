#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

type FileEntry = {
    filePath: string;
    contentPath: string;
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
const contentDirectory = path.join(__dirname, 'stubs'); // Ruta de la carpeta donde ubican los archivos de contenido
let projectRoot = process.cwd(); // Ruta de la carpeta donde se crearán los archivos

// Comprobar si `process.cwd()` está dentro de `node_modules` y ajustar si es necesario
if (projectRoot.includes('node_modules')) {
    projectRoot = path.resolve(projectRoot, '../../'); // Sube dos niveles para salir de node_modules
}

// Definir las rutas de los archivos que quieres crear
const typeScriptFiles: FileEntry[] = [
    { filePath: 'resources/js/app.ts',                                          contentPath: 'resources/js/app.txt'                                        },
    { filePath: 'resources/js/app/bootstrap.ts',                                contentPath: 'resources/js/app/bootstrap.txt'                              },
    { filePath: 'resources/js/app/constants.ts',                                contentPath: 'resources/js/app/constants.txt'                              },
    { filePath: 'resources/js/app/routes.ts',                                   contentPath: 'resources/js/app/routes.txt'                                 },
    { filePath: 'resources/js/app/translations.ts',                             contentPath: 'resources/js/app/translations.txt'                           },
    { filePath: 'resources/js/app/lang/es.json',                                contentPath: 'resources/js/app/lang/es.txt'                                },
    { filePath: 'resources/js/app/lang/en.json',                                contentPath: 'resources/js/app/lang/en.txt'                                },
    { filePath: 'resources/js/src/home/infrastructure/HomeController.ts',       contentPath: 'resources/js/src/home/infrastructure/HomeController.txt'     },
    { filePath: 'resources/js/src/shared/infrastructure/TestController.ts',     contentPath: 'resources/js/src/shared/infrastructure/TestController.txt'   },
    { filePath: 'resources/js/src/shared/infrastructure/SharedController.ts',   contentPath: 'resources/js/src/shared/infrastructure/SharedController.txt' },
];

// Definir las rutas de los archivos que quieres crear
const tailwindFiles: FileEntry[] = [
    { filePath: 'resources/css/app.css',    contentPath: 'resources/css/app.txt'   },
    { filePath: 'postcss.config.js',        contentPath: 'postcss.config.txt'      },
    { filePath: 'tailwind.config.js',       contentPath: 'tailwind.config.txt'     },
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
    const filePath = path.join(projectRoot, file.filePath);
    const contentPath = path.join(contentDirectory, file.contentPath);
    ensureDirectoryExistence(filePath);
    createFile(filePath, contentPath);
});
