import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mCategoria from "./Cl_mCategoria.js";
import { categoriasData } from "./_data.js";
import Cl_mMovimiento from "./Cl_mMovimiento.js";
export default class Cl_mBanco {
    db;
    movimientos = [];
    categorias = [];
    saldoTotal = 0;
    tbMovimientos = "Movimiento_Prueba.V1";
    constructor() {
        this.db = new Cl_dcytDb({ aliasCuenta: "THEGITGUARDIANS" });
        this.movimientos = [];
        this.categorias = [];
        this.saldoTotal = 0;
    }
    addMovimiento({ dtmovimiento, callback, }) {
        let movimiento = new Cl_mMovimiento(dtmovimiento);
        if (movimiento.movimientoOK !== true)
            callback(movimiento.movimientoOK);
        else {
            this.db.addRecord({
                tabla: this.tbMovimientos,
                registroAlias: dtmovimiento.referencia,
                object: movimiento,
                callback: ({ id, objects: movimientos, error }) => {
                    if (!error)
                        this.llenarMovimientos(movimientos || []);
                    callback?.(error);
                },
            });
        }
    }
    editMovimiento({ dtmovimiento, callback, }) {
        if (!dtmovimiento.id) {
            callback("ID del movimiento no encontrado.");
            return;
        }
        let movimiento = new Cl_mMovimiento(dtmovimiento);
        const validacion = movimiento.movimientoOK;
        if (validacion !== true) {
            callback(validacion);
            return;
        }
        this.db.editRecord({
            tabla: this.tbMovimientos,
            object: movimiento,
            callback: (result) => {
                if (!result) {
                    callback("Error del servidor: La respuesta es nula.");
                    return;
                }
                const { objects: movimientos, error } = result;
                if (!error)
                    this.llenarMovimientos(movimientos || []);
                callback?.(error);
            },
        });
    }
    deleteMovimiento({ dtmovimiento, callback, }) {
        let indice = this.movimientos.findIndex((movimiento) => movimiento.referencia === dtmovimiento.referencia);
        if (indice === -1)
            callback(`El movimiento ${dtmovimiento.referencia} no existe.`);
        else {
            const movimiento = this.movimientos[indice];
            if (!movimiento) {
                callback(`El movimiento ${dtmovimiento.referencia} no existe.`);
                return;
            }
            this.db.deleteRecord({
                tabla: this.tbMovimientos,
                object: movimiento,
                callback: ({ objects: movimientos, error }) => {
                    if (!error)
                        this.llenarMovimientos(movimientos || []);
                    callback?.(error);
                },
            });
        }
    }
    procesarMovimientos(movimiento) {
        this.saldoTotal += movimiento.montoOperacion();
    }
    SaldoActual() {
        return this.saldoTotal;
    }
    cargarBanco(callback) {
        this.db.listRecords({
            tabla: this.tbMovimientos,
            callback: ({ objects, error }) => {
                if (!error)
                    this.llenarMovimientos(objects || []);
                this.llenarCategorias(categoriasData);
                callback(error);
            },
        });
    }
    llenarCategorias(categorias) {
        this.categorias = [];
        categorias.forEach((categoria) => {
            this.categorias.push(new Cl_mCategoria(categoria));
        });
    }
    llenarMovimientos(movimientos) {
        this.movimientos = [];
        this.saldoTotal = 0;
        movimientos.forEach((movimiento) => {
            let mov = new Cl_mMovimiento(movimiento);
            this.movimientos.push(mov);
            this.procesarMovimientos(mov);
        });
    }
    listarMovimientos() {
        return this.movimientos.map((movimiento) => movimiento.toJSON());
    }
    listarCategorias() {
        return this.categorias.map((categoria) => categoria.toJSON());
    }
}
