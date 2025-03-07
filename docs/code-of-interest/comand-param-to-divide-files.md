# Pasar parámetro al comando "npx kalion-js param"

## Crear archivos según el parámetro recibido

`Ttable.ts - line 25`
```ts
const command = ((arg = '') => (arg.startsWith('-') ? undefined : arg))(process.argv[2]) || 'all';

let filesToCreate: string[];
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
filesToCreate = [...commonFiles, ...filesToCreate];
```