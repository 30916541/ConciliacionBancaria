import Cl_vGeneral from "./tools/Cl_vGeneral.js";
export default class Cl_vCategoria extends Cl_vGeneral {
    _inNombre;
    _btRegistrar;
    _btActualizar;
    _btCancelar;
    _btRegresar;
    _tablaCategorias;
    _categoriaId = null;
    constructor(controlador) {
        super({ formName: "categoriaForm" });
        this.controlador = controlador;
        this._inNombre = document.getElementById("categoriaForm_inNombre");
        this._btRegistrar = document.getElementById("categoriaForm_btRegistrar");
        this._btActualizar = document.getElementById("categoriaForm_btActualizar");
        this._btCancelar = document.getElementById("categoriaForm_btCancelar");
        this._btRegresar = document.getElementById("categoriaForm_btRegresar");
        this._tablaCategorias = document.getElementById("tablaCategorias");
        this._btRegistrar.onclick = () => this.registrar();
        this._btActualizar.onclick = () => this.actualizar();
        this._btRegresar.onclick = () => this.controlador?.mostrarVistaPrincipal();
        this._btCancelar.onclick = () => this.prepararFormulario();
    }
    prepararFormulario() {
        this._inNombre.value = "";
        this._categoriaId = null;
        this._btRegistrar.classList.remove("hidden");
        this._btActualizar.classList.add("hidden");
        this._btCancelar.classList.add("hidden");
        this._btRegresar.classList.remove("hidden");
        this._inNombre.focus();
    }
    cargarFormulario(categoria) {
        this._inNombre.value = categoria.nombre;
        this._categoriaId = categoria.id;
        this._btRegistrar.classList.add("hidden");
        this._btActualizar.classList.remove("hidden");
        this._btCancelar.classList.remove("hidden");
        this._btRegresar.classList.add("hidden");
    }
    registrar() {
        const categoria = {
            id: null,
            creadoEl: null,
            alias: null,
            nombre: this._inNombre.value
        };
        this.controlador?.agregarCategoria(categoria);
        this.prepararFormulario();
    }
    actualizar() {
        const categoria = {
            id: this._categoriaId,
            creadoEl: null,
            alias: null,
            nombre: this._inNombre.value
        };
        this.controlador?.actualizarCategoria(categoria);
        this.prepararFormulario();
    }
    llenarTablaCategorias(categorias) {
        const tbody = document.getElementById("tablaCategorias_body");
        if (!tbody)
            return;
        tbody.innerHTML = "";
        categorias.forEach(cat => {
            const row = tbody.insertRow();
            const cellNombre = row.insertCell();
            cellNombre.textContent = cat.nombre;
            const cellAcciones = row.insertCell();
            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.className = "editar";
            btnEditar.onclick = () => this.controlador?.editarCategoria(cat);
            cellAcciones.appendChild(btnEditar);
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "eliminar";
            btnEliminar.onclick = () => this.controlador?.eliminarCategoria(cat);
            cellAcciones.appendChild(btnEliminar);
        });
    }
}
