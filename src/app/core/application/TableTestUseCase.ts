import { Ttable } from '../infrastructure';
import { CellEventCallback, Formatter, Options } from 'tabulator-tables';
import { TableSettingEvents } from '../_types';

export default class TableGroupTypesUseCase {
    private ttable?: Ttable;
    private readonly tableId: string = "#divTabulatorGlobalPages";
    private readonly formatters: { cellActions: Formatter };
    private readonly cellClicks: { actions: CellEventCallback };

    constructor() {
        this.formatters = {
            cellActions: (cell) => {
                return this.ttable!.defaultFormatterCellActions(cell);
            },
        };
        this.cellClicks = {
            actions: async (event, cell) => {
                const btnSave = (event?.target as HTMLElement).closest("[data-action=\"save\"]");
                const btnDelete = (event?.target as HTMLElement).closest("[data-action=\"delete\"]");
                const btnCancel = (event?.target as HTMLElement).closest("[data-action=\"cancel\"]");
                const data = cell.getData();
                if (btnSave) {
                    console.log('saved');
                }
                if (btnDelete) {
                    console.log('deleted');
                }
                if (btnCancel) {
                    console.log('cancelled');
                }
            },
        };
    }

    __invoke() {
        this.startTabulator().then();
    }

    private async startTabulator() {
        const options: Options = {
            ...Ttable.defaultSettings,
            data: [
                {id:1, order: 1, name:"Oli Bob",            code:"oliBob",      },
                {id:2, order: 2, name:"Mary May",           code:"maryMay",     },
                {id:3, order: 3, name:"Christine Lobowski", code:"christine",   },
                {id:4, order: 4, name:"Brendon Philips",    code:"brendon",     },
                {id:5, order: 5, name:"Margret Marmajuke",  code:"Margret",     },
            ],
            movableRows: true,
            rowFormatter: row => {
                this.ttable!.addClassEditableOnEditableCells(row);
            },
            columns: [
                {title: "",         rowHandle: true,    formatter: "handle",                        frozen: true,       width: 30, minWidth: 30                                                 },
                {title: "Orden",    field: "order",     formatter: undefined                                                                                                                    },
                {title: "Nombre",   field: "name",      formatter: undefined,                       editor: "input",    editable: cell => this.ttable!.isEditableCell(cell),     },
                {title: "Código",   field: "code",      formatter: undefined,                       editor: "input",    editable: cell => this.ttable!.isEditableCell(cell),     },
                {title: "Acciones",                     formatter: this.formatters.cellActions,     editor: undefined,  editable: false, cellClick: this.cellClicks.actions,                    },
            ],
        };
        const events: TableSettingEvents = {
            rowMoved: row => {
                this.ttable?.changeColorsOnRowMovedEvent(row).then();
            },
        };
        this.ttable = await Ttable.create('id', options, events, 'order');
    }
}
