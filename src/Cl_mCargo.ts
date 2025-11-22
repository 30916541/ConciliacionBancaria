import Cl_mMovimiento from "./Cl_mMovimiento.js";

export interface iCargo {
    id: number | null;
    creadoEl: string | null;
    alias: string | null;
    fechaHora: string;
    referencia: string;
    categoria: string;
    descripcion: string;
    monto: number;
}

export default class Cl_mCargo extends Cl_mMovimiento {
    
    constructor({
        id,
        creadoEl,
        alias,
        fechaHora,
        referencia,
        categoria,
        descripcion,
        monto
    }: iCargo) {
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
            // montoOperacion: this.montoOperacion(),
        };
    }

}   