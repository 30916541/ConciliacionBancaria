import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mCategoria from "./Cl_mCategoria.js";
import Cl_mMovimiento from "./Cl_mMovimiento.js";
export default class Cl_mBanco {
    db;
    movimientos = [];
    categorias = [];
    saldoTotal = 0;
    tbCategorias = "Categorias_Prueba.V1";
    tbMovimientos = "Movimiento_Prueba.V1";
    constructor() {
        this.db = new Cl_dcytDb({ aliasCuenta: "THEGITGUARDIANS" });
        this.movimientos = [];
        this.categorias = [];
        this.saldoTotal = 0;
    }
    addCategoria({ dtcategoria, callback, }) {
        let categoria = new Cl_mCategoria(dtcategoria);
        if (this.categorias.find((n) => n.nombre === categoria.nombre))
            callback(`La categoria ${dtcategoria.nombre} ya existe.`);
        else if (!categoria.categoriaOK)
            callback(categoria.categoriaOK);
        else
            this.db.addRecord({
                tabla: this.tbCategorias,
                registroAlias: dtcategoria.nombre,
                object: categoria,
                callback: (result) => {
                    if (!result) {
                        callback("Error del servidor: La respuesta es nula.");
                        return;
                    }
                    const { id, objects: categorias, error } = result;
                    if (!error)
                        this.llenarCategorias(categorias || []);
                    callback?.(error);
                },
            });
    }
    editCategoria({ dtcategoria, callback, }) {
        let categoria = new Cl_mCategoria(dtcategoria);
        if (!categoria.categoriaOK)
            callback(categoria.categoriaOK);
        else
            this.db.editRecord({
                tabla: this.tbCategorias,
                object: categoria,
                callback: (result) => {
                    if (!result) {
                        callback("Error del servidor: La respuesta es nula.");
                        return;
                    }
                    const { objects: categorias, error } = result;
                    if (!error)
                        this.llenarCategorias(categorias || []);
                    callback?.(error);
                },
            });
    }
    deleteCategoria({ nombre, callback, }) {
        let indice = this.categorias.findIndex((n) => n.nombre === nombre);
        if (indice === -1)
            callback(`La categoria ${nombre} no existe.`);
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
            if (algunMovimiento)
                callback(`La categoria ${nombre} tiene movimientos asociados.`);
            else {
                this.db.deleteRecord({
                    tabla: this.tbCategorias,
                    object: categoria,
                    callback: ({ objects: categorias, error }) => {
                        if (!error)
                            this.llenarCategorias(categorias || []);
                        callback?.(error);
                    },
                });
            }
        }
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
                // Cargar categorías también
                this.db.listRecords({
                    tabla: this.tbCategorias,
                    callback: ({ objects: categorias, error: errorCat }) => {
                        if (!errorCat)
                            this.llenarCategorias(categorias || []);
                        callback(error || errorCat);
                    }
                });
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
