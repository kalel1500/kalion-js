# Imports dinámicos

## Ejemplo Tabulator

`Ttable.ts - line 25`
```ts
import("tabulator-tables").then(({ TabulatorFull: Tabulator }) => {
    this.table = new Tabulator(this.tableId, options);
    Object.entries(settingEvents).forEach(entry => {
        const key = entry[0] as keyof EventCallBackMethods;
        const value = entry[1];
        this.table?.on(key, value);
    });
}).catch(error => {
    console.error("Tabulator-tables no está instalado o no se pudo cargar.", error);
});
```