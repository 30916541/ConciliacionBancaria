import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mCategoria, { iCategoria } from "./Cl_mCategoria.js";
import Cl_mMovimiento, { iMovimiento } from "./Cl_mMovimiento.js";
import Cl_mAbono, { iAbono } from "./Cl_mAbono.js";
import Cl_mCargo, { iCargo } from "./Cl_mCargo.js";
interface iResultMovimiento {
    objects: [iMovimiento] | null;
    error: string | false;
}
interface iResultCategoria {
    objects: [iCategoria] | null;
    error: string | false;
}

export default class Cl_mBanco {
    private db: Cl_dcytDb;
    private movimientos: Cl_mMovimiento[] = [];
    private categorias: Cl_mCategoria[] = [];
    private saldoTotal: number = 0;
    readonly tbCategorias: string = "Categorias_Prueba.V1";
    readonly tbMovimientos: string = "Movimientos_Prueba.V1";

    constructor() {
        this.db = new Cl_dcytDb({aliasCuenta: "THEGITGUARDIANS"});
        this.movimientos = [];
        this.categorias = [];
        this.saldoTotal = 0;
    }

    addCategoria({
        dtcategoria,
        callback,
    }: {
        dtcategoria: iCategoria;
        callback: (error: string | false) => void;
    }): void {

        let categoria = new Cl_mCategoria(dtcategoria);

        if (this.categorias.find((n) => n.nombre === categoria.nombre))
            callback(`La categoria ${dtcategoria.nombre} ya existe.`);
        else if (!categoria.categoriaOK) callback(categoria.categoriaOK);
        else 
        this.db.addRecord({
            tabla: this.tbCategorias,
            registroAlias: dtcategoria.nombre,
            object: categoria,
            callback:({id, objects: categorias, error}) => {
                if(!error) this.llenarCategorias(categorias);
                callback?.(error);
            },
        });
    }

    editCategoria({
        dtcategoria,
        callback,
    }: {
        dtcategoria: iCategoria;
        callback: (error: string | boolean) => void;
    }): void {

        let categoria = new Cl_mCategoria(dtcategoria);

        if (!categoria.categoriaOK) callback(categoria.categoriaOK);
        else 
        this.db.editRecord({
            tabla: this.tbCategorias,
            object: categoria,
            callback:({objects: categorias, error}) => {
                if(!error) this.llenarCategorias(categorias);
                callback?.(error);
            },
        });
    }

    deleteCategoria({
        nombre,
        callback,
    }: {
        nombre: string;
        callback: (error: string | boolean) => void;
    }): void {

        let indice = this.categorias.findIndex((n) => n.nombre === nombre);

        if(indice === -1) callback(`La categoria ${nombre} no existe.`);
        else {
            let algunMovimeinto = false;
            for (let movimiento of this.movimientos) {
                if (movimiento.categoria === nombre) {
                    algunMovimeinto = true;
                    break;
                }
            }
            if (algunMovimeinto) callback(`La categoria ${nombre} tiene movimientos asociados.`);
            else {
                this.db.deleteRecord({
                    tabla: this.tbCategorias,
                    object: this.categorias[indice],
                    callback:({objects: categorias, error}) => {
                        if(!error) this.llenarCategorias(categorias);
                        callback?.(error);
                    },
                });
            }
        }
    }

    addMovimiento({
        dtmovimiento,
        callback,
    }: {
        dtmovimiento: iMovimiento;
        callback: (error: string | boolean) => void;
    }): void {
        
    }

    editMovimiento({
        dtmovimiento,
        callback,
    }: {
        dtmovimiento: iMovimiento;
        callback: (error: string | boolean) => void;
    }): void {

        let movimiento = new Cl_mMovimiento(dtmovimiento);

        if (!movimiento.movimientoOK) callback(movimiento.movimientoOK);
        else {
            this.db.editRecord({
                tabla: this.tbMovimientos,
                object: movimiento,
                callback:({objects: movimientos, error}) => {
                    if(!error) this.llenarMovimientos(movimientos);
                    callback?.(error);
                },
            });
        }
    }

    deleteMovimiento({
        dtmovimiento,
        callback,
    }: {
        dtmovimiento: iMovimiento;
        callback: (error: string | boolean) => void;
    }): void {
        let indice = this.movimientos.findIndex((movimiento) => movimiento.referencia === dtmovimiento.referencia);
        if(indice === -1) callback(`El movimiento ${dtmovimiento.referencia} no existe.`);
        else {
            this.db.deleteRecord({
                tabla: this.tbMovimientos,
                object: this.movimientos[indice],
                callback:({objects: movimientos, error}) => {
                    if(!error) this.llenarMovimientos(movimientos);
                    callback?.(error);
                },
            });
        }
    }

    procesarMovimientos(movimiento: Cl_mMovimiento){
        if(movimiento instanceof Cl_mAbono){
            this.saldoTotal += movimiento.montoOperacion();
        } else if(movimiento instanceof Cl_mCargo){
            this.saldoTotal -= movimiento.montoOperacion();
        }
    }

    SaldoActual(): number {
        return this.saldoTotal;
    }

    cargarBanco(callback: (error: string | false) => void): void {
        this.db.listRecords({
            tabla: this.tbMovimientos,
            callback: ({objects, error}: iResultObject) => {
                if(!error) this.llenarMovimientos(objects || []);
                callback(false);
            },
        });
    }

    llenarCategorias(categorias: iCategoria[]) {
        this.categorias = [];
        categorias.map((categoria: iCategoria) => {
            this.categorias.push(new Cl_mCategoria(categoria));
        });
    }

    llenarMovimientos(movimientos: iMovimiento[]) {
        this.movimientos = [];
        movimientos.map((movimiento: iMovimiento) => {
            this.movimientos.push(new Cl_mMovimiento(movimiento));
        });
    }

    listarMovimientos(): iMovimiento[] {
        return this.movimientos.map((movimientos) => movimientos.toJSON());
    }

    listarCategorias(): iCategoria[] {
        return this.categorias.map((categorias) => categorias.toJSON());
    }
}
    