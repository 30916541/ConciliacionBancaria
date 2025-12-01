import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mCategoria, { iCategoria } from "./Cl_mCategoria.js";
import { categoriasData } from "./_data.js";
import Cl_mMovimiento, { iMovimiento } from "./Cl_mMovimiento.js";
interface iResultObject {
    objects: any[] | null;
    error: string | false;
}

export default class Cl_mBanco {
    private db: Cl_dcytDb;
    private movimientos: Cl_mMovimiento[] = [];
    private categorias: Cl_mCategoria[] = [];
    private saldoTotal: number = 0;
    readonly tbMovimientos: string = "Movimiento_Prueba.V1";

    constructor() {
        this.db = new Cl_dcytDb({aliasCuenta: "THEGITGUARDIANS"});
        this.movimientos = [];
        this.categorias = [];
        this.saldoTotal = 0;
    }



    addMovimiento({
        dtmovimiento,
        callback,
    }: {
        dtmovimiento: iMovimiento;
        callback: (error: string | boolean) => void;
    }): void {
        let movimiento = new Cl_mMovimiento(dtmovimiento);

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

        if (!dtmovimiento.id) {
            callback("ID del movimiento no encontrado.");
            return;
        }

        let movimiento = new Cl_mMovimiento(dtmovimiento);

        const validacion = movimiento.movimientoOK;
        if (validacion !== true) {
            callback(validacion as string);
            return;
        }

        this.db.editRecord({
            tabla: this.tbMovimientos,
            object: movimiento,
            callback: (result: {objects: iMovimiento[] | null, error: string | false} | null) => {
                if (!result) {
                    callback("Error del servidor: La respuesta es nula.");
                    return;
                }
                const {objects: movimientos, error} = result;
                if(!error) this.llenarMovimientos(movimientos || []);
                callback?.(error);
            },
        });
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
        this.saldoTotal += movimiento.montoOperacion();
    }

    SaldoActual(): number {
        return this.saldoTotal;
    }

    cargarBanco(callback: (error: string | false) => void): void {
        this.db.listRecords({
            tabla: this.tbMovimientos,
            callback: ({objects, error}: iResultObject) => {
                if(!error) this.llenarMovimientos(objects || []);
                
                this.llenarCategorias(categoriasData);
                callback(error);
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
            let mov = new Cl_mMovimiento(movimiento);
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
    