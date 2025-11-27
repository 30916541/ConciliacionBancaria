import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import Cl_controlador from "./Cl_controlador.js";

export default class Cl_vBanco extends Cl_vGeneral {
    private _btAgregarAbono: HTMLButtonElement;
    private _btAgregarCargo: HTMLButtonElement;
    private _btAjustes: HTMLButtonElement;
    private _btConciliar: HTMLButtonElement;
    private _btVerMovimientos: HTMLButtonElement;
    private _lblSaldoTotal: HTMLElement;

    private _secMovimientoBancarios: HTMLElement;
    private _secOperaciones: HTMLElement;
    private _secSaldoTotal: HTMLElement;
    private _secTablaMovimientos: HTMLElement;
    private _secVistaCategorias: HTMLElement;
    private _secVistaConciliacion: HTMLElement;
    private _secVistaDetalle: HTMLElement;

    private _divAgregarMovimiento: HTMLElement;

    constructor(controlador?: Cl_controlador) {
        super({ formName: "banco" });
        if (controlador) this.controlador = controlador;

        this._btAgregarAbono = document.getElementById("agregarMovimiento_btAgregarAbono") as HTMLButtonElement;
        this._btAgregarCargo = document.getElementById("agregarMovimiento_btAgregarCargo") as HTMLButtonElement;
        this._divAgregarMovimiento = document.getElementById("agregarMovimiento") as HTMLElement;
        this._btAjustes = document.getElementById("agregarMovimiento_btAjustes") as HTMLButtonElement;
        this._btConciliar = document.getElementById("agregarMovimiento_btConciliar") as HTMLButtonElement;
        this._btVerMovimientos = document.getElementById("saldoTotal_btnVerMovimientos") as HTMLButtonElement;
        this._lblSaldoTotal = document.getElementById("saldoTotal_pSaldoTotal") as HTMLElement;
        const btRegresarTablaMovimientos = document.getElementById("tablaMovimientos_btRegresar") as HTMLButtonElement;
        
        // Filtros
        const btnFiltrar = document.getElementById("btn_aplicar_filtros") as HTMLButtonElement;
        const btnLimpiar = document.getElementById("btn_limpiar_filtros") as HTMLButtonElement;

        this._secMovimientoBancarios = document.getElementById("movimientoBancarios") as HTMLElement;
        this._secOperaciones = document.getElementById("operaciones") as HTMLElement;
        this._secSaldoTotal = document.getElementById("saldoTotal") as HTMLElement;
        this._secTablaMovimientos = document.getElementById("tablaMovimientos") as HTMLElement;
        this._secVistaCategorias = document.getElementById("vistaCategorias") as HTMLElement;
        this._secVistaConciliacion = document.getElementById("vistaConciliacion") as HTMLElement;
        this._secVistaDetalle = document.getElementById("vistaDetalle") as HTMLElement;

        this._btAgregarAbono.onclick = () => this.controlador?.mostrarRegistrarMovimiento("Abono");
        this._btAgregarCargo.onclick = () => this.controlador?.mostrarRegistrarMovimiento("Cargo");
        this._btAjustes.onclick = () => this.controlador?.mostrarCategorias();
        this._btConciliar.onclick = () => this.controlador?.mostrarConciliacion();
        this._btVerMovimientos.onclick = () => this.controlador?.mostrarTablaMovimientos();
        if(btRegresarTablaMovimientos) btRegresarTablaMovimientos.onclick = () => this.controlador?.mostrarVistaPrincipal();
        
        if (btnFiltrar) btnFiltrar.onclick = () => this.controlador?.mostrarTablaMovimientos();
        if (btnLimpiar) btnLimpiar.onclick = () => {
            (document.getElementById("filtro_busqueda") as HTMLInputElement).value = "";
            (document.getElementById("filtro_categoria") as HTMLSelectElement).value = "";
            (document.getElementById("filtro_tipo") as HTMLSelectElement).value = "";
            (document.getElementById("filtro_fecha_inicio") as HTMLInputElement).value = "";
            (document.getElementById("filtro_fecha_fin") as HTMLInputElement).value = "";
            this.controlador?.mostrarTablaMovimientos();
        };

        this.mostrarVistaPrincipal();
    }

    mostrarVistaPrincipal() {
        this.ocultarTodo();
        this._secMovimientoBancarios.style.display = "block";
        this._divAgregarMovimiento.style.display = "flex";
        this._secOperaciones.style.display = "block";
        this._secSaldoTotal.style.display = "block";
    }

    mostrarRegistrarMovimiento() {
        this.ocultarTodo();
        this._secMovimientoBancarios.style.display = "block";
        this._divAgregarMovimiento.style.display = "none";
    }

    mostrarCategorias() {
        this.ocultarTodo();
        this._secVistaCategorias.style.display = "block";
    }

    mostrarConciliacion() {
        this.ocultarTodo();
        this._secVistaConciliacion.style.display = "block";
    }

    mostrarTablaMovimientos() {
        this.ocultarTodo();
        this._secTablaMovimientos.style.display = "block";
        
        // Llenar select de categorías en filtros si está vacío
        const filtroCategoria = document.getElementById("filtro_categoria") as HTMLSelectElement;
        if (filtroCategoria && filtroCategoria.options.length <= 1) { // Solo tiene la opción "Todas"
             // Esto idealmente debería venir del controlador, pero para simplificar aquí:
             // Necesitamos las categorías. Podemos pedirlas al controlador si modificamos la firma, 
             // o simplemente dejar que el usuario filtre por texto si no queremos complicar la dependencia aquí.
             // O mejor, llamamos a un método público para actualizar filtros.
        }
    }

    mostrarDetalle() {
        this.ocultarTodo();
        this._secVistaDetalle.style.display = "block";
    }

    ocultarTodo() {
        if(this._secMovimientoBancarios) this._secMovimientoBancarios.style.display = "none";
        if(this._secOperaciones) this._secOperaciones.style.display = "none";
        if(this._secSaldoTotal) this._secSaldoTotal.style.display = "none";
        if(this._secTablaMovimientos) this._secTablaMovimientos.style.display = "none";
        if(this._secVistaCategorias) this._secVistaCategorias.style.display = "none";
        if(this._secVistaConciliacion) this._secVistaConciliacion.style.display = "none";
        if(this._secVistaDetalle) this._secVistaDetalle.style.display = "none";
    }

    actualizarSaldo(saldo: number) {
        this._lblSaldoTotal.textContent = saldo.toFixed(2) + " Bs";
    }

    llenarTablaMovimientos(movimientos: any[]) {
        const tbody = document.getElementById("tablaMovimientos_body") as HTMLTableSectionElement;
        if (!tbody) return;
        tbody.innerHTML = "";

        // Obtener valores de filtros
        const busqueda = (document.getElementById("filtro_busqueda") as HTMLInputElement)?.value.toLowerCase() || "";
        const categoria = (document.getElementById("filtro_categoria") as HTMLSelectElement)?.value || "";
        const tipo = (document.getElementById("filtro_tipo") as HTMLSelectElement)?.value || "";
        const fechaInicio = (document.getElementById("filtro_fecha_inicio") as HTMLInputElement)?.value;
        const fechaFin = (document.getElementById("filtro_fecha_fin") as HTMLInputElement)?.value;

        const movimientosFiltrados = movimientos.filter(mov => {
            const cumpleBusqueda = !busqueda || 
                (mov.referencia && mov.referencia.toLowerCase().includes(busqueda)) || 
                (mov.descripcion && mov.descripcion.toLowerCase().includes(busqueda));
            
            const cumpleCategoria = !categoria || mov.categoria === categoria;
            const cumpleTipo = !tipo || mov.tipo === tipo;
            
            let cumpleFecha = true;
            if (fechaInicio || fechaFin) {
                // Asumiendo formato DD-MM-YYYY HH:mm o similar en mov.fechaHora
                // Convertir a objeto Date para comparar. 
                // Nota: mov.fechaHora es string. Necesitamos parsearlo correctamente.
                // Si el formato es consistente, podemos intentar compararlo.
                // Para simplificar, comparamos strings si el formato es ISO, pero aquí es 'DD-MM-YYYY HH:mm'.
                // Vamos a intentar convertirlo.
                const partes = mov.fechaHora.split(' ')[0].split('-'); // [DD, MM, YYYY]
                if (partes.length === 3) {
                    const fechaMov = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`); // YYYY-MM-DD
                    if (fechaInicio) {
                        const fInicio = new Date(fechaInicio);
                        if (fechaMov < fInicio) cumpleFecha = false;
                    }
                    if (fechaFin && cumpleFecha) {
                        const fFin = new Date(fechaFin);
                        if (fechaMov > fFin) cumpleFecha = false;
                    }
                }
            }

            return cumpleBusqueda && cumpleCategoria && cumpleTipo && cumpleFecha;
        });

        movimientosFiltrados.forEach(mov => {
            const row = tbody.insertRow();
            const claseMonto = mov.tipo === "Cargo" ? "monto-cargo" : (mov.tipo === "Abono" ? "monto-abono" : "");
            row.innerHTML = `
                <td>${mov.fechaHora}</td>
                <td>${mov.categoria}</td>
                <td class="${claseMonto}">${mov.monto}</td>
                <td></td>
            `;
            const cellAcciones = row.cells[3];
            if (cellAcciones) {
                const btnVer = document.createElement("button");
                btnVer.textContent = "Ver";
                btnVer.className = "ver";
                btnVer.onclick = () => this.controlador?.verMovimiento(mov);
                cellAcciones.appendChild(btnVer);

                const btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.className = "editar";
                btnEditar.onclick = () => this.controlador?.editarMovimiento(mov);
                cellAcciones.appendChild(btnEditar);

                const btnEliminar = document.createElement("button");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.className = "eliminar";
                btnEliminar.onclick = () => this.controlador?.eliminarMovimiento(mov);
                cellAcciones.appendChild(btnEliminar);
            }
        });
    }
    llenarFiltroCategorias(categorias: any[]) {
        const filtroCategoria = document.getElementById("filtro_categoria") as HTMLSelectElement;
        if (!filtroCategoria) return;
        
        // Guardar selección actual si existe
        const seleccionActual = filtroCategoria.value;

        filtroCategoria.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Todas";
        filtroCategoria.appendChild(defaultOption);

        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.nombre;
            option.textContent = cat.nombre;
            filtroCategoria.appendChild(option);
        });

        // Restaurar selección si aún existe en las nuevas opciones
        if (seleccionActual) {
            filtroCategoria.value = seleccionActual;
        }
    }
}