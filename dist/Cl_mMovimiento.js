import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";
export default class Cl_mMovimiento extends Cl_mTablaWeb {
    _fechaHora = "";
    _referencia = "";
    _categoria = "";
    _descripcion = "";
    _monto = 0;
    _tipo = "";
    constructor({ id, creadoEl, alias, fechaHora, referencia, categoria, descripcion, monto, tipo } = {
        id: null,
        creadoEl: null,
        alias: null,
        fechaHora: "",
        referencia: "",
        categoria: "",
        descripcion: "",
        monto: 0,
        tipo: ""
    }) {
        super({ id, creadoEl, alias });
        this.fechaHora = fechaHora;
        this.referencia = referencia;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.monto = monto;
        this.tipo = tipo;
    }
    set fechaHora(fechaHora) {
        this._fechaHora = fechaHora;
    }
    get fechaHora() {
        return this._fechaHora;
    }
    set referencia(referencia) {
        this._referencia = referencia;
    }
    get referencia() {
        return this._referencia;
    }
    set categoria(categoria) {
        this._categoria = categoria;
    }
    get categoria() {
        return this._categoria;
    }
    set descripcion(descripcion) {
        this._descripcion = descripcion;
    }
    get descripcion() {
        return this._descripcion;
    }
    set monto(monto) {
        this._monto = monto;
    }
    get monto() {
        return this._monto;
    }
    set tipo(tipo) {
        this._tipo = tipo;
    }
    get tipo() {
        return this._tipo;
    }
    montoOperacion() {
        return this._monto;
    }
    get referenciaOK() {
        return this._referencia.length === 13;
    }
    get montoOK() {
        return this._monto > 0;
    }
    get movimientoOK() {
        if (!this.referenciaOK)
            return "Referencia";
        if (!this.montoOK)
            return "Monto";
        return true;
    }
    toJSON() {
        return {
            id: this.id,
            creadoEl: this.creadoEl,
            alias: this.alias,
            fechaHora: this.fechaHora,
            referencia: this.referencia,
            categoria: this.categoria,
            descripcion: this.descripcion,
            monto: this.monto,
            tipo: this.tipo
        };
    }
}
