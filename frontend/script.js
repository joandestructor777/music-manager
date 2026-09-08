// =============================================
// CONFIGURACIÓN DE LA API
// Detecta el entorno y apunta al backend correcto
// =============================================
let API_URL = "/api";

if (window.location.protocol === "file:" || !window.location.host ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost") {
    // Desarrollo local
    API_URL = "http://127.0.0.1:8000/api";
} else if (window.location.hostname.includes("azurestaticapps.net") ||
           window.location.hostname.includes("azurewebsites.net")) {
    // Azure Static Web Apps → llama al Azure App Service
    // REEMPLAZA esta URL con la de tu App Service después del despliegue:
    API_URL = "https://NOMBRE-DE-TU-APP.azurewebsites.net/api";
} else if (window.location.hostname.includes("github.io")) {
    API_URL = "https://music-manager-api-ydwi.onrender.com/api";
}

// =========================
// MOSTRAR MENSAJES
// =========================

function mostrarMensaje(texto) {

    const mensaje = document.createElement("div");

    mensaje.className = "mensaje";

    mensaje.textContent = texto;

    document.body.appendChild(mensaje);

    setTimeout(() => {

        mensaje.remove();

    }, 2500);

}


// =========================
// CARGAR BANDAS
// =========================

async function cargarBandas() {

    try {

        const respuesta = await fetch(`${API_URL}/bandas`);

        const bandas = await respuesta.json();

        const lista = document.getElementById("lista-bandas");

        lista.innerHTML = "";

        bandas.forEach(banda => {

            const elemento = document.createElement("div");

            elemento.innerHTML = `
                <h3>${banda.nombre}</h3>

                <p>
                    <strong>Género:</strong>
                    ${banda.genero}
                </p>

                <p>
                    ${banda.descripcion}
                </p>

                <button onclick="verDetalleBanda(${banda.id}, '${banda.nombre.replace(/'/g, "\\'")}', '${banda.genero.replace(/'/g, "\\'")}', '${banda.descripcion.replace(/'/g, "\\'")}')">
                    🔍 Ver detalle
                </button>

                <button onclick="editarBanda(${banda.id})">
                    Editar
                </button>

                <button onclick="eliminarBanda(${banda.id})">
                    Eliminar
                </button>
            `;

            lista.appendChild(elemento);

        });

    } catch (error) {

        console.error(
            "Error al cargar las bandas:",
            error
        );

    }

}


// =========================
// BÚSQUEDA DE BANDAS
// =========================

let todasLasBandas = [];

async function cargarBandasParaBusqueda() {

    try {

        const respuesta = await fetch(`${API_URL}/bandas`);

        todasLasBandas = await respuesta.json();

    } catch (error) {

        console.error("Error al cargar bandas para búsqueda:", error);

    }

}


function filtrarBandas(texto) {

    const contenedor = document.getElementById("resultados-busqueda");

    if (!texto.trim()) {

        contenedor.innerHTML = "";
        contenedor.classList.remove("activo");
        return;

    }

    const textoLower = texto.toLowerCase();

    const resultados = todasLasBandas.filter(banda =>
        banda.nombre.toLowerCase().includes(textoLower) ||
        banda.genero.toLowerCase().includes(textoLower)
    );

    if (resultados.length === 0) {

        contenedor.innerHTML = `<div class="resultado-item sin-resultados">No se encontraron bandas</div>`;
        contenedor.classList.add("activo");
        return;

    }

    contenedor.innerHTML = "";
    contenedor.classList.add("activo");

    resultados.forEach(banda => {

        const item = document.createElement("div");

        item.className = "resultado-item";

        item.innerHTML = `
            <span class="resultado-nombre">${banda.nombre}</span>
            <span class="resultado-genero">${banda.genero}</span>
        `;

        item.onclick = () => {

            document.getElementById("input-busqueda").value = banda.nombre;
            contenedor.innerHTML = "";
            contenedor.classList.remove("activo");
            verDetalleBanda(banda.id, banda.nombre, banda.genero, banda.descripcion);

        };

        contenedor.appendChild(item);

    });

}


const inputBusqueda = document.getElementById("input-busqueda");

inputBusqueda.addEventListener("input", (e) => {
    filtrarBandas(e.target.value);
});

// Cerrar resultados al hacer clic fuera
document.addEventListener("click", (e) => {

    if (!e.target.closest(".busqueda-container")) {

        const contenedor = document.getElementById("resultados-busqueda");
        contenedor.innerHTML = "";
        contenedor.classList.remove("activo");

    }

});


// =========================
// DETALLE DE BANDA
// =========================

async function verDetalleBanda(id, nombre, genero, descripcion) {

    const panel = document.getElementById("detalle-banda");
    const detNombre = document.getElementById("detalle-nombre");
    const detGenero = document.getElementById("detalle-genero");
    const detDescripcion = document.getElementById("detalle-descripcion");
    const detCanciones = document.getElementById("detalle-canciones");
    const detIntegrantes = document.getElementById("detalle-integrantes");

    detNombre.textContent = nombre;
    detGenero.textContent = genero;
    detDescripcion.textContent = descripcion;
    detCanciones.innerHTML = "<p class='cargando'>Cargando canciones...</p>";
    detIntegrantes.innerHTML = "<p class='cargando'>Cargando integrantes...</p>";

    panel.classList.remove("oculto");

    panel.scrollIntoView({ behavior: "smooth", block: "start" });

    // Cargar canciones e integrantes en paralelo
    try {

        const [respCanciones, respIntegrantes] = await Promise.all([
            fetch(`${API_URL}/bandas/${id}/canciones`),
            fetch(`${API_URL}/bandas/${id}/integrantes`)
        ]);

        const canciones = await respCanciones.json();
        const integrantes = await respIntegrantes.json();

        // Renderizar canciones
        if (canciones.length === 0) {

            detCanciones.innerHTML = "<p class='sin-datos'>Sin canciones registradas</p>";

        } else {

            detCanciones.innerHTML = canciones.map(c => `
                <div class="detalle-item">
                    <span class="detalle-item-titulo">🎵 ${c.titulo}</span>
                    <span class="detalle-item-meta">${c.album} · ${c.duracion}</span>
                </div>
            `).join("");

        }

        // Renderizar integrantes
        if (integrantes.length === 0) {

            detIntegrantes.innerHTML = "<p class='sin-datos'>Sin integrantes registrados</p>";

        } else {

            detIntegrantes.innerHTML = integrantes.map(i => `
                <div class="detalle-item">
                    <span class="detalle-item-titulo">👤 ${i.nombre}</span>
                    <span class="detalle-item-meta">${i.rol}${i.anio_ingreso ? ' · desde ' + i.anio_ingreso : ''}</span>
                </div>
            `).join("");

        }

    } catch (error) {

        detCanciones.innerHTML = "<p class='sin-datos'>Error al cargar datos</p>";
        detIntegrantes.innerHTML = "<p class='sin-datos'>Error al cargar datos</p>";
        console.error("Error al cargar detalle de banda:", error);

    }

}


function cerrarDetalle() {

    const panel = document.getElementById("detalle-banda");

    panel.classList.add("oculto");

    document.getElementById("input-busqueda").value = "";

}


// =========================
// EDITAR BANDA
// =========================

async function editarBanda(id) {

    const nombre = prompt(
        "Nuevo nombre de la banda:"
    );

    if (nombre === null) {
        return;
    }


    const genero = prompt(
        "Nuevo género:"
    );

    if (genero === null) {
        return;
    }


    const descripcion = prompt(
        "Nueva descripción:"
    );

    if (descripcion === null) {
        return;
    }


    try {

        const respuesta = await fetch(
            `${API_URL}/bandas/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    nombre: nombre,

                    genero: genero,

                    descripcion: descripcion

                })
            }
        );


        const bandaActualizada =
            await respuesta.json();


        console.log(
            "Banda actualizada:",
            bandaActualizada
        );

        mostrarMensaje("Banda actualizada correctamente ✏️");

        await cargarBandas();
        await cargarBandasParaBusqueda();

        // Actualizar selector de bandas

        const selectCancion =
            document.getElementById("banda-cancion");

        selectCancion.innerHTML =
            '<option value="">Selecciona una banda</option>';

        const selectIntegrante =
            document.getElementById("banda-integrante");

        selectIntegrante.innerHTML =
            '<option value="">Selecciona una banda</option>';

        await cargarBandasEnSelects();

        // Actualizar canciones

        await cargarCanciones();
        await cargarIntegrantes();


    } catch (error) {

        console.error(
            "Error al editar la banda:",
            error
        );

    }

}



// =========================
// ELIMINAR BANDA
// =========================

async function eliminarBanda(id) {

    const confirmar = confirm(
        "¿Seguro que quieres eliminar esta banda?"
    );


    if (!confirmar) {
        return;
    }


    try {

        const respuesta = await fetch(
            `${API_URL}/bandas/${id}`,
            {
                method: "DELETE"
            }
        );


        const resultado =
            await respuesta.json();


        console.log(
            "Banda eliminada:",
            resultado
        );

        mostrarMensaje("Banda eliminada correctamente 🗑️");

        await cargarBandas();
        await cargarBandasParaBusqueda();

        // Actualizar selectores de bandas

        const selectCancion =
            document.getElementById("banda-cancion");

        selectCancion.innerHTML =
            '<option value="">Selecciona una banda</option>';

        const selectIntegrante =
            document.getElementById("banda-integrante");

        selectIntegrante.innerHTML =
            '<option value="">Selecciona una banda</option>';

        await cargarBandasEnSelects();

        // Actualizar listas

        await cargarCanciones();
        await cargarIntegrantes();


    } catch (error) {

        console.error(
            "Error al eliminar la banda:",
            error
        );

    }

}



// =========================
// CARGAR BANDAS EN SELECTORES
// =========================

async function cargarBandasEnSelect() {
    await cargarBandasEnSelects();
}

async function cargarBandasEnSelects() {

    try {

        const respuesta = await fetch(
            `${API_URL}/bandas`
        );


        const bandas =
            await respuesta.json();


        const selectCancion =
            document.getElementById("banda-cancion");

        const selectIntegrante =
            document.getElementById("banda-integrante");


        bandas.forEach(banda => {

            const opcionCancion =
                document.createElement("option");

            opcionCancion.value = banda.id;
            opcionCancion.textContent = banda.nombre;
            selectCancion.appendChild(opcionCancion);

            const opcionIntegrante =
                document.createElement("option");

            opcionIntegrante.value = banda.id;
            opcionIntegrante.textContent = banda.nombre;
            selectIntegrante.appendChild(opcionIntegrante);

        });


    } catch (error) {

        console.error(
            "Error al cargar las bandas en los selectores:",
            error
        );

    }

}



// =========================
// CARGAR CANCIONES
// =========================

async function cargarCanciones() {

    try {

        const respuestaCanciones =
            await fetch(
                `${API_URL}/canciones`
            );


        const canciones =
            await respuestaCanciones.json();


        const respuestaBandas =
            await fetch(
                `${API_URL}/bandas`
            );


        const bandas =
            await respuestaBandas.json();


        const lista =
            document.getElementById(
                "lista-canciones"
            );


        lista.innerHTML = "";


        canciones.forEach(cancion => {

            const banda =
                bandas.find(
                    banda =>
                        banda.id ===
                        cancion.banda_id
                );


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.innerHTML = `
                <h3>${cancion.titulo}</h3>

                <p>
                    <strong>Álbum:</strong>
                    ${cancion.album}
                </p>

                <p>
                    <strong>Duración:</strong>
                    ${cancion.duracion}
                </p>

                <p>
                    <strong>Banda:</strong>
                    ${
                        banda
                            ? banda.nombre
                            : "Desconocida"
                    }
                </p>

                <button onclick="editarCancion(${cancion.id})">
                    Editar
                </button>

                <button onclick="eliminarCancion(${cancion.id})">
                    Eliminar
                </button>
            `;


            lista.appendChild(elemento);

        });


    } catch (error) {

        console.error(
            "Error al cargar las canciones:",
            error
        );

    }

}



// =========================
// EDITAR CANCIÓN
// =========================

async function editarCancion(id) {

    const titulo = prompt(
        "Nuevo título de la canción:"
    );

    if (titulo === null) {
        return;
    }


    const album = prompt(
        "Nuevo álbum:"
    );

    if (album === null) {
        return;
    }


    const duracion = prompt(
        "Nueva duración:"
    );

    if (duracion === null) {
        return;
    }


    // Obtener bandas

    const respuestaBandas =
        await fetch(
            `${API_URL}/bandas`
        );


    const bandas =
        await respuestaBandas.json();


    let mensaje =
        "Selecciona la banda escribiendo su ID:\n\n";


    bandas.forEach(banda => {

        mensaje +=
            `${banda.id} - ${banda.nombre}\n`;

    });


    const banda_id =
        prompt(mensaje);


    if (banda_id === null) {
        return;
    }


    try {

        const respuesta = await fetch(
            `${API_URL}/canciones/${id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    titulo: titulo,

                    duracion: duracion,

                    album: album,

                    banda_id:
                        Number(banda_id)

                })

            }
        );


        const cancionActualizada =
            await respuesta.json();


        console.log(
            "Canción actualizada:",
            cancionActualizada
        );

        mostrarMensaje("Canción actualizada correctamente ✏️");

        await cargarCanciones();


    } catch (error) {

        console.error(
            "Error al editar la canción:",
            error
        );

    }

}



// =========================
// ELIMINAR CANCIÓN
// =========================

async function eliminarCancion(id) {

    const confirmar = confirm(
        "¿Seguro que quieres eliminar esta canción?"
    );


    if (!confirmar) {
        return;
    }


    try {

        const respuesta = await fetch(
            `${API_URL}/canciones/${id}`,
            {
                method: "DELETE"
            }
        );


        const resultado =
            await respuesta.json();


        console.log(
            "Canción eliminada:",
            resultado
        );

        mostrarMensaje("Canción eliminada correctamente 🗑️");

        await cargarCanciones();


    } catch (error) {

        console.error(
            "Error al eliminar la canción:",
            error
        );

    }

}


// =========================
// CARGAR INTEGRANTES
// =========================

async function cargarIntegrantes() {

    try {

        const respuestaIntegrantes =
            await fetch(`${API_URL}/integrantes`);

        const integrantes =
            await respuestaIntegrantes.json();

        const respuestaBandas =
            await fetch(`${API_URL}/bandas`);

        const bandas =
            await respuestaBandas.json();

        const lista =
            document.getElementById("lista-integrantes");

        lista.innerHTML = "";

        integrantes.forEach(integrante => {

            const banda =
                bandas.find(b => b.id === integrante.banda_id);

            const elemento =
                document.createElement("div");

            elemento.innerHTML = `
                <h3>${integrante.nombre}</h3>

                <p>
                    <strong>Rol:</strong>
                    ${integrante.rol}
                </p>

                ${integrante.anio_ingreso ? `
                <p>
                    <strong>Año de ingreso:</strong>
                    ${integrante.anio_ingreso}
                </p>` : ""}

                <p>
                    <strong>Banda:</strong>
                    ${banda ? banda.nombre : "Desconocida"}
                </p>

                <button onclick="editarIntegrante(${integrante.id})">
                    Editar
                </button>

                <button onclick="eliminarIntegrante(${integrante.id})">
                    Eliminar
                </button>
            `;

            lista.appendChild(elemento);

        });

    } catch (error) {

        console.error(
            "Error al cargar integrantes:",
            error
        );

    }

}


// =========================
// EDITAR INTEGRANTE
// =========================

async function editarIntegrante(id) {

    const nombre = prompt("Nuevo nombre del integrante:");

    if (nombre === null) return;

    const rol = prompt("Nuevo rol:");

    if (rol === null) return;

    const anioStr = prompt("Nuevo año de ingreso (dejar vacío si no aplica):");

    if (anioStr === null) return;

    const anio_ingreso = anioStr.trim() === "" ? null : Number(anioStr);

    // Obtener bandas
    const respuestaBandas = await fetch(`${API_URL}/bandas`);
    const bandas = await respuestaBandas.json();

    let mensaje = "Selecciona la banda escribiendo su ID:\n\n";
    bandas.forEach(banda => {
        mensaje += `${banda.id} - ${banda.nombre}\n`;
    });

    const banda_id = prompt(mensaje);

    if (banda_id === null) return;

    try {

        const respuesta = await fetch(
            `${API_URL}/integrantes/${id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nombre,
                    rol: rol,
                    anio_ingreso: anio_ingreso,
                    banda_id: Number(banda_id)
                })
            }
        );

        const actualizado = await respuesta.json();

        console.log("Integrante actualizado:", actualizado);

        mostrarMensaje("Integrante actualizado correctamente ✏️");

        await cargarIntegrantes();

    } catch (error) {

        console.error("Error al editar integrante:", error);

    }

}


// =========================
// ELIMINAR INTEGRANTE
// =========================

async function eliminarIntegrante(id) {

    const confirmar = confirm("¿Seguro que quieres eliminar este integrante?");

    if (!confirmar) return;

    try {

        const respuesta = await fetch(
            `${API_URL}/integrantes/${id}`,
            { method: "DELETE" }
        );

        const resultado = await respuesta.json();

        console.log("Integrante eliminado:", resultado);

        mostrarMensaje("Integrante eliminado correctamente 🗑️");

        await cargarIntegrantes();

    } catch (error) {

        console.error("Error al eliminar integrante:", error);

    }

}


// =========================
// FORMULARIO DE BANDAS
// =========================

const formularioBanda =
    document.getElementById(
        "form-banda"
    );


formularioBanda.addEventListener(
    "submit",
    async function(evento) {

        evento.preventDefault();


        const nombre =
            document.getElementById(
                "nombre-banda"
            ).value;


        const genero =
            document.getElementById(
                "genero-banda"
            ).value;


        const descripcion =
            document.getElementById(
                "descripcion-banda"
            ).value;


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/bandas`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            nombre: nombre,

                            genero: genero,

                            descripcion:
                                descripcion

                        })

                    }
                );


            const nuevaBanda =
                await respuesta.json();


            console.log(
                "Banda creada:",
                nuevaBanda
            );


            formularioBanda.reset();

            mostrarMensaje("Banda creada correctamente 🎸");

            await cargarBandas();
            await cargarBandasParaBusqueda();

            // Actualizar selectores

            const selectCancion =
                document.getElementById("banda-cancion");

            selectCancion.innerHTML =
                '<option value="">Selecciona una banda</option>';

            const selectIntegrante =
                document.getElementById("banda-integrante");

            selectIntegrante.innerHTML =
                '<option value="">Selecciona una banda</option>';

            await cargarBandasEnSelects();


        } catch (error) {

            console.error(
                "Error al crear la banda:",
                error
            );

        }

    }
);



// =========================
// FORMULARIO DE CANCIONES
// =========================

const formularioCancion =
    document.getElementById(
        "form-cancion"
    );


formularioCancion.addEventListener(
    "submit",
    async function(evento) {

        evento.preventDefault();


        const titulo =
            document.getElementById(
                "titulo-cancion"
            ).value;


        const album =
            document.getElementById(
                "album-cancion"
            ).value;


        const duracion =
            document.getElementById(
                "duracion-cancion"
            ).value;


        const banda_id =
            document.getElementById(
                "banda-cancion"
            ).value;


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/canciones`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            titulo: titulo,

                            duracion: duracion,

                            album: album,

                            banda_id:
                                Number(banda_id)

                        })

                    }
                );


            const nuevaCancion =
                await respuesta.json();


            console.log(
                "Canción creada:",
                nuevaCancion
            );


            formularioCancion.reset();

            mostrarMensaje("Canción creada correctamente 🎵");

            await cargarCanciones();


        } catch (error) {

            console.error(
                "Error al crear la canción:",
                error
            );

        }

    }
);


// =========================
// FORMULARIO DE INTEGRANTES
// =========================

const formularioIntegrante =
    document.getElementById("form-integrante");

formularioIntegrante.addEventListener(
    "submit",
    async function(evento) {

        evento.preventDefault();

        const nombre =
            document.getElementById("nombre-integrante").value;

        const rol =
            document.getElementById("rol-integrante").value;

        const anioStr =
            document.getElementById("anio-integrante").value;

        const anio_ingreso =
            anioStr.trim() === "" ? null : Number(anioStr);

        const banda_id =
            document.getElementById("banda-integrante").value;

        try {

            const respuesta = await fetch(
                `${API_URL}/integrantes`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre: nombre,
                        rol: rol,
                        anio_ingreso: anio_ingreso,
                        banda_id: Number(banda_id)
                    })
                }
            );

            const nuevoIntegrante = await respuesta.json();

            console.log("Integrante creado:", nuevoIntegrante);

            formularioIntegrante.reset();

            mostrarMensaje("Integrante agregado correctamente 👤");

            await cargarIntegrantes();

        } catch (error) {

            console.error("Error al crear integrante:", error);

        }

    }
);


// =========================
// STATS DEL HERO
// =========================

async function actualizarStats() {

    try {

        const [resBandas, resCanciones, resIntegrantes] = await Promise.all([
            fetch(`${API_URL}/bandas`),
            fetch(`${API_URL}/canciones`),
            fetch(`${API_URL}/integrantes`)
        ]);

        const bandas      = await resBandas.json();
        const canciones   = await resCanciones.json();
        const integrantes = await resIntegrantes.json();

        const animarNum = (el, destino) => {
            let actual = 0;
            const paso = Math.ceil(destino / 25);
            const intervalo = setInterval(() => {
                actual = Math.min(actual + paso, destino);
                el.textContent = actual;
                if (actual >= destino) clearInterval(intervalo);
            }, 40);
        };

        const elBandas      = document.getElementById("stat-bandas");
        const elCanciones   = document.getElementById("stat-canciones");
        const elIntegrantes = document.getElementById("stat-integrantes");

        if (elBandas)      animarNum(elBandas,      bandas.length);
        if (elCanciones)   animarNum(elCanciones,   canciones.length);
        if (elIntegrantes) animarNum(elIntegrantes, integrantes.length);

    } catch (e) {
        console.error("Error al cargar stats:", e);
    }

}


// =========================
// INICIAR APLICACIÓN
// =========================

cargarBandas();
cargarCanciones();
cargarBandasEnSelects();
cargarBandasParaBusqueda();
cargarIntegrantes();
actualizarStats();

