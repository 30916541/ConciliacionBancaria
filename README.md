# 📊 Sistema de Conciliación Bancaria

## 📋 Tabla de Contenidos
- [Descripción General](#-descripción-general)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación de Clases](#-documentación-de-clases)
  - [Modelos (Model)](#modelos-model)
  - [Vistas (View)](#vistas-view)
  - [Controlador (Controller)](#controlador-controller)
  - [Herramientas (Tools)](#herramientas-tools)
- [Flujo de Navegación entre Pantallas](#-flujo-de-navegación-entre-pantallas)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Guía de Uso](#-guía-de-uso)
- [Instalación y Configuración](#-instalación-y-configuración)

---

## 🎯 Descripción General

El **Sistema de Conciliación Bancaria** es una aplicación web desarrollada en TypeScript que permite gestionar movimientos bancarios (abonos y cargos), categorías, y realizar conciliaciones automáticas comparando los registros internos con estados de cuenta bancarios externos.

### Características Principales:
- ✅ Registro y gestión de movimientos bancarios (Abonos y Cargos)
- ✅ Gestión de categorías personalizadas
- ✅ Cálculo automático del saldo total
- ✅ Filtrado avanzado de movimientos
- ✅ Conciliación bancaria automática mediante archivos JSON
- ✅ Interfaz responsive y moderna
- ✅ Persistencia de datos mediante base de datos web
- ✅ Validaciones en tiempo real

---

## 🏗️ Arquitectura del Sistema.

El proyecto sigue el patrón de diseño **MVC (Modelo-Vista-Controlador)** con una clara separación de responsabilidades:

```
┌─────────────────────────────────────────────────────────┐
│                      USUARIO                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   VISTAS (View)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Cl_vBanco   │  │Cl_vMovimiento│                    │
│  └──────────────┘  └──────────────┘                    │
│  ┌──────────────┐                                       │
│  │Cl_vConcilia. │                                       │
│  └──────────────┘                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               CONTROLADOR (Controller)                   │
│              ┌──────────────────┐                        │
│              │  Cl_controlador  │                        │
│              └──────────────────┘                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  MODELOS (Model)                         │
│  ┌──────────────┐                    │
│  │Cl_mMovimiento│                    │
│  └──────────────┘                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              BASE DE DATOS (Cl_dcytDb)                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologías Utilizadas

- **TypeScript**: Lenguaje principal de desarrollo
- **HTML5**: Estructura de la interfaz
- **CSS3**: Estilos y diseño responsive
- **SweetAlert2**: Alertas y confirmaciones elegantes
- **Cl_dcytDb**: Sistema de base de datos web personalizado
- **ES6 Modules**: Sistema de módulos JavaScript

---

## 📁 Estructura del Proyecto

```
Conciliacion Bancaria/
├── src/
│   ├── Cl_index.ts              # Punto de entrada de la aplicación
│   ├── Cl_controlador.ts        # Controlador principal (MVC)
│   │
│   ├── Modelos/
│   │   ├── Cl_mBanco.ts         # Modelo principal del banco
│   │   ├── Cl_mMovimiento.ts    # Modelo de movimientos (Abonos y Cargos)
│   │   └── Cl_mCategoria.ts     # Modelo de categorías
│   │
│   ├── Vistas/
│   │   ├── Cl_vBanco.ts         # Vista principal del banco
│   │   ├── Cl_vMovimiento.ts    # Vista de formulario de movimientos
│   │   └── Cl_vConciliacion.ts  # Vista de conciliación bancaria
│   │
│   └── tools/
│       ├── Cl_mTablaWeb.ts      # Clase base para modelos con BD
│       ├── Cl_vGeneral.ts       # Clase base para vistas
│       ├── core.tools.ts        # Utilidades generales
│       ├── date.tools.ts        # Utilidades de fechas
│       └── string.tools.ts      # Utilidades de strings
│
├── dist/                        # Archivos JavaScript compilados
├── index.html                   # Página principal
├── style.css                    # Estilos de la aplicación
├── tsconfig.json               # Configuración de TypeScript
└── README.md                   # Este archivo
```

---

## 📚 Documentación de Clases

### Modelos (Model)

#### 1. `Cl_mBanco`
**Descripción**: Modelo principal que gestiona toda la lógica de negocio del banco, incluyendo movimientos, categorías y saldo.

**Atributos**:
- `private db: Cl_dcytDb` - Instancia de conexión a la base de datos
- `private movimientos: Cl_mMovimiento[]` - Array de movimientos bancarios
- `private categorias: Cl_mCategoria[]` - Array de categorías (cargadas desde `_data.ts`)
- `private saldoTotal: number` - Saldo total actual
- `readonly tbMovimientos: string` - Nombre de la tabla de movimientos

**Métodos Principales**:

| Método | Descripción | Parámetros | Retorno |
|--------|-------------|------------|---------|
| `constructor()` | Inicializa la conexión a BD y arrays | - | void |

| `addMovimiento()` | Agrega un nuevo movimiento | `dtmovimiento: iMovimiento, callback` | void |
| `editMovimiento()` | Edita un movimiento existente | `dtmovimiento: iMovimiento, callback` | void |
| `deleteMovimiento()` | Elimina un movimiento | `dtmovimiento: iMovimiento, callback` | void |
| `procesarMovimientos()` | Actualiza el saldo según el tipo de movimiento | `movimiento: Cl_mMovimiento` | void |
| `SaldoActual()` | Obtiene el saldo total actual | - | number |
| `cargarBanco()` | Carga datos iniciales desde BD | `callback` | void |
| `llenarCategorias()` | Llena el array de categorías | `categorias: iCategoria[]` | void |
| `llenarMovimientos()` | Llena el array de movimientos | `movimientos: iMovimiento[]` | void |
| `listarMovimientos()` | Retorna todos los movimientos | - | iMovimiento[] |
| `listarCategorias()` | Retorna todas las categorías | - | iCategoria[] |

**Funcionalidad Detallada**:
- **addMovimiento**: Valida el movimiento, lo inserta en BD, crea instancia de Movimiento, actualiza saldo y arrays
- **editMovimiento**: Busca el movimiento por ID, revierte el saldo anterior, actualiza en BD, aplica nuevo saldo
- **deleteMovimiento**: Elimina de BD, revierte el saldo, actualiza arrays
- **procesarMovimientos**: Suma o resta del saldo según sea Abono (+) o Cargo (-)

---

#### 2. `Cl_mMovimiento`
**Descripción**: Clase que representa todos los movimientos bancarios (Abonos y Cargos).

**Atributos**:
- `private _fechaHora: string` - Fecha y hora del movimiento
- `private _referencia: string` - Número de referencia único (formato AAA-000)
- `private _categoria: string` - Categoría del movimiento
- `private _descripcion: string` - Descripción del movimiento
- `private _monto: number` - Monto del movimiento
- `private _tipo: string` - Tipo: "Abono" o "Cargo"

**Métodos**:

| Método | Descripción | Retorno |
|--------|-------------|---------|
| `fechaHora(value)` / `fechaHora()` | Setter/Getter de fecha y hora | string |
| `referencia(value)` / `referencia()` | Setter/Getter de referencia | string |
| `categoria(value)` / `categoria()` | Setter/Getter de categoría | string |
| `descripcion(value)` / `descripcion()` | Setter/Getter de descripción | string |
| `monto(value)` / `monto()` | Setter/Getter de monto | number |
| `tipo(value)` / `tipo()` | Setter/Getter de tipo | string |
| `montoOperacion()` | Retorna el monto positivo para Abonos y negativo para Cargos | number |
| `referenciaOK` | Valida que referencia tenga formato AAA-000 | boolean |
| `montoOK` | Valida que monto sea mayor a 0 | boolean |
| `movimientoOK` | Valida todo el movimiento | string \| true |
| `toJSON()` | Convierte a objeto JSON | iMovimiento |

---



#### 5. `Cl_mCategoria`
**Descripción**: Modelo para categorías de movimientos.

**Atributos**:
- `private _nombre: string` - Nombre de la categoría

**Métodos**:

| Método | Descripción | Retorno |
|--------|-------------|---------|
| `nombre(value)` / `nombre()` | Setter/Getter del nombre | string |
| `nombreOK` | Valida que el nombre no esté vacío | boolean |
| `categoriaOK` | Valida toda la categoría | string \| boolean |
| `toJSON()` | Convierte a objeto JSON | iCategoria |

---

### Vistas (View)

#### 1. `Cl_vBanco`
**Descripción**: Vista principal que gestiona la interfaz del banco y la navegación entre pantallas.

**Atributos**:
- Botones: `_btAgregarAbono`, `_btAgregarCargo`, `_btConciliar`, `_btVerMovimientos`
- Secciones: `_secMovimientoBancarios`, `_secOperaciones`, `_secSaldoTotal`, `_secTablaMovimientos`, etc.
- Elementos: `_lblSaldoTotal`, `_divAgregarMovimiento`

**Métodos Principales**:

| Método | Descripción | Funcionalidad |
|--------|-------------|---------------|
| `constructor()` | Inicializa elementos DOM y eventos | Vincula botones con funciones del controlador |
| `mostrarVistaPrincipal()` | Muestra la pantalla principal | Oculta todo y muestra secciones principales |
| `mostrarRegistrarMovimiento()` | Muestra formulario de movimiento | Oculta botones de agregar, muestra formulario |

| `mostrarConciliacion()` | Muestra vista de conciliación | Cambia a vista de conciliación |
| `mostrarTablaMovimientos()` | Muestra tabla de movimientos | Muestra tabla con filtros |
| `mostrarDetalle()` | Muestra detalle de un movimiento | Cambia a vista de detalle |
| `ocultarTodo()` | Oculta todas las secciones | Establece display:none en todas las vistas |
| `actualizarSaldo()` | Actualiza el saldo mostrado | Formatea y muestra el saldo en Bs |
| `llenarTablaMovimientos()` | Llena la tabla con movimientos | Aplica filtros, crea filas con botones de acción |

**Funcionalidad de Botones en Tabla**:
- **Ver** (👁️): Icono de ojo, llama a `verMovimiento()`
- **Editar** (✏️): Icono de lápiz, llama a `editarMovimiento()`
- **Eliminar** (🗑️): Icono de papelera, llama a `eliminarMovimiento()`

---

#### 2. `Cl_vMovimiento`
**Descripción**: Vista del formulario para registrar y editar movimientos.

**Atributos**:
- Inputs: `_inFechaHora`, `_inReferencia`, `_inCategoria`, `_inDescripcion`, `_inMonto`
- Botones: `_btRegistrar`, `_btActualizar`, `_btCancelar`
- Otros: `_lblTipoMovimiento`, `_tipoMovimiento`, `_movimientoId`, `_desdeConciliacion`

**Métodos**:

| Método | Descripción | Funcionalidad |
|--------|-------------|---------------|
| `prepararFormulario()` | Prepara formulario para nuevo movimiento | Limpia campos, establece tipo, muestra botón registrar |
| `cargarFormulario()` | Carga datos para editar | Llena campos con datos existentes, muestra botón actualizar |
| `ocultarFormulario()` | Oculta el formulario | Establece display:none |
| `registrar()` | Registra nuevo movimiento | Detecta si viene de conciliación y usa método apropiado |
| `actualizar()` | Actualiza movimiento existente | Recopila datos con ID, llama a `actualizarMovimiento()` |
| `llenarCategorias()` | Llena select de categorías | Crea opciones dinámicamente desde array |
| `prellenarFormulario()` | Precarga datos para conciliación | Llena campos incluyendo categoría, establece flag de conciliación |

---



#### 4. `Cl_vConciliacion`
**Descripción**: Vista para realizar conciliación bancaria.

**Atributos**:
- Input: `_inArchivo` (tipo file)
- Botones: `_btConciliar`, `_btRegresar`
- Tabla: `_tablaConciliacion`

**Métodos**:

| Método | Descripción | Funcionalidad |
|--------|-------------|---------------|
| `procesarArchivo()` | Lee archivo JSON | Usa FileReader, parsea JSON, llama a `realizarConciliacion()` |
| `llenarTablaConciliacion()` | Muestra resultados | Crea filas con estados, botón conciliar manual, actualiza automáticamente |

**Estados de Conciliación**:
- ✅ **Conciliado** (verde): Movimiento encontrado en ambos sistemas
- ❌ **No Conciliado** (rojo): Movimiento solo en estado de cuenta bancario

---

### Controlador (Controller)

#### `Cl_controlador`
**Descripción**: Orquesta la comunicación entre modelos y vistas. Gestiona toda la lógica de la aplicación.

**Atributos**:
- `private modelo: Cl_mBanco` - Referencia al modelo principal
- `private vista: Cl_vBanco` - Referencia a la vista principal
- `private vMovimiento: Cl_vMovimiento` - Vista de movimientos
- `private vConciliacion: Cl_vConciliacion` - Vista de conciliación
- `private resultadosConciliacion: any[]` - Almacena resultados de conciliación para actualización automática

**Métodos de Navegación**:

| Método | Descripción |
|--------|-------------|
| `mostrarRegistrarMovimiento(tipo)` | Muestra formulario según tipo (Abono/Cargo) |

| `mostrarConciliacion()` | Cambia a vista de conciliación |
| `mostrarTablaMovimientos()` | Muestra tabla con filtros |
| `mostrarVistaPrincipal()` | Regresa a pantalla principal |

**Métodos de Gestión de Movimientos**:

| Método | Descripción | Funcionalidad |
|--------|-------------|---------------|
| `agregarMovimiento()` | Agrega nuevo movimiento | Llama a modelo, actualiza vista, muestra confirmación |
| `agregarMovimientoDesdeConciliacion()` | Agrega movimiento desde conciliación | Registra y actualiza tabla de conciliación automáticamente |
| `editarMovimiento()` | Prepara edición | Carga datos en formulario de vista |
| `actualizarMovimiento()` | Actualiza movimiento | Llama a modelo, actualiza vista |
| `eliminarMovimiento()` | Elimina movimiento | Pide confirmación con SweetAlert, llama a modelo |
| `verMovimiento()` | Muestra detalle | Llena vista de detalle con datos del movimiento |



**Métodos de Conciliación**:

| Método | Descripción | Funcionalidad |
|--------|-------------|---------------|
| `realizarConciliacion()` | Concilia movimientos | Compara arrays, guarda resultados, identifica coincidencias |
| `actualizarTablaConciliacion()` | Actualiza estado en tabla | Cambia estado a "Conciliado" y refresca tabla |
| `prepararConciliacionManual()` | Prepara registro manual | Precarga formulario con todos los datos incluyendo categoría |

---

### Herramientas (Tools)

#### `Cl_mTablaWeb`
Clase base para modelos que interactúan con la base de datos. Proporciona atributos comunes: `id`, `creadoEl`, `alias`.

#### `Cl_vGeneral`
Clase base para vistas. Proporciona métodos comunes como `show()`, `hide()`, y gestión de controlador.

---

## 🔄 Flujo de Navegación entre Pantallas

### Diagrama de Flujo de Navegación

```
                    ┌─────────────────────┐
                    │  PANTALLA PRINCIPAL │
                    │  (Vista Principal)  │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
    ┌──────────┐        ┌──────────┐
    │  ABONO   │        │  CARGO   │
    │  (Form)  │        │  (Form)  │
    └────┬─────┘        └────┬─────┘
         │                   │
         └───────────┬───────┘
                     │
                     ▼
          ┌─────────────────┐
          │ REGISTRAR/      │
          │ ACTUALIZAR      │
          │ MOVIMIENTO      │
          └────────┬────────┘
                   │
                   │
           ┌───────┴────────┐
           │                │
           ▼                ▼
    ┌──────────┐     ┌──────────┐    ┌──────────┐
    │   VER    │     │  TABLA   │    │  EDITAR  │
    │ MOVIMIEN.│     │ MOVIMIEN.│    │ ELIMINAR │
    └──────────┘     └────┬─────┘    └──────────┘
                          │
                          ▼
                   ┌──────────┐
                   │ FILTROS  │
                   └──────────┘

           ┌────────────────────────────┐
           │     CONCILIACIÓN           │
           │  (Cargar archivo JSON)     │
           └──────────┬─────────────────┘
                      │
                      ▼
           ┌────────────────────────────┐
           │  RESULTADOS CONCILIACIÓN   │
           │  (Coincide/No coincide)    │
           └──────────┬─────────────────┘
                      │
                      ▼
           ┌────────────────────────────┐
           │  CONCILIACIÓN MANUAL       │
           │  (Registrar faltante)      │
           └────────────────────────────┘
```

### Descripción Detallada del Flujo

#### 1. **Inicio de la Aplicación**
```typescript
Cl_index → Cl_mBanco.cargarBanco() → Cl_vBanco.mostrarVistaPrincipal()
```
- Se carga el modelo desde la base de datos
- Se inicializa el controlador
- Se muestra la vista principal con saldo actual

#### 2. **Registro de Movimiento (Abono/Cargo)**
```
Usuario hace clic en "Abono" o "Cargo"
    ↓
Cl_vBanco._btAgregarAbono/Cargo.onclick()
    ↓
Cl_controlador.mostrarRegistrarMovimiento(tipo)
    ↓
Cl_vMovimiento.prepararFormulario(tipo)
    ↓
Usuario llena formulario y hace clic en "Registrar"
    ↓
Cl_vMovimiento.registrar()
    ↓
Cl_controlador.agregarMovimiento(movimiento)
    ↓
Cl_mBanco.addMovimiento() → BD
    ↓
Callback: Actualiza arrays, saldo, vistas
    ↓
SweetAlert: Confirmación de éxito
    ↓
Regresa a vista principal
```

#### 3. **Edición de Movimiento**
```
Usuario hace clic en botón "Editar" (✏️) en tabla
    ↓
Cl_vBanco.btnEditar.onclick()
    ↓
Cl_controlador.editarMovimiento(movimiento)
    ↓
Cl_vMovimiento.cargarFormulario(movimiento)
    ↓
Usuario modifica datos y hace clic en "Actualizar"
    ↓
Cl_vMovimiento.actualizar()
    ↓
Cl_controlador.actualizarMovimiento(movimiento)
    ↓
Cl_mBanco.editMovimiento() → BD
    ↓
Callback: Revierte saldo anterior, aplica nuevo
    ↓
SweetAlert: Confirmación
    ↓
Actualiza tabla y regresa a vista principal
```

#### 4. **Eliminación de Movimiento**
```
Usuario hace clic en botón "Eliminar" (🗑️)
    ↓
Cl_vBanco.btnEliminar.onclick()
    ↓
Cl_controlador.eliminarMovimiento(movimiento)
    ↓
SweetAlert: Confirmación "¿Está seguro?"
    ↓
Si confirma → Cl_mBanco.deleteMovimiento() → BD
    ↓
Callback: Revierte saldo, actualiza arrays
    ↓
SweetAlert: Confirmación de eliminación
    ↓
Actualiza tabla
```



#### 6. **Visualización de Movimientos con Filtros**
```
Usuario hace clic en "Ver Movimientos"
    ↓
Cl_controlador.mostrarTablaMovimientos()
    ↓
Cl_vBanco.mostrarTablaMovimientos()
    ↓
Cl_vBanco.llenarTablaMovimientos(movimientos)
    ↓
Aplica filtros:
  - Búsqueda por texto (referencia/descripción)
  - Filtro por categoría
  - Filtro por tipo (Abono/Cargo)
  - Filtro por rango de fechas
    ↓
Renderiza tabla con botones de acción
    ↓
Botón "Regresar" → Vista principal
```

#### 7. **Conciliación Bancaria** (Mejorado)
```
Usuario hace clic en "Conciliar"
    ↓
Cl_controlador.mostrarConciliacion()
    ↓
Cl_vConciliacion se muestra
    ↓
Usuario selecciona archivo JSON y hace clic en "Conciliar"
    ↓
Cl_vConciliacion.procesarArchivo()
    ↓
FileReader lee el archivo
    ↓
Cl_controlador.realizarConciliacion(datosBanco)
    ↓
Compara movimientos internos vs. banco:
  - Conciliado: Mismo monto y referencia
  - No Conciliado: Solo existe en banco
    ↓
Guarda resultados en controlador
    ↓
Cl_vConciliacion.llenarTablaConciliacion(resultados)
    ↓
Para movimientos "No Conciliado":
  Usuario hace clic en "Conciliar"
    ↓
  SweetAlert: Confirmación
    ↓
  Cl_controlador.prepararConciliacionManual()
    ↓
  Cl_vMovimiento.prellenarFormulario(datos) [CON CATEGORÍA]
    ↓
  Usuario confirma y hace clic en "Registrar"
    ↓
  Cl_vMovimiento.registrar() detecta flag de conciliación
    ↓
  Cl_controlador.agregarMovimientoDesdeConciliacion()
    ↓
  Registra en BD y actualiza saldo
    ↓
  Cl_controlador.actualizarTablaConciliacion()
    ↓
  Cambia estado a "Conciliado" en la tabla
    ↓
  Regresa automáticamente a vista de conciliación
    ↓
  Tabla muestra el movimiento como "Conciliado" ✅
```

### Estados de las Vistas

| Vista | Elementos Visibles | Elementos Ocultos |
|-------|-------------------|-------------------|
| **Principal** | Botones Abono/Cargo, Operaciones, Saldo | Formularios, Tablas, Otras vistas |
| **Formulario Movimiento** | Form de movimiento, Botones Registrar/Cancelar | Vista principal, Botones Abono/Cargo |
| **Tabla Movimientos** | Tabla, Filtros, Botón Regresar | Vista principal, Formularios |

| **Conciliación** | Form archivo, Tabla resultados | Vista principal |
| **Detalle Movimiento** | Información detallada, Botón Regresar | Todo lo demás |

---

## ⚙️ Funcionalidades Principales

### 1. **Gestión de Movimientos**
- ✅ Registro de abonos (ingresos)
- ✅ Registro de cargos (egresos)
- ✅ Edición de movimientos existentes
- ✅ Eliminación con confirmación
- ✅ Visualización detallada
- ✅ Validación de referencia (formato AAA-000)
- ✅ Validación de monto (mayor a 0)

### 2. **Gestión de Categorías**
- ✅ Categorías predefinidas (cargadas desde archivo estático)
- ✅ Asignación a movimientos

### 3. **Cálculo de Saldo**
- ✅ Actualización automática en tiempo real
- ✅ Suma de abonos
- ✅ Resta de cargos
- ✅ Formato en bolivianos (Bs)

### 4. **Filtrado de Movimientos**
- ✅ Búsqueda por texto (referencia/descripción)
- ✅ Filtro por categoría
- ✅ Filtro por tipo (Abono/Cargo)
- ✅ Filtro por rango de fechas
- ✅ Combinación de múltiples filtros

### 5. **Conciliación Bancaria**
- ✅ Carga de estado de cuenta (JSON)
- ✅ Comparación automática por referencia y monto
- ✅ Identificación de coincidencias
- ✅ Detección de movimientos faltantes
- ✅ Registro manual de faltantes con datos precargados
- ✅ Actualización automática de tabla después de registrar
- ✅ Estados visuales: "Conciliado" (verde) y "No Conciliado" (rojo)
- ✅ Precarga automática de categoría desde archivo bancario

### 6. **Interfaz de Usuario**
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Iconos SVG en botones de acción
- ✅ Alertas elegantes con SweetAlert2
- ✅ Validaciones en tiempo real
- ✅ Feedback visual (colores, estados)

---

## 📖 Guía de Uso

### Registrar un Movimiento

1. En la pantalla principal, haga clic en **"Abono"** o **"Cargo"**
2. Complete el formulario:
   - **Fecha y hora**: Fecha del movimiento
   - **Referencia**: Número único de 13 caracteres
   - **Categoría**: Seleccione de la lista
   - **Descripción**: Detalle del movimiento
   - **Monto**: Cantidad en bolivianos
3. Haga clic en **"Registrar"**
4. Confirme el mensaje de éxito

### Editar un Movimiento

1. Haga clic en **"Ver Movimientos"**
2. Localice el movimiento en la tabla
3. Haga clic en el icono de **lápiz (✏️)**
4. Modifique los campos necesarios
5. Haga clic en **"Actualizar"**



### Realizar Conciliación

1. Prepare un archivo JSON con el formato:
```json
[
  {
    "fechaHora": "25-11-2024 14:30",
    "referencia": "MOV-001",
    "categoria": "Ventas",
    "descripcion": "Pago cliente",
    "monto": 1500.00,
    "tipo": "Abono"
  }
]
```
2. Haga clic en **"Conciliar"**
3. Seleccione el archivo JSON
4. Haga clic en **"Conciliar"**
5. Revise los resultados:
   - ✅ **Conciliado** (verde): El movimiento ya existe en el sistema
   - ❌ **No Conciliado** (rojo): El movimiento solo está en el banco
6. Para movimientos **No Conciliados**:
   - Haga clic en el botón **"Conciliar"**
   - Confirme en el diálogo
   - El formulario se abrirá con TODOS los datos precargados (incluyendo categoría)
   - Verifique los datos y haga clic en **"Registrar"**
   - La tabla se actualizará automáticamente mostrando el estado como **"Conciliado"** ✅

### Filtrar Movimientos

1. Haga clic en **"Ver Movimientos"**
2. Use los filtros disponibles:
   - **Buscar**: Escriba referencia o descripción
   - **Categoría**: Seleccione una categoría
   - **Tipo**: Seleccione Abono o Cargo
   - **Fechas**: Seleccione rango de fechas
3. Haga clic en **"Filtrar"**
4. Para limpiar filtros, haga clic en **"Limpiar"**

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js (v14 o superior)
- TypeScript (v4 o superior)
- Navegador web moderno

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
```bash
cd "Conciliacion Bancaria (Pruebas)"
```

2. **Instalar TypeScript (si no está instalado)**
```bash
npm install -g typescript
```

3. **Compilar TypeScript**
```bash
npx tsc
```

4. **Abrir en navegador**
- Abra `index.html` en su navegador
- O use un servidor local:
```bash
npx http-server
```

### Configuración de Base de Datos

El proyecto usa `Cl_dcytDb` que se conecta automáticamente. Las tablas se crean con los nombres:
- `Movimientos_Prueba.V1`

### Estructura de Compilación

El archivo `tsconfig.json` está configurado para:
- Compilar a ES6
- Usar módulos ES6
- Generar archivos en carpeta `dist/`
- Incluir source maps para debugging

---

## 👥 Créditos

**Designed by TheGitGuardians**

---

## 📝 Notas Adicionales

### Formato de Referencia
Las referencias deben seguir el formato `AAA-000`. Ejemplo: `MOV-001`

### Formato de Fecha
Las fechas se manejan en formato: `DD-MM-YYYY HH:mm`

### Validaciones
- Todos los campos son obligatorios
- El monto debe ser mayor a 0
- La referencia debe ser única
- Las categorías no pueden eliminarse si están en uso

### Iconos en Botones
- 👁️ Ver: Muestra detalles del movimiento
- ✏️ Editar: Permite modificar el registro
- 🗑️ Eliminar: Elimina el registro (con confirmación)

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2025
