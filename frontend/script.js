const API_URL = (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost")
    ? "http://127.0.0.1:8000/api"
    : "https://music-manager-api.onrender.com/api";

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


        // Actualizar selector de bandas

        const select =
            document.getElementById(
                "banda-cancion"
            );


        select.innerHTML =
            '<option value="">Selecciona una banda</option>';


        await cargarBandasEnSelect();


        // Actualizar canciones

        await cargarCanciones();


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


        // Actualizar selector de bandas

        const select =
            document.getElementById(
                "banda-cancion"
            );


        select.innerHTML =
            '<option value="">Selecciona una banda</option>';


        await cargarBandasEnSelect();


        // Actualizar canciones

        await cargarCanciones();


    } catch (error) {

        console.error(
            "Error al eliminar la banda:",
            error
        );

    }

}



// =========================
// CARGAR BANDAS EN SELECTOR
// =========================

async function cargarBandasEnSelect() {

    try {

        const respuesta = await fetch(
            `${API_URL}/bandas`
        );


        const bandas =
            await respuesta.json();


        const select =
            document.getElementById(
                "banda-cancion"
            );


        bandas.forEach(banda => {

            const opcion =
                document.createElement(
                    "option"
                );


            opcion.value = banda.id;


            opcion.textContent =
                banda.nombre;


            select.appendChild(opcion);

        });


    } catch (error) {

        console.error(
            "Error al cargar las bandas en el selector:",
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


            // Actualizar selector

            const select =
                document.getElementById(
                    "banda-cancion"
                );


            select.innerHTML =
                '<option value="">Selecciona una banda</option>';


            await cargarBandasEnSelect();


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
// INICIAR APLICACIÓN
// =========================

cargarBandas();

cargarCanciones();

cargarBandasEnSelect();