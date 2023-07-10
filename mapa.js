var preguntas = {
    museo: [
        {
            pregunta: "¿Cuanto es 1 + 1?",
            opciones: ["2", "3", "1"],
            respuestaCorrecta: 0,
            puntos: 10,
            color: "green"
        },
        {
            pregunta: "¿8 * 8?",
            opciones: ["16", "72", "64"],
            respuestaCorrecta: 2,
            puntos: 10,

        }
    ],
    biblioteca: [
        {
            pregunta: "¿2 + 2?",
            opciones: ["0", "4", "8"],
            respuestaCorrecta: 1,
            puntos: 10,
            color: "green"
        },
        {
            pregunta: "¿2 * 2?",
            opciones: ["4", "5", "8"],
            respuestaCorrecta: 0,
            puntos: 10,
            
        }
    ]
    ,miCasa: [
        {
            pregunta: "¿6 - 2?",
            opciones: ["0", "4", "8"],
            respuestaCorrecta: 1,
            puntos: 10,
            color: "green"
        },
        {
            pregunta: "¿3 * 3?",
            opciones: ["9", "5", "8"],
            respuestaCorrecta: 0,
            puntos: 10,
            
        }
    ]
};

// Agrega variables para otros lugares si los tienes

var museoMarker;
var bibliotecaMarker;
var miCasaMarker;
var ruta;
var coordenadasMiUbicacion; // Variable para almacenar las coordenadas de tu ubicación actual
var lugarActual;
var indicePreguntaActual = 0;
var puntosTotales = 0;
var preguntasRespondidas = {};
// Obtener el botón para mostrar/ocultar el modal
var btnMostrarModal = document.getElementById("btnMostrarModal");

// Agregar un controlador de eventos al botón
btnMostrarModal.addEventListener("click", function() {
    btnMostrarModal.style.display = "none";
    var modal = document.getElementById("preguntaModal");
    modal.style.display = "block";
});

// Coordenadas de mi casa
var coordenadasMiCasa = {
     
    latitud: -31.9816,
    longitud: -60.92925
};

// Coordenadas del museo y la biblioteca
var coordenadasMuseo = {
    latitud: -31.97287,
    longitud: -60.91662
};

var coordenadasBiblioteca = {
    latitud: -31.97437,
    longitud: -60.91544
};

// Variable global para el mapa
var myMap;


// Inicializar el mapa cuando la página haya cargado
document.addEventListener("DOMContentLoaded", function() {
    // Crear el mapa
    myMap = L.map('map').setView([coordenadasMuseo.latitud, coordenadasMuseo.longitud], 13);

    // Agregar el mapa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    // Agregar el marcador de la biblioteca
    museoMarker = L.marker([coordenadasMuseo.latitud, coordenadasMuseo.longitud]).addTo(myMap)
    .bindPopup('Museo');

    bibliotecaMarker = L.marker([coordenadasBiblioteca.latitud, coordenadasBiblioteca.longitud]).addTo(myMap)
    .bindPopup('Biblioteca');

    miCasaMarker = L.marker([coordenadasMiCasa.latitud, coordenadasMiCasa.longitud]).addTo(myMap)
    .bindPopup('Mi Casa');

    

    // Crear el botón de ubicación
    
  
  // Agregar un controlador de eventos al botón de ubicación
  var btnUbicacion = document.getElementById("btnUbicacion");
  btnUbicacion.addEventListener("click", obtenerUbicacion);

    // Iniciar cuestionario
    obtenerUbicacion();
    
});
function obtenerUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(verificarUbicacion);
    } else {
        alert("Geolocalización no es soportada por tu navegador.");
    }
}

function verificarUbicacion(posicion) {
    var latitud = posicion.coords.latitude;
    var longitud = posicion.coords.longitude;

    // Comparar las coordenadas con las del museo con una tolerancia de 0.0001 (aproximadamente 11 metros)
    if (Math.abs(latitud - coordenadasMuseo.latitud) <= 0.0002 && Math.abs(longitud - coordenadasMuseo.longitud) <= 0.0002) {
        lugarActual = "museo";
    }
    // Comparar las coordenadas con las de la biblioteca con una tolerancia de 0.0001 (aproximadamente 11 metros)
    else if (Math.abs(latitud - coordenadasBiblioteca.latitud) <= 0.0001 && Math.abs(longitud - coordenadasBiblioteca.longitud) <= 0.0001) {
        lugarActual = "biblioteca";
    }
    // Comparar las coordenadas con las de la casa con una tolerancia de 0.0001 (aproximadamente 11 metros)
    else if (Math.abs(latitud - coordenadasMiCasa.latitud) <= 0.0001 && Math.abs(longitud - coordenadasMiCasa.longitud) <= 0.0001) {
        lugarActual = "miCasa";
    }

    if (lugarActual === "museo" || lugarActual === "biblioteca" || lugarActual === "miCasa") {
        var btnMostrarModal = document.getElementById("btnMostrarModal");
        btnMostrarModal.style.display = "block";
    } else {
        var btnMostrarModal = document.getElementById("btnMostrarModal");
        btnMostrarModal.style.display = "none";
        //cartel card de que tengo que ir a un lugar
        var card = document.getElementById("cardAlert");
        card.style.display = "block";
        var btnOk = document.getElementById("btnOk");
        btnOk.addEventListener("click", function(){
        card.style.display = "none";
    });
    }
    coordenadasMiUbicacion = {
        latitud: latitud,
        longitud: longitud
      };
    if (lugarActual && preguntas[lugarActual] && preguntas[lugarActual].length > 0) {
        indicePreguntaActual = 0; // Reiniciar el índice de pregunta actual
        puntosTotales = 0; // Reiniciar los puntos totales
        mostrarPregunta();
    } else {
        var puntosElemento = document.getElementById("puntos");
        puntosElemento.innerHTML = "Puntos totales: " + puntosTotales;
    }

    // Crear un marcador en la ubicación actual y agregarlo al mapa
    L.marker([latitud, longitud]).addTo(myMap)
        .bindPopup('Tu ubicación actual').openPopup();

    // Centrar el mapa en la ubicación actual
    myMap.setView([latitud, longitud], 16);
}





function responder() {
    var opciones = document.getElementsByName("opcion");
    var opcionSeleccionada = null;

    for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].checked) {
            opcionSeleccionada = opciones[i].value;
            break;
        }
    }

    if (opcionSeleccionada === null) {
        alert("Por favor, selecciona una opción.");
        return;
    }

    var preguntaActual = preguntas[lugarActual][indicePreguntaActual];
    var respcorrecta = document.getElementById("correcta");
    if (parseInt(opcionSeleccionada) === preguntaActual.respuestaCorrecta) {
        puntosTotales += preguntaActual.puntos;
        respcorrecta.style.display = "block";
    } else {
        respcorrecta.style.display = "block";
        respcorrecta.innerHTML = "Incorrecta"
    }

   // Eliminar los marcadores de todos los lugares
if (lugarActual === "museo") {
    myMap.removeLayer(museoMarker);
} else if (lugarActual === "biblioteca") {
    myMap.removeLayer(bibliotecaMarker);
} else if (lugarActual === "miCasa") {
    myMap.removeLayer(miCasaMarker);
}

    

    // Marcar la pregunta como respondida
    if (!preguntasRespondidas[lugarActual]) {
        preguntasRespondidas[lugarActual] = {};
    }
    preguntasRespondidas[lugarActual][indicePreguntaActual] = true;

    // Verificar si quedan más preguntas sin responder en el lugar actual
    var preguntasSinResponder = preguntas[lugarActual].filter(function(pregunta, index) {
        return !preguntasRespondidas[lugarActual][index];
    });

    if (preguntasSinResponder.length > 0) {
        // Hay más preguntas sin responder, mostrar la siguiente pregunta
        indicePreguntaActual++;
        mostrarPregunta();
    } else {
        // No hay más preguntas sin responder en este lugar
        var puntosElemento = document.getElementById("puntos");
        puntosElemento.innerHTML = "Puntos totales: " + puntosTotales;

        // Cerrar el modal de pregunta
        var modal = document.getElementById("preguntaModal");
        modal.style.display = "none";
        btnMostrarModal.style.display = "none";
        var cardSiguiente = document.getElementById("cardSiguiente");
        cardSiguiente.style.display = "block";

    }
}

function mostrarPregunta() {
    var preguntaElemento = document.getElementById("pregunta");
    var opcionesElemento = document.getElementById("opciones");
    var btnResponder = document.getElementById("btnresp");
    var mensajeRespuesta = document.getElementById("mensajeRespuesta");
    var respcorrecta = document.getElementById("correcta");
    var preguntaActual = preguntas[lugarActual][indicePreguntaActual];

    if (preguntasRespondidas[lugarActual] && Object.keys(preguntasRespondidas[lugarActual]).length === preguntas[lugarActual].length) {
        preguntaElemento.style.display = "none";
        opcionesElemento.style.display = "none";
        btnResponder.style.display = "none";
        mensajeRespuesta.style.display = "block";
        respcorrecta.style.display = "none";
    } else {
        preguntaElemento.style.display = "block";
        opcionesElemento.style.display = "block";
        btnResponder.style.display = "block";
        mensajeRespuesta.style.display = "none";

        preguntaActual.pregunta = preguntaActual.pregunta.replace("x", "&times;");
        preguntaElemento.innerHTML = preguntaActual.pregunta;

        opcionesElemento.innerHTML = "";

        var opcionesHTML = "";
        for (var i = 0; i < preguntaActual.opciones.length; i++) {
            opcionesHTML += "<input type='radio' name='opcion' value='" + i + "'>" + preguntaActual.opciones[i] + "<br>";
        }
        opcionesElemento.innerHTML = opcionesHTML;
    }
}





function toggleMap() {
    var mapContainer = document.getElementById("map");

    if (mapContainer.style.display === "none") {
        mapContainer.style.display = "block";
    } else {
        mapContainer.style.display = "none";
    }
}

// Cerrar el modal de pregunta al hacer clic en la "x"
var closeBtn = document.getElementsByClassName("close")[0];
closeBtn.addEventListener("click", function() {
    var modal = document.getElementById("preguntaModal");
    modal.style.display = "none";
   


    var btnSiguiente = document.getElementById("btnSiguiente");
    btnSiguiente.addEventListener("click", function(){
        card.style.display = "none";})
});

// Obtener la lista de lugares que faltan
var lugaresFaltantes = Object.keys(preguntas).filter(function(lugar) {
    return !preguntasRespondidas[lugar];
  });
  
  // Obtener el elemento select del destino
  var destinoSelect = document.getElementById("destinoSelect");
  
  // Agregar las opciones de los lugares que faltan al elemento select
  lugaresFaltantes.forEach(function(lugar) {
    var option = document.createElement("option");
    option.value = lugar;
    option.text = lugar;
    destinoSelect.appendChild(option);
  });
  
  // Obtener el botón para ir al destino
  var btnIrDestino = document.getElementById("btnIrDestino");
  
  // Agregar un controlador de eventos al botón de ir al destino
  btnIrDestino.addEventListener("click", function() {
    var destinoSeleccionado = destinoSelect.value;
    
    if (destinoSeleccionado) {
      // Realizar acciones con el destino seleccionado
      console.log("Destino seleccionado:", destinoSeleccionado);
      
      // Obtener las coordenadas del destino seleccionado
      var coordenadasDestino = obtenerCoordenadasDestino(destinoSeleccionado);
      
      // Mostrar la ruta en el mapa o realizar otras acciones con las coordenadas del destino
      mostrarRuta(coordenadasDestino);
    }
  });
// Función para mostrar la ruta en el mapa
function mostrarRuta(coordenadasDestino) {
    // Eliminar la ruta anterior si existe
    if (ruta) {
      myMap.removeControl(ruta);
    }
  
    // Crear el objeto de ruta con las coordenadas de origen y destino
    ruta = L.Routing.control({
      waypoints: [
        L.latLng(coordenadasMiUbicacion.latitud, coordenadasMiUbicacion.longitud), // Coordenadas de origen (tu ubicación actual)
        L.latLng(coordenadasDestino.latitud, coordenadasDestino.longitud) // Coordenadas del destino seleccionado
      ],
      routeWhileDragging: true,
      draggableWaypoints: false,
      showAlternatives: true,
      language: 'es',
      geocoder: L.Control.Geocoder.nominatim()
    }).addTo(myMap);
  }
  
  
  
  // Función para obtener las coordenadas del destino seleccionado
  function obtenerCoordenadasDestino(destino) {
    var coordenadasDestino;
    
    if (destino === "museo") {
      coordenadasDestino = coordenadasMuseo;
    } else if (destino === "biblioteca") {
      coordenadasDestino = coordenadasBiblioteca;
    } else if (destino === "miCasa") {
      coordenadasDestino = coordenadasMiCasa;
    }
    
    return coordenadasDestino;
  }
  

