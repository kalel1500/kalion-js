import {
    CellComponent,
    EventCallBackMethods,
    JSONRecord,
    LabelValue,
    ListEditorParams,
    Options,
    RowComponent,
    TabulatorFull as Tabulator,
} from "tabulator-tables";
import {g} from "../helpers";
import {SModal} from "../modals";
import {FetchParamsSimple, NullHTMLButtonElement, TableSettingEvents, ValidationRules} from "../_types";

export class Ttable {
    readonly tableId: string | HTMLElement;
    table: Tabulator;
    isEditable = false;
    readonly orderFieldName: string;

    constructor(tableId: string | HTMLElement, options: Options, settingEvents: TableSettingEvents, orderFieldName?: string) {
        this.tableId = tableId;
        this.orderFieldName = orderFieldName ?? "order";

        this.table = new Tabulator(this.tableId, options);
        Object.entries(settingEvents).forEach(entry => {
            const key = entry[0] as keyof EventCallBackMethods;
            const value = entry[1];
            this.table.on(key, value);
        });
    }

    isEditableCell(cell: CellComponent) {
        return (cell.getRow().getData().id === undefined) ? true : this.isEditable;
    }

    addClassEditableOnEditableCells(row: RowComponent) {
        const cells = row.getCells().filter((cell => {
            return cell.getColumn().getDefinition().editable !== false;
        }));
        cells.forEach(cell => {
            if (this.isEditableCell(cell)) {
                cell.getElement().classList.add("cell-editable");
            }
        });
    }

    addClassEditableOnReceivedEditableCells(row: RowComponent, isEditableCell: (e: CellComponent) => boolean) {
        const cells = row.getCells().filter((cell => {
            return cell.getColumn().getDefinition().editable !== false;
        }));
        cells.forEach(cell => {
            if (isEditableCell(cell)) {
                cell.getElement().classList.add("cell-editable");
            }
        });
    }

    static formatListValuesToLabelValueStructure(values: JSONRecord): LabelValue[] {
        const dataArray: LabelValue[] = [];
        Object.entries(values).forEach(([key, value]) => {
            if (key === "null" || key === "undefined" || key === "") return;
            const intKey = parseInt(String(key));
            dataArray.push({
                "label": String(value),
                "value": (isNaN(intKey)) ? key : intKey,
            });
        });
        return dataArray;
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * ----- VARIABLES Y FUNCIONES GENERICAS Y COFNIGURACIONES PREDETERMINADAS------------------------------------------
     */

    static defaultSettings: Options = {
        columnDefaults: {
            headerSort: false,
            headerTooltip: true,
            headerSortTristate: true, // permitir quitar ordenacion
        },
        ajaxConfig: {
            headers: {
                "Accept": "application/json", //tell the server we need JSON back
                "X-Requested-With": "XMLHttpRequest", //fix to help some frameworks respond correctly to request
                "Content-type": "application/json; charset=utf-8", //set the character encoding of the request
            },
        },
        layout: "fitData",
        locale: "es-es",
        height: "65vh",
        filterMode: "local",
        sortMode: "local",
        columnHeaderSortMulti: true, // ordenacion multiple
        sortOrderReverse: true, // ordenacion en el orden en que se pulsan las columnas
        pagination: true,
        paginationMode: "local",
        paginationSize: 30,
        paginationCounter: (pageSize, currentRow, currentPage, totalRows, totalPages) => {
            const finalCurrentRow = currentRow + (pageSize - 1);
            return `Mostrando ${currentRow} - ${finalCurrentRow} filas de ${totalRows}`;
        },
        ajaxResponse: (url, params, response) => {
            /*let data = response.data;
            let regVisibles = (data.per_page < data.total) ? data.per_page : data.total;
            let el = document.getElementById("footerinfo");
            if (el) {
                el.innerHTML = `Mostrando ${regVisibles} de ${data.total}`;
            }*/
            return response.data; //return data to tabulator
        },
        footerElement: `<span class="mx-1" id="footerinfo"></span>`,
        langs: {
            "es-es": {
                "columns": {
                    "name": "Nombre", //replace the title of column name with the value "Name"
                },
                "data": {
                    "loading": "Cargando", //data loader text
                    "error": "Error", //data error text
                },
                "groups": { //copy for the auto generated item count in group header
                    "item": "elemento", //the singular  for item
                    "items": "elementos", //the plural for items
                },
                "pagination": {
                    "page_size": "Tamaño de página", //label for the page size select element
                    "page_title": "Mostrar página",//tooltip text for the numeric page button, appears in front of the page number (eg. "Show Page" will result in a tool tip of "Show Page 1" on the page 1 button)
                    "first": "Primera", //text for the first page button
                    "first_title": "Primera página", //tooltip text for the first page button
                    "last": "Última",
                    "last_title": "Última página",
                    "prev": "Anterior",
                    "prev_title": "Anterior página",
                    "next": "Siguiente",
                    "next_title": "Siguiente página",
                    "all": "Todo",
                    "counter": {
                        "showing": "Mostrando",
                        "of": "de",
                        "rows": "filas",
                        "pages": "páginas",
                    },
                },
                "headerFilters": {
                    "default": "filtrar columna...", //default header filter placeholder text
                    "columns": {
                        "name": "filtrar nombre...", //replace default header filter text for column name
                    },
                },
            },
        },
    };

    static buttons = {
        linkBtnInfo: (title: string, url: string, blank: boolean) => {
            return `<a href="${url}" title="${title}" ${blank ? "target=\"_blank\"" : ""} ><button class="mx-1 btn btn-xs btn-info"><i class="fa fa-info-circle"></i></button></a>`;
        },
        linkBtnEdit: (title: string, url: string) => {
            return `<a href="${url}" title="${title}"><button class="mx-1 btn btn-xs btn-warning"><i class="far fa-edit"></i></button></a>`;
        },
        linkTextEdit: (title: string, url: string) => {
            return `<a href="${url}" title="${title}"><i class="far fa-edit"></i></a>`;
        },
        btnInfo: (title: string) => {
            return `<button class="mx-1 btn btn-xs btn-info" data-action="info" title="${title}"><i class="fa fa-info-circle"></i></button>`;
        },
        btnSave: (title: string, showText = false) => {
            let text = showText ? title : "";
            return `<button class="mx-1 btn btn-xs btn-success" data-action="save" title="${title}"><i class="far fa-save"></i> ${text}</button>`;
        },
        btnCancel: (title: string, showText = false) => {
            let text = showText ? title : "";
            return `<button class="mx-1 btn btn-xs btn-danger" data-action="cancel" title="${title}"><i class="fa fa-ban" aria-hidden="true"></i> ${text}</button>`;
        },
        btnDelete: (title: string, showText = false) => {
            let text = showText ? title : "";
            return `<button class="mx-1 btn btn-xs btn-danger" data-action="delete" title="${title}"><i class="fa fa-times"></i> ${text}</button>`;
        },
        btnNew: (title: string, id?: string) => {
            const htmlId = (id === undefined) ? "" : `id="${id}"`;
            return `<button ${htmlId} class="mx-1 btn btn-xs btn-primary" data-action="new" title="${title}"><i class="fas fa-plus-square"></i></button>`;
        },
        btnReload: (title: string) => {
            // return  `<a href="${url}" title="${title}"><button class="mx-1 btn btn-xs btn-info"><i class="fas fa-sync-alt"></i></button></a>`;
            return `<button class="mx-1 btn btn-xs btn-info" data-action="reload" title="${title}"><i class="fa fa-sync-alt"></i></button>`;
        },
        btnMove: (title: string) => {
            return `<button class="mx-1 btn btn-xs btn-secondary" data-action="move" title="${title}"><i class="fas fa-suitcase-rolling"></i></button>`;
        },
    };

    /*-----formatterParams-----------------------------------------------------------------------------------------------*/

    static formatterParams_lookupBoolean = {undefined: "", null: "", 0: "No", 1: "Si"};

    static formatterParams_lookupSimple(values: JSONRecord): JSONRecord {
        const copy = Object.assign({}, values);
        copy["undefined"] = "";
        copy["null"] = "";
        return copy;
    }

    /*-----editorParams-----------------------------------------------------------------------------------------------*/

    static defaultListEditorParams: ListEditorParams = {
        //Value Options (You should use ONE of these per editor)
        // values: {1: "TEST AS21 PRO", 25: "TEST MCA"}, //an array of values or value/label objects
        // valuesURL: "http://myvalues.com", //a url to load the values from
        // valuesLookup:"active", //get the values from the currently active rows in this column

        clearable: true,

        verticalNavigation: "hybrid", //navigate to new row when at the top or bottom of the selection list
        maxWidth: true, //prevent width of list item from exceeding width of cell
        placeholderLoading: "Loading list...", // set custom placeholder when loading list values
        placeholderEmpty: "No Results Found", // set custom placeholder when list is empty

        //Select Options (only available when autocomplete:false)
        // multiselect: true, //allow selection of multiple items from the list

        //Autocomplete Options (only available when autocomplete:true)
        autocomplete: true, //enable autocomplete mode,
        // filterRemote: true, //pass filter term to remote server in request instead of filtering
        // filterDelay: 500, //delay in milliseconds after typing before filter begins
        listOnEmpty: true,
        // freetext:true, //allow the user to set the value of the cell to a free text entry
    };

    static editorParams_listBoolean: ListEditorParams = {
        ...Ttable.defaultListEditorParams,
        clearable: false,
        autocomplete: false,
        listOnEmpty: undefined,
        allowEmpty: false,
        values: [{label: "No", value: 0}, {label: "Si", value: 1}],
    };

    static editorParams_list(values: JSONRecord, {searchable} = {searchable: true}): ListEditorParams {
        return {
            ...Ttable.defaultListEditorParams,
            autocomplete: searchable,
            listOnEmpty: (!searchable) ? undefined : true,
            allowEmpty: false,
            values: Ttable.formatListValuesToLabelValueStructure(values),
        };
    }

    static editorParams_listFix(values: JSONRecord): ListEditorParams {
        return {
            ...Ttable.defaultListEditorParams,
            clearable: false,
            autocomplete: false,
            listOnEmpty: undefined,
            allowEmpty: false,
            values: Ttable.formatListValuesToLabelValueStructure(values),
        };
    }

    static editorParams_listBig(values: JSONRecord): ListEditorParams {
        return {
            ...Ttable.defaultListEditorParams,
            listOnEmpty: false,
            allowEmpty: true,
            filterFunc: (term, label, value, item) => { //replace built in filter function with custom
                /*term - the string being searched for
                label - the text lable for the item
                value - the value for the item
                item - the original value object for the item
                const res = label.includes(`/.*${term}.*!/`)*/
                if (term.length < 3) return false;
                return String(label).toLowerCase().indexOf(String(term).toLowerCase()) > -1;
            },
            values: Ttable.formatListValuesToLabelValueStructure(values),
        };
    }

    /*-----headerFilterParams-----------------------------------------------------------------------------------------*/

    static headerFilterParams_listBoolean = {values: {0: "No", 1: "Si"}};

    static headerFilterParams_listSimple(values: JSONRecord | any[]): ListEditorParams {
        return {values: values};
    }

    static headerFilterParams_listBig(values: JSONRecord): ListEditorParams {
        return {
            ...Ttable.defaultListEditorParams,
            listOnEmpty: false,
            allowEmpty: true,
            values: values,
        };
    }


    /**
     * -----------------------------------------------------------------------------------------------------------------
     * ----- OTRAS FUNCIONES -------------------------------------------------------------------------------------------
     */

    defaultListenerBtnEdit(btnEdit: NullHTMLButtonElement, btnCancelEdit: NullHTMLButtonElement) {
        btnEdit?.classList.add("d-none");
        btnCancelEdit?.classList.remove("d-none");
        this.isEditable = true;
        this.table.redraw(true);
    }

    defaultListenerBtnCancel(btnEdit: NullHTMLButtonElement, btnCancelEdit: NullHTMLButtonElement) {
        btnCancelEdit?.classList.add("d-none");
        btnEdit?.classList.remove("d-none");
        this.isEditable = false;
        this.table.replaceData().then();
        // this.table.redraw(true);
    }

    defaultListenerBtnAddRow(data = {}) {
        this.table.addRow(data, true).then();
    }

    async saveDataOnRowMovedEvent(row: RowComponent, {url, type}: FetchParamsSimple) {
        try {
            //row - row component
            let newData = row.getTable().getData();
            newData = newData.map((item, key) => {
                item[this.orderFieldName] = key + 1;
                return item;
            });
            const result = await g.newFetch({url: url, type: type, ajaxParams: {rowsTabulator: newData}});
            SModal.toastInfo({icon: (result.success) ? "success" : "error", title: result.message}).then();
            this.table.replaceData().then();
        } catch (e) {
            g.catchCode({error: e});
        }
    }

    // TODO canals - ¿hacer estatica?
    changeColorsOnRowMovedEvent(row: RowComponent): Promise<{ isEdited: boolean }> {
        const position = row.getPosition();
        const data = row.getTable().getData() as Record<any, any>[];
        if (!position) Promise.reject("No se ha encontrado la posicion").then();

        // Recorrer todas las filas para valorar su color en ese momento
        let isEdited = false;
        const rows = row.getTable().getRows();
        rows.forEach(row => {
            const currentRowPosition = row.getPosition();
            if (!currentRowPosition) return;

            // Si la fila actual es la movida y su posicion es diferente a la guardada -> pintar fondo fila
            if (position === currentRowPosition && position !== data[position - 1][this.orderFieldName]) {
                row.getElement().classList.add("last-row-moved");
            } else {
                row.getElement().classList.remove("last-row-moved");
            }

            // Si la posicion de la fila actual es diferente a la guardada -> pintar fondo celda
            const cell = row.getCells()[1];
            if (currentRowPosition !== data[currentRowPosition - 1][this.orderFieldName]) {
                cell.getElement().classList.add("cell-position-changed");
                isEdited = true;
            } else {
                cell.getElement().classList.remove("cell-position-changed");
            }
        });

        return Promise.resolve({isEdited});
    }

    async saveOrderOfAllData({url, type}: FetchParamsSimple) {
        const arrayTabulator = this.table.getData();
        arrayTabulator.map((item, index) => {
            item[this.orderFieldName] = index + 1;
            return item;
        });

        try {
            // Ajax to launch Status/Mitigation
            const actionResult = await g.newFetch({url, type, ajaxParams: {rowsTabulator: arrayTabulator}});

            // Check if result is wrong and update modal content
            if (!actionResult.success) {
                SModal.errorModal({html: actionResult.message}).then();
                return;
            }

            SModal.toastSuccess({title: actionResult.message}).then();
            this.table.replaceData().then();
        } catch (err) {
            g.catchCode({error: err});
        }
    }

    static async defaultActionSave(cell: CellComponent, url: string, rules: ValidationRules, preventReplaceData = false): Promise<boolean> {
        const cellData = cell.getData();
        const type = (cellData.id) ? "PUT" : "POST";

        let validation = g.validate(cellData, rules);
        if (!validation.success) {
            SModal.errorModal({html: validation.messages.join("<br>")}).then();
            return false;
        }

        try {
            const result = await g.newFetch({url: url, type: type, ajaxParams: validation.validated});
            if (result.success) {
                SModal.toastSuccess({title: result.message}).then();
                if (!preventReplaceData) cell.getTable().replaceData().then();
            } else {
                SModal.errorModal({html: result.message}).then();
            }
            return result.success;
        } catch (e) {
            g.catchCode({error: e});
            return false;
        }
    }

    static async defaultActionDelete(cell: CellComponent, url: string, {
        title = "Eliminar",
        html = undefined,
        preventReplaceData = false,
    }: { title?: string, html?: string, preventReplaceData?: boolean }): Promise<boolean> {
        try {
            const resultModal = await SModal.confirmModal({title: title, html: html});
            if (!resultModal.isConfirmed) {
                return false;
            }

            let result: boolean;
            try {
                const resultDelete = await g.newFetch({url: url, type: "DELETE"});
                if (resultDelete.success) {
                    SModal.toastSuccess({title: resultDelete.message}).then();
                } else {
                    SModal.errorModal({html: resultDelete.message}).then();
                }
                result = resultDelete.success;
            } catch (e) {
                g.catchCode({error: e});
                result = false;
            }
            if (!preventReplaceData) cell.getTable().replaceData().then();
            return result;
        } catch (e) {
            g.catchCode({error: e});
            return false;
        }
    }

    static defaultActionCancel(cell: CellComponent) {
        cell.getRow().delete().then();
    }

    defaultFormatterCellActions(cell: CellComponent) {
        let strBtns = "";
        if (cell.getData().id === undefined) {
            strBtns += Ttable.buttons.btnSave("Guardar");
            strBtns += Ttable.buttons.btnCancel("Cancelar");
            return strBtns;
        }

        if (this.isEditable) {
            strBtns += Ttable.buttons.btnSave("Guardar");
            strBtns += Ttable.buttons.btnDelete("Eliminar");
        }
        return strBtns;
    }

    static customFormatterLookup(cell: CellComponent, formatterParams: Record<any, any>): string {
        return formatterParams[cell.getValue()];
    }

    static getObjectWithThisValue(__this: any): {} {
        return {_this: __this};
    }
}
