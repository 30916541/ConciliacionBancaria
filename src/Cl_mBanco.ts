import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mCategoria, { iCategoria } from "./Cl_mCategoria.js";
import Cl_mMovimiento, { iMovimiento } from "./Cl_mMovimiento.js";
import Cl_mAbono, { iAbono } from "./Cl_mAbono.js";
import Cl_mCargo, { iCargo } from "./Cl_mCargo.js";
interface iResultObject {
    objects: any[] | null;
    error: string | false;
}

export default class Cl_mBanco {
    private db: Cl_dcytDb;
    private movimientos: Cl_mMovimiento[] = [];
    private categorias: Cl_mCategoria[] = [];
    private saldoTotal: number = 0;
    readonly tbCategorias: string = "Categorias_Prueba.V1";
    readonly tbMovimientos: string = "Movimiento_Prueba.V1";

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

        if (this.categorias.find((n: Cl_mCategoria) => n.nombre === categoria.nombre))
            callback(`La categoria ${dtcategoria.nombre} ya existe.`);
        else if (!categoria.categoriaOK) callback(categoria.categoriaOK as string);
        else 
        this.db.addRecord({
            tabla: this.tbCategorias,
            registroAlias: dtcategoria.nombre,
            object: categoria,
            callback:(result: {id: number, objects: iCategoria[] | null, error: string | false} | null) => {
                if (!result) {
                    callback("Error del servidor: La respuesta es nula.");
                    return;
                }
                const {id, objects: categorias, error} = result;
                if(!error) this.llenarCategorias(categorias || []);
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

        if (!categoria.categoriaOK) callback(categoria.categoriaOK as boolean);
        else 
        this.db.editRecord({
            tabla: this.tbCategorias,
            object: categoria,
            callback:(result: {objects: iCategoria[] | null, error: string | false} | null) => {
                if (!result) {
                    callback("Error del servidor: La respuesta es nula.");
                    return;
                }
                const {objects: categorias, error} = result;
                if(!error) this.llenarCategorias(categorias || []);
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

        let indice = this.categorias.findIndex((n: Cl_mCategoria) => n.nombre === nombre);

        if(indice === -1) callback(`La categoria ${nombre} no existe.`);
        else {
            const categoria = this.categorias[indice];
            if (!categoria) {
                callback(`La categoria ${nombre} no existe.`);
                return;
            }

            let algunMovimiento = false;
            for (let movimiento of this.movimientos) {
                if (movimiento.categoria === nombre) {
                    algunMovimiento = true;
                    break;
                }
            }
            if (algunMovimiento) callback(`La categoria ${nombre} tiene movimientos asociados.`);
            else {
                this.db.deleteRecord({
                    tabla: this.tbCategorias,
                    object: categoria,
                    callback:({objects: categorias, error}: {objects: iCategoria[] | null, error: string | false}) => {
                        if(!error) this.llenarCategorias(categorias || []);
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
        let movimiento: Cl_mMovimiento;
        if (dtmovimiento.tipo === "Abono") {
            movimiento = new Cl_mAbono(dtmovimiento);
        } else if (dtmovimiento.tipo === "Cargo") {
            movimiento = new Cl_mCargo(dtmovimiento);
        } else {
            callback("Tipo de movimiento no válido.");
            return;
        }

        if (movimiento.movimientoOK !== true) callback(movimiento.movimientoOK as string);
        else {
            this.db.addRecord({
                tabla: this.tbMovimientos,
                registroAlias: dtmovimiento.referencia,
                object: movimiento,
                callback: ({ id, objects: movimientos, error }: {id: number, objects: iMovimiento[] | null, error: string | false}) => {
                    if (!error) this.llenarMovimientos(movimientos || []);
                    callback?.(error);
                },
            });
        }
    }

    editMovimiento({
        dtmovimiento,
        callback,
    }: {
        dtmovimiento: iMovimiento;
        callback: (error: string | boolean) => void;
    }): void {

        let movimiento: Cl_mMovimiento;
        if (dtmovimiento.tipo === "Abono") {
            movimiento = new Cl_mAbono(dtmovimiento);
        } else if (dtmovimiento.tipo === "Cargo") {
            movimiento = new Cl_mCargo(dtmovimiento);
        } else {
            movimiento = new Cl_mMovimiento(dtmovimiento);
        }

        if (!dtmovimiento.id) {
            callback("ID del movimiento no encontrado.");
            return;
        }

        if (movimiento.movimientoOK !== true) callback(movimiento.movimientoOK as string);
        else {
            const objToSend = {
                id: movimiento.id,
                fechaHora: movimiento.fechaHora,
                referencia: movimiento.referencia,
                categoria: movimiento.categoria,
                descripcion: movimiento.descripcion,
                monto: movimiento.monto,
                tipo: movimiento.tipo
            };
            console.log("Enviando a editRecord (limpio):", objToSend);
            this.db.editRecord({
                tabla: this.tbMovimientos,
                object: objToSend,
                callback: (result: {objects: iMovimiento[] | null, error: string | false} | null) => {
                    if (!result) {
                        console.error("Respuesta nula de editRecord");
                        callback("Error del servidor: La respuesta es nula.");
                        return;
                    }
                    const {objects: movimientos, error} = result;
                    if(!error) this.llenarMovimientos(movimientos || []);
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
        let indice = this.movimientos.findIndex((movimiento: Cl_mMovimiento) => movimiento.referencia === dtmovimiento.referencia);
        if(indice === -1) callback(`El movimiento ${dtmovimiento.referencia} no existe.`);
        else {
            const movimiento = this.movimientos[indice];
            if (!movimiento) {
                callback(`El movimiento ${dtmovimiento.referencia} no existe.`);
                return;
            }
            this.db.deleteRecord({
                tabla: this.tbMovimientos,
                object: movimiento,
                callback:({objects: movimientos, error}: {objects: iMovimiento[] | null, error: string | false}) => {
                    if(!error) this.llenarMovimientos(movimientos || []);
                    callback?.(error);
                },
            });
        }
    }

    procesarMovimientos(movimiento: Cl_mMovimiento){
        if(movimiento instanceof Cl_mAbono){
            this.saldoTotal += movimiento.montoOperacion();
        } else if(movimiento instanceof Cl_mCargo){
            this.saldoTotal += movimiento.montoOperacion(); // montoOperacion is negative for Cargo
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
                
                // Cargar categorías también
                this.db.listRecords({
                    tabla: this.tbCategorias,
                    callback: ({objects: categorias, error: errorCat}: iResultObject) => {
                        if(!errorCat) this.llenarCategorias(categorias || []);
                        callback(error || errorCat);
                    }
                });
            },
        });
    }

    llenarCategorias(categorias: iCategoria[]) {
        this.categorias = [];
        categorias.forEach((categoria: iCategoria) => {
            this.categorias.push(new Cl_mCategoria(categoria));
        });
    }

    llenarMovimientos(movimientos: iMovimiento[]) {
        this.movimientos = [];
        this.saldoTotal = 0;
        movimientos.forEach((movimiento: iMovimiento) => {
            let mov: Cl_mMovimiento;
            if (movimiento.tipo === "Abono") {
                mov = new Cl_mAbono(movimiento);
            } else if (movimiento.tipo === "Cargo") {
                mov = new Cl_mCargo(movimiento);
            } else {
                mov = new Cl_mMovimiento(movimiento);
            }
            this.movimientos.push(mov);
            this.procesarMovimientos(mov);
        });
    }

    listarMovimientos(): iMovimiento[] {
        return this.movimientos.map((movimiento) => movimiento.toJSON());
    }

    listarCategorias(): iCategoria[] {
        return this.categorias.map((categoria) => categoria.toJSON());
    }
}
    