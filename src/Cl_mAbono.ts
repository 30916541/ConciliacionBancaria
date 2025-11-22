import Cl_mMovimiento from "./Cl_mMovimiento.js";

export interface iAbono {
    id: number | null;
    creadoEl: string | null;
    alias: string | null;
    fechaHora: string;
    referencia: string;
    categoria: string;
    descripcion: string;
    monto: number;
}

export default class Cl_mAbono extends Cl_mMovimiento {
    constructor({
        id,
        creadoEl,
        alias,
        fechaHora,
        referencia,
        categoria,
        descripcion,
        monto
    }: iAbono) {
        super({
            id,
            creadoEl,
            alias,
            fechaHora,
            referencia,
            categoria,
            descripcion,
            monto
        });
    }

    // montoOperacion(): number {
    //     return this.monto;
    // }

    toJSON() {
        return {
            ...super.toJSON(),
            // montoOperacion: this.montoOperacion()
        };
    }
}