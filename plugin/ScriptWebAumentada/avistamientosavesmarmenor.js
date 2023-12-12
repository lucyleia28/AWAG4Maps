// ==UserScript==
// @name         Avistamientos de aves en el mar Menor
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Introduce un mapa con los avistamientos de aves registrados en el mar Menor. También muestra datos abiertos sobre el estado del agua de la laguna.
// @author       Paula González Martínez
// @match        https://es.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @license      GPL-3.0-or-later
// @resource     leaflet_css https://unpkg.com/leaflet@1.7.1/dist/leaflet.css
// @resource     legend_css https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/Leaflet.Legend-master/src/leaflet.legend.css
// @resource     own_css https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/styles.css
// @resource     markercluster_css https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/Leaflet.markercluster-1.4.1/dist/MarkerCluster.css
// @resource     markerclusterdefault_css https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/Leaflet.markercluster-1.4.1/dist/MarkerCluster.Defaults.css
// @require      https://unpkg.com/leaflet@1.7.1/dist/leaflet.js
// @require      https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/echarts.min.js
// @require      https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/Leaflet.Legend-master/src/leaflet.legend.js
// @require      https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/heatmap.js-2.0.5/build/heatmap.js
// @require      https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/heatmap.js-2.0.5/plugins/leaflet-heatmap/leaflet-heatmap.js
// @require      https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/Leaflet.markercluster-1.4.1/dist/leaflet.markercluster.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_addElement
// ==/UserScript==

// CSS

// Cargar mi propio CSS
cargarCSS("own_css");
// Cargar LeafletCSS
cargarCSS("leaflet_css");
// Cargar Legend CSS
cargarCSS("legend_css");
// Cargar MarkerCluster CSS
cargarCSS("markerclusterdefault_css");
cargarCSS("markercluster_css");
// ----------------------------------------------------------------------------------------------------------------------------

// JAVASCRIPT

// Cargar Leaflet
loadScript("https://unpkg.com/leaflet@1.7.1/dist/leaflet.js");
// Cargar plugin Heatmap
loadScript("https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/heatmap.js-2.0.5/build/heatmap.js");
loadScript("https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/heatmap.js-2.0.5/plugins/leaflet-heatmap/leaflet-heatmap.js");
// Cargar plugin MarkerCluster
loadScript("https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/Leaflet.markercluster-1.4.1/dist/leaflet.markercluster.js");
// Cargar libreria Echarts
loadScript("https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/echarts.min.js");
// Cargar plugin Leyenda
loadScript("https://raw.githubusercontent.com/lucyleia28/AvistamientosAvesMarMenor/main/Leaflet.Legend-master/src/leaflet.legend.js");
// ----------------------------------------------------------------------------------------------------------------------------

// VALORES GENERALES

// Ruta pagina actual
var pathname = window.location.pathname;
// Listado especies que mostraran la informacion del mapa
const lista_pathname = ["/wiki/Larus_genei", "/wiki/Tadorna_tadorna", "/wiki/Anas_platyrhynchos", "/wiki/Podiceps_cristatus", "/wiki/Gallinula_chloropus", "/wiki/Himantopus_himantopus", "/wiki/Pluvialis_squatarola", "/wiki/Charadrius_alexandrinus", "/wiki/Charadrius_hiaticula", "/wiki/Charadrius_dubius", "/wiki/Arenaria_interpres", "/wiki/Calidris_ferruginea", "/wiki/Calidris_alba", "/wiki/Calidris_alpina", "/wiki/Calidris_minuta", "/wiki/Tringa_nebularia", "/wiki/Tringa_totanus", "/wiki/Chroicocephalus_genei", "/wiki/Chroicocephalus_ridibundus", "/wiki/Larus_michahellis", "/wiki/Sternula_albifrons", "/wiki/Hydroprogne_caspia", "/wiki/Sterna_hirundo", "/wiki/Ardea_cinerea", "/wiki/Ardea_alba", "/wiki/Egretta_garzetta", "/wiki/Apus_apus", "/wiki/Cecropis_daurica", "/wiki/Delichon_urbicum", "/wiki/Oenanthe_oenanthe", "/wiki/Columba_livia", "/wiki/Streptopelia_decaocto", "/wiki/Apus_pallidus", "/wiki/Thalasseus_sandvicensis", "/wiki/Phalacrocorax_carbo", "/wiki/Gulosus_aristotelis", "/wiki/Hirundo_rustica", "/wiki/Curruca_melanocephala", "/wiki/Sturnus_unicolor", "/wiki/Turdus_merula", "/wiki/Erithacus_rubecula", "/wiki/Passer_domesticus", "/wiki/Motacilla_alba", "/wiki/Emberiza_calandra", "/wiki/Phoenicopterus_roseus", "/wiki/Recurvirostra_avosetta", "/wiki/Galerida_cristata", "/wiki/Columba_palumbus", "/wiki/Falco_tinnunculus", "/wiki/Lanius_senator", "/wiki/Galerida_theklae", "/wiki/Phylloscopus_bonelli", "/wiki/Ficedula_hypoleuca", "/wiki/Chloris_chloris", "/wiki/Linaria_cannabina", "/wiki/Burhinus_oedicnemus", "/wiki/Ichthyaetus_audouinii", "/wiki/Myiopsitta_monachus", "/wiki/Cisticola_juncidis", "/wiki/Serinus_serinus", "/wiki/Alectoris_rufa", "/wiki/Streptopelia_turtur", "/wiki/Platalea_leucorodia", "/wiki/Merops_apiaster", "/wiki/Phylloscopus_trochilus", "/wiki/Curruca_iberiae", "/wiki/Muscicapa_striata", "/wiki/Actitis_hypoleucos", "/wiki/Ciconia_ciconia", "/wiki/Curruca_communis", "/wiki/Carduelis_carduelis", "/wiki/Tringa_glareola", "/wiki/Phoenicurus_phoenicurus", "/wiki/Gelochelidon_nilotica", "/wiki/Upupa_epops", "/wiki/Calandrella_brachydactyla", "/wiki/Alauda_arvensis", "/wiki/Cettia_cetti", "/wiki/Bubulcus_ibis", "/wiki/Parus_major", "/wiki/Acrocephalus_schoenobaenus", "/wiki/Sturnus_vulgaris", "/wiki/Calidris_pugnax", "/wiki/Haematopus_ostralegus", "/wiki/Circus_aeruginosus", "/wiki/Glareola_pratincola", "/wiki/Numenius_phaeopus", "/wiki/Nycticorax_nycticorax", "/wiki/Apus_melba", "/wiki/Ardeola_ralloides", "/wiki/Plegadis_falcinellus", "/wiki/Calidris_temminckii", "/wiki/Circus_pygargus", "/wiki/Saxicola_rubicola", "/wiki/Aythya_ferina", "/wiki/Ardea_purpurea", "/wiki/Acrocephalus_scirpaceus", "/wiki/Chlidonias_niger", "/wiki/Ixobrychus_minutus", "/wiki/Pica_pica", "/wiki/Corvus_monedula", "/wiki/Acrocephalus_arundinaceus", "/wiki/Luscinia_megarhynchos", "/wiki/Curruca_undata", "/wiki/Spatula_clypeata", "/wiki/Numenius_arquata", "/wiki/Falco_naumanni", "/wiki/Fulica_atra", "/wiki/Lanius_meridionalis", "/wiki/Chlidonias_hybrida", "/wiki/Motacilla_flava", "/wiki/Tringa_ochropus"];
const marMenor_pathname = "/wiki/Mar_Menor";

// Comprueba que la ruta de la pagina actual este dentro del array de rutas afectadas
if (lista_pathname.includes(pathname)) {
    let mapContainer = crearContenedorMapaLateral();
    crearMapa("especifico", mapContainer);
}
else if(pathname.includes(marMenor_pathname)){
    let mapContainer = crearContenedorMapaGeneral();
    crearMapa("general", mapContainer);
}

// ----------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------FUNCIONES------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------

// Cargar archivos/ficheros

// Cargar css
function cargarCSS(string){
    const css = GM_getResourceText(string);
    GM_addStyle(css);
}
// Cargar javascript
function loadScript(scriptURL) {
    'use strict';
    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    }
    return new Promise(function(resolve){
        httpGetAsync(scriptURL, function(response){
            var s = document.createElement("script");
            s.text = response;
            document.getElementsByTagName("head")[0].appendChild(s);
            resolve();
        });
    });

}
// ----------------------------------------------------------------------------------------------------------------------------

// Mapas general y especificos

// Crear mapa (funcion principal)
async function crearMapa(tipo, mapContainer){
    // Vista inicial de mi mapa: N, W, y el zoom o altura
    let zoom = 11;
    if (tipo == "general") {
        zoom = 11.5;
    }
    let map = L.map('map').setView([37.7325, -0.7790], zoom);

    // Capa con el mapa base de openstreetmap que se le anyade a map
    let base = addLayerBase(map);

    // Agregar area Mar Menor con el punto donde está la boya
    let area = addLayerArea(map);

    // Agregar escala
    let escala = addLayerEscala(map);

    // MarkerCluster
    var markers = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            var childCount = cluster.getChildCount();
            var c = 'marker-cluster marker-cluster-';
            if (childCount > 0 && childCount <= 2) {
                c += 'smallest';
            } else if (childCount > 2 && childCount <= 5) {
                c += 'smaller';
            } else if (childCount > 5 && childCount <= 10) {
                c += 'normal';
            } else if (childCount > 10 && childCount <= 15) {
                c += 'big';
            } else if (childCount > 15) {
                c += 'max';
            }
            return new L.DivIcon({
                html: '<div><span>' + childCount + '</span></div>',
                className: c,
                style: 'border: solid 2px rgba(0, 0, 0, 0.4y);',
                iconSize: new L.Point(40, 40)
            });
        }
    });


    // Guia numero de avistamientos
    addRegistros();

    // Llamar a las funciones para mostrar las graficas con los botones del estado del agua
    llamarGetEstadoMar();

    // Listado de codigos de las zonas de avistamientos en el Mar Menor
    let regionCode = ["L5237105", "L5157229", "L5485879", "L4652966", "L4548723", "L5246392", "L5610561", "L6773140", "L5170203", "L5287538", "L5171766", "L5170186", "L19816002", "L19829303"];

    // Periodo observaciones
    let periodoObservacion = document.querySelector('input[name="periodo"]:checked').value;

    // Agregar evento cambiar fecha
    let periodo = document.getElementsByName("periodo");
    // Obtener listados de aves y zonas
    const listadoAves = document.getElementById("listadoAves");
    let listadoZonas = "";
    let mapaCalor = document.getElementById("mapaCalor");

    switch (tipo) {
        case "especifico":
            var speciesName = getNombreEspecie();
            getAves(map, markers, regionCode, periodoObservacion, speciesName);
            setListadoZonas(map, markers, regionCode, periodoObservacion, speciesName);
            // Agregar un controlador de eventos de cambio a cada radio
            for (var i = 0; i < periodo.length; i++) {
                periodo[i].addEventListener("change", function() {
                    // Obtener el valor del radio seleccionado
                    var selectedValue = document.querySelector('input[name="periodo"]:checked').value;
                    // Llamar a la función actualizarFecha() con el valor seleccionado como parámetro
                    actualizarFecha(map, markers, regionCode, selectedValue, "especifico");
                    deseleccionarMapaCalor(map);
                });
            }
            // Agregar evento a las casillas Listado Zonas
            listadoZonas = document.getElementById("listadoZonasLateral");
            listadoZonas.addEventListener("change", function(event) {
                if (event.target.classList.contains("check_zonas")) {
                    actualizarMarcadores(map, markers, regionCode, document.querySelector('input[name="periodo"]:checked').value, "zonas-especificas");
                }
            });
            // Agregar mapa de calor
            mapaCalor.addEventListener("change", function() {
                if (this.checked) {
                    addMapaCalor(map, markers, regionCode, document.querySelector('input[name="periodo"]:checked').value, "especifico");
                } else {
                    deseleccionarMapaCalor(map);
                }
            });
            break;
        case "general":
            obtenerObservaciones(map, markers, regionCode, periodoObservacion);
            setListados(map, markers, regionCode, periodoObservacion, "aves-zonas");
            // Agregar evento a las casillas Listado Aves
            listadoAves.addEventListener("change", function(event) {
                if (event.target.classList.contains("check_aves")) {
                    actualizarMarcadores(map, markers, regionCode, document.querySelector('input[name="periodo"]:checked').value, "aves");
                }
            });
            // Agregar evento a las casillas Listado Zonas
            listadoZonas = document.getElementById("listadoZonas");
            listadoZonas.addEventListener("change", function(event) {
                if (event.target.classList.contains("check_zonas")) {
                    actualizarMarcadores(map, markers, regionCode, document.querySelector('input[name="periodo"]:checked').value, "zonas");
                }
            });
            // Agregar un controlador de eventos de cambio a cada radio
            for (var j = 0; j < periodo.length; j++) {
                periodo[j].addEventListener("change", function() {
                    // Obtener el valor del radio seleccionado
                    var selectedValue = document.querySelector('input[name="periodo"]:checked').value;
                    // Llamar a la función actualizarFecha() con el valor seleccionado como parámetro
                    actualizarFecha(map, markers, regionCode, selectedValue, "general");
                    deseleccionarMapaCalor(map);
                });
            }
            // Agregar mapa de calor
            mapaCalor.addEventListener("change", function() {
                if (this.checked) {
                    addMapaCalor(map, markers, regionCode, document.querySelector('input[name="periodo"]:checked').value, "general");
                } else {
                    deseleccionarMapaCalor(map);
                }
            });
            break;
        default:
            console.log("ERROR");
    }

    // Se anyade el mapa al contenedor
    mapContainer.insertAdjacentHTML("afterbegin", map);
}
function crearContenedorMapaLateral(){
    const infobox = document.getElementsByClassName("infobox")[0];

    let body = infobox.firstChild;
    let filas = body.childNodes;
    let ultimo = filas[filas.length-1];

    // Titulo nueva fila
    var hilera_titulo = document.createElement("tr");
    hilera_titulo.innerHTML = '<th colspan="3" style="text-align:center;background-color: #FF9800;"><a href="https://es.wikipedia.org/wiki/Mar_Menor" style="color: #2C2C2C; text-decoration: none;" title="Avistamientos mar Menor">Avistamientos en el mar Menor</a></th>';
    body.insertBefore(hilera_titulo, ultimo); // Inserto el enlace al mapa antes del ultimo elemento
    // Cuerpo nueva fila
    var hilera_enlace = document.createElement("tr");
    hilera_enlace.innerHTML = '<th colspan="3"><a href="https://es.wikipedia.org/wiki/Mar_Menor" title="Enlace al mar Menor">Ver mar Menor</a></th>';
    body.insertBefore(hilera_enlace, ultimo);

    // Insertar mapa
    let mapContainer = document.createElement("div");
    mapContainer.id = "map";
    mapContainer.style = "height: 35em; width: 25em";

    hilera_enlace.firstChild.appendChild(mapContainer);
    // Informacion mapa
    let infoContainer = document.createElement("div");
    infoContainer.id = "infoLateral";
    /*let infoElements = document.createElement("div");
    infoElements.id = "infoLateralElements";*/
    infoContainer.innerHTML = `<h3>Zonas de avistamientos</h3>
                               <div id="listadoZonasLateral"></div>
                               <h3>Fecha avistamientos</h3>
                               <div id="contenedorBotones">
                                   <input type="radio" id="fechaHoy" class="fecha" name="periodo" value="hoy"/>
                                   <label for="fechaHoy" class="boton">Hoy</label>
                                   <input type="radio" id="fechaSemana" class="fecha" name="periodo" value="semana" checked />
                                   <label for="fechaSemana" class="boton">Última semana</label>
                                   <input type="radio" id="fechaMes" class="fecha" name="periodo" value="mes" />
                                   <label for="fechaMes" class="boton">Último mes</label>
                               </div>
                               <h3>Número de avistamientos</h3>
                               <div id="listadoAvistamientos"></div>
                               <input id="mapaCalor" type="checkbox" name="calor" style="margin-bottom: 20px;"/> Mostrar mapa de calor
                               <h3>Estado del agua</h3>
                               <p> Consulta las gráficas sobre el estado del agua </p>
                               <div id="botonesGraficasLateral">
                                   <button class="estadoAgua" value="temperatura">Temperatura</button>
                                   <button class="estadoAgua" value="oxigeno">Oxígeno</button>
                                   <button class="estadoAgua" value="salinidad">Salinidad</button>
                                   <button class="estadoAgua" value="turbidez">Turbidez</button>
                                   <button class="estadoAgua" value="transparencia">Transparencia</button>
                                   <button class="estadoAgua" value="clorofila">Clorofila</button>
                               </div>`;

    // Modal para graficas
    let modal = document.createElement("div");
    modal.id = "grafica";

    hilera_enlace.firstChild.appendChild(modal);
    hilera_enlace.firstChild.appendChild(infoContainer);

    return mapContainer;
}

function crearContenedorMapaGeneral(){
    /*----------ARREGLO TRAS LA ACTUALIZACIÓN DEL FORMATO DE WIKIPEDIA----------*/
    // Obtener todos los elementos h2 en la página
    const h2Elementos = document.getElementsByTagName('h2');
    // Seleccionar el primer elemento h2 de la lista
    const primerElementoH2 = h2Elementos[1];
    // Crear un nuevo elemento
    const seccion_avistamientos = document.createElement("div");
    seccion_avistamientos.id = "seccion_avistamientos";
    // Insertar el nuevo elemento justo antes del primer h2
    primerElementoH2.parentNode.insertBefore(seccion_avistamientos, primerElementoH2);
    /*--------------------------------------------------------------------------*/
    // Insertar titulo
    let title = document.createElement("h2");
    title.innerHTML = '<span class="mw-headline" id="Avistamientos">Avistamiento de aves en el Mar Menor</span><span class="mw-editsection"></span>';
    // Insertar mapa
    let mapContainer = document.createElement("div");
    mapContainer.id = "map";
    // Informacion mapa
    let infoContainer = document.createElement("div");
    infoContainer.id = "info";
    let infoElements = document.createElement("div");
    infoElements.id = "infoElements";
    infoElements.innerHTML = `<h3>Zonas de avistamientos</h3>
                               <div id="listadoZonas"></div>
                               <h3>Especies avistadas</h3>
                               <div id="listadoAves"></div>
                               <h3>Fecha avistamientos</h3>
                               <div id="contenedorBotones">
                                   <input type="radio" id="fechaHoy" class="fecha" name="periodo" value="hoy"/>
                                   <label for="fechaHoy" class="boton">Hoy</label>
                                   <input type="radio" id="fechaSemana" class="fecha" name="periodo" value="semana" checked />
                                   <label for="fechaSemana" class="boton">Última semana</label>
                                   <input type="radio" id="fechaMes" class="fecha" name="periodo" value="mes" />
                                   <label for="fechaMes" class="boton">Último mes</label>
                               </div>
                               <h3>Número de avistamientos</h3>
                               <div id="listadoAvistamientos"></div>
                               <input id="mapaCalor" type="checkbox" name="calor" style="margin-bottom: 20px;"/> Mostrar mapa de calor
                               <h3>Estado del agua</h3>
                               <p> Consulta las gráficas sobre el estado del agua </p>
                               <div id="botonesGraficas">
                                   <button class="estadoAgua" value="temperatura">Temperatura</button>
                                   <button class="estadoAgua" value="oxigeno">Oxígeno</button>
                                   <button class="estadoAgua" value="salinidad">Salinidad</button>
                                   <button class="estadoAgua" value="turbidez">Turbidez</button>
                                   <button class="estadoAgua" value="transparencia">Transparencia</button>
                                   <button class="estadoAgua" value="clorofila">Clorofila</button>
                               </div>`;
    infoContainer.appendChild(infoElements);
    // Div para mapa general
    let mapaGeneral = document.createElement("div");
    mapaGeneral.id = "mapaGeneral";
    mapaGeneral.appendChild(mapContainer);
    mapaGeneral.appendChild(infoContainer);
    // Div para informacion avistamientos
    let info = document.createElement("div");
    info.id = "infoUbicacion";
    // Modal para graficas
    let modal = document.createElement("div");
    modal.id = "grafica";

    let seccion = document.getElementById("seccion_avistamientos");
    seccion.appendChild(title);
    seccion.appendChild(mapaGeneral);
    seccion.appendChild(info);
    seccion.appendChild(modal);

    return mapContainer
}
// ----------------------------------------------------------------------------------------------------------------------------

// Listados con los datos de los avistamientos

// Agregar listados de aves
async function setListados(map, markers, regionCode, date, type) {
    var data = await obtenerObservacionesInfo(map, markers, regionCode, date);
    var species = [];
    var regions = [];
    switch (type) {
        case "aves-zonas":
            species = [];
            regions = [];
            data.forEach(observation => {
                var idSpecies = observation.sciName.replace(" ", "").toLowerCase();
                if(!species.includes(idSpecies) && observation.howMany > 0){
                    species.push(idSpecies);
                    document.getElementById("listadoAves").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idSpecies}" name="aves" class="check_aves" \> ${observation.sciName}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
                var idRegion = observation.locId.toLowerCase();
                if(!regions.includes(idRegion) && observation.howMany > 0){
                    regions.push(idRegion);
                    document.getElementById("listadoZonas").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idRegion}" name="zonas" class="check_zonas" \> ${observation.locName}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
            });
            if (regions.length < 1 && species.length < 1) {
                document.getElementById("listadoZonas").innerHTML = `<label>No se han registrado observaciones en esta fecha</label>`;
                document.getElementById("listadoAves").innerHTML = `<label>No se han registrado observaciones en esta fecha</label>`;
            }
            break;
        case "aves":
            species = [];
            data.forEach(observation => {
                var idSpecies = observation.sciName.replace(" ", "").toLowerCase();
                if(!species.includes(idSpecies) && observation.howMany > 0){
                    species.push(idSpecies);
                    document.getElementById("listadoAves").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idSpecies}" name="aves" class="check_aves" \> ${observation.sciName}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
            });
            if (species.length < 1) {
                document.getElementById("listadoAves").innerHTML = `<label>No se han registrado observaciones en esta fecha</label>`;
            }
            break;
        case "zonas":
            regions = [];
            data.forEach(observation => {
                var idRegion = observation.locId.toLowerCase();
                if(!regions.includes(idRegion) && observation.howMany > 0){
                    regions.push(idRegion);
                    document.getElementById("listadoZonas").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idRegion}" name="zonas" class="check_zonas" \> ${observation.locName}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
            });
            if (regions.length < 1) {
                document.getElementById("listadoZonas").innerHTML = `<label>No se han registrado observaciones en esta fecha</label>`;
            }
            break;
    }
}
// Agregar listados de zonas
async function setListadoZonas(map, markers, regionCode, date, speciesName) {
    var regions = [];
    var data = await obtenerObservacionesInfo(map, markers, regionCode, date);
    data.forEach(observation => {
        // Comprueba que sea la misma especie que la pasada por parámetro y que hayan avistamientos
        if(observation.sciName.toLowerCase() === speciesName.toLowerCase() && observation.howMany > 0){
            var idRegion = observation.locId.toLowerCase();
            if(!regions.includes(idRegion)){
                regions.push(idRegion);
                document.getElementById("listadoZonasLateral").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idRegion}" name="zonas" class="check_zonas" \> ${observation.locName}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
            }
        }
    });
    if (regions.length < 1) {
        document.getElementById("listadoZonasLateral").innerHTML = `<label>No se han registrado observaciones en esta fecha</label>`;
    }

}
// ----------------------------------------------------------------------------------------------------------------------------

// Informacion nombres y fecha

// Obtener el nombre de una especie
function getNombreEspecie(){
    const valorEspecie = window.location.pathname.split("/")[2].split("_");
    const nombreEspecie = valorEspecie[0] + " " + valorEspecie[1];
    return nombreEspecie;
}
// Formato habitual fecha
function formatoFecha(date) {
    let fecha = date.split(" ")[0];
    return fecha.split("-")[2] + "/" + fecha.split("-")[1] + "/" + fecha.split("-")[0];
}
// Actualizar la fecha de los avistamientos
async function actualizarFecha(map, markers, regionCode, date, type) {
    switch (type) {
        case "general":
            markers.clearLayers();
            document.getElementById("listadoAves").innerHTML = "";
            document.getElementById("listadoZonas").innerHTML = "";
            await obtenerObservaciones(map, markers, regionCode, date);
            setListados(map, markers, regionCode, date, "aves-zonas");
            break;
        case "especifico":
            var speciesName = getNombreEspecie();
            markers.clearLayers();
            document.getElementById("listadoZonasLateral").innerHTML = "";
            getAves(map, markers, regionCode, date, speciesName);
            setListadoZonas(map, markers, regionCode, date, speciesName);
            break;
    }
}
// ----------------------------------------------------------------------------------------------------------------------------

// Dibujar mapa

// Dibujar marcadores
async function actualizarMarcadores(map, markers, regionCode, date, type) {
    // Obtener especies seleccionadas
    var especiesSeleccionadas = Array.from(document.querySelectorAll('input.check_aves:checked'))
    .map((checkbox) => checkbox.id);
    var zonasSeleccionadas = Array.from(document.querySelectorAll('input.check_zonas:checked'))
    .map((checkbox) => checkbox.id);

    if (especiesSeleccionadas.length > 0 && zonasSeleccionadas.length > 0) {
        type = "zonas-aves";
    } else if (especiesSeleccionadas.length < 1 && zonasSeleccionadas.length < 1 && type != "zonas-especificas") {
        type = "limpiar";
    }

    switch (type) {
        case "aves":
            var dataAves = await obtenerObservacionesInfo(map, markers, regionCode, date);
            var regionCodes = [];
            var speciesIds = [];

            if (especiesSeleccionadas.length > 0) {
                // Limpiar los marcadores existentes
                markers.clearLayers();
                // Recorrer las especies seleccionadas y agregar sus observaciones correspondientes
                dataAves.forEach(observation => {
                    for (const especieSeleccionada of especiesSeleccionadas) {
                        if (observation.sciName.toLowerCase().replace(" ", "") === especieSeleccionada && observation.howMany > 0) {
                            if (!speciesIds.includes(observation.sciName)) {
                                speciesIds.push(observation.sciName);
                            }
                            if (!regionCodes.includes(observation.locId) && speciesIds.includes(observation.sciName)) {
                                regionCodes.push(observation.locId);
                            }
                        }
                    }
                });
                // Agregar evento a las casillas Listado Aves
                document.getElementById("listadoZonas").innerHTML = "";
                for (var i=0; i<speciesIds.length; i++) {
                    getAves(map, markers, regionCodes, date, speciesIds[i]);
                }
                setListados(map, markers, regionCodes, date, "zonas");
            } else {
                markers.clearLayers();
                actualizarMarcadores(map, markers, regionCode, date, "zonas");
            }
            break;
        case "zonas":
            var dataZonas = await obtenerObservacionesInfo(map, markers, regionCode, date);
            var regionCodeIds = [];

            if (zonasSeleccionadas.length > 0) {
                // Limpiar los marcadores existentes
                markers.clearLayers();
                // Recorrer las especies seleccionadas y agregar sus observaciones correspondientes
                dataZonas.forEach(observation => {
                    for (const zonaSeleccionada of zonasSeleccionadas) {
                        if (observation.locId.toLowerCase() === zonaSeleccionada && observation.howMany > 0) {
                            if (!regionCodeIds.includes(observation.locId)) {
                                regionCodeIds.push(observation.locId);
                            }
                        }
                    }
                });
                // Agregar evento a las casillas Listado Aves
                document.getElementById("listadoAves").innerHTML = "";
                await obtenerObservaciones(map, markers, regionCodeIds, date);
                setListados(map, markers, regionCodeIds, date, "aves");
            } else {
                markers.clearLayers();
                actualizarMarcadores(map, markers, regionCode, date, "aves");
            }
            break;
        case "zonas-especificas":
            var zonasSeleccionadasEspe = Array.from(document.querySelectorAll("input.check_zonas:checked"))
            .map((checkbox) => checkbox.id);
            var dataZonasEspe = await obtenerObservacionesInfo(map, markers, regionCode, date);
            var regionCodeIdsEspe = [];
            var speciesName = getNombreEspecie();

            if (zonasSeleccionadasEspe.length > 0) {
                // Limpiar los marcadores existentes
                markers.clearLayers();
                // Recorrer las especies seleccionadas y agregar sus observaciones correspondientes
                dataZonasEspe.forEach(observation => {
                    for (const zonaSeleccionadaEspe of zonasSeleccionadasEspe) {
                        if (observation.locId.toLowerCase() === zonaSeleccionadaEspe && observation.howMany > 0) {
                            if (!regionCodeIdsEspe.includes(observation.locId)) {
                                regionCodeIdsEspe.push(observation.locId);
                            }
                        }
                    }
                });
                getAves(map, markers, regionCodeIdsEspe, date, speciesName);
            } else {
                markers.clearLayers();
                getAves(map, markers, regionCode, date, speciesName);
            }
            break;
        case "zonas-aves":
            var data = await obtenerObservacionesInfo(map, markers, regionCode, date);
            var regions = [];
            // Limpiar los marcadores existentes
            markers.clearLayers();
            // Recorrer las especies seleccionadas y agregar sus observaciones correspondientes
            data.forEach(observation => {
                for (const zonaSeleccionada of zonasSeleccionadas) {
                    for (const especieSeleccionada of especiesSeleccionadas) {
                        if (observation.locId.toLowerCase() === zonaSeleccionada && observation.sciName.toLowerCase().replace(" ", "") === especieSeleccionada && observation.howMany > 0) {
                            addLayerPunto(map, markers, observation);
                        }
                    }
                }
            });
            break;
        case "limpiar":
            markers.clearLayers();
            document.getElementById("listadoAves").innerHTML = "";
            document.getElementById("listadoZonas").innerHTML = "";
            await obtenerObservaciones(map, markers, regionCode, date);
            setListados(map, markers, regionCode, date, "aves");
            setListados(map, markers, regionCode, date, "aves-zonas");
            break;
    }
}
// Dibujar el mapa base de Leaflet
function addLayerBase(map){
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
}
// Dibujar el area del mar menor
function addLayerArea(map){
    // Agregar capa con el area del mar Menor
    fetch("https://raw.githubusercontent.com/lucyleia28/marmenor.github.io/main/areaMarMenor.json")
        .then(res => res.json())
        .then(response => {
        var marMenor = response;
        var marMenorJS = L.geoJson(marMenor).addTo(map);

        // Agregar leyenda Interactiva (Si se pone aquí se controla si se dibuja o no al seleccionarlo en la leyenda)
        let leyenda = addLayerLeyenda(map, marMenorJS, marMenor);
    });
}
// Dibujar puntos de observaciones
function addLayerPunto(map, markers, observation){
    // Agregar puntos de avistamientos
    let color = "";
    let url = "";
    if(observation.howMany <= 2){
        color = "#8F9CA0";
        url = "";
    }
    else if(observation.howMany > 2 && observation.howMany <= 5){
        color = "#C7E466";
        url = "";
    }
    else if(observation.howMany > 5 && observation.howMany <= 10){
        color = "#FAC500";
        url = "";
    }
    else if(observation.howMany > 10 && observation.howMany <= 15){
        color = "#E57701";
        url = "";
    }
    else if(observation.howMany > 15){
        color = "#E33B15";
        url = "";
    }
    else{
        color = "black";
        url = "";
    }
    var puntoObservacion = L.circleMarker(L.latLng(observation.lat, observation.lng), {
        radius: 8,
        fillColor: color,
        color: "black",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
    });
    var popupContent = "";
    if (pathname.includes(marMenor_pathname)) { // General
        popupContent += "<strong>Especie:</strong> " + observation.sciName + "<br>" +
            "<strong>Fecha último avistamiento:</strong> " + formatoFecha(observation.obsDt) + "<br>" +
            "<strong>Cantidad de aves:</strong> " + observation.howMany + "<br>" +
            "<strong>Ubicación:</strong> " + observation.locName + "<br>" +
            "<strong>Coordenadas:</strong> <br> Latitud: " + observation.lat + ", Longitud: " + observation.lng + "<br>" +
            "<strong>Enlace:</strong> <a href='https://es.wikipedia.org/wiki/" + observation.sciName.split(" ")[0]+"_"+observation.sciName.split(" ")[1] + "' target='_blank'>Ver en Wikipedia</a>";
    } else { // Especifico
        popupContent += "<strong>Fecha último avistamiento:</strong> " + formatoFecha(observation.obsDt) + "<br>" +
            "<strong>Cantidad de aves:</strong> " + observation.howMany + "<br>" +
            "<strong>Ubicación:</strong> " + observation.locName + "<br>" +
            "<strong>Coordenadas:</strong> <br> Latitud: " + observation.lat + ", Longitud: " + observation.lng;
    }
    puntoObservacion.bindPopup(popupContent);

    puntoObservacion.on("click", function() {
        puntoObservacion.openPopup();
    });

    markers.addLayer(puntoObservacion);
    map.addLayer(markers);
}
// Dibujar la escala del mapa
function addLayerEscala(map){
    var escala = new L.control.scale({ imperial: false, position: "bottomright" }).addTo(map);
    return escala;
}
// Dibujar la leyenda del mapa
function addLayerLeyenda(map, marMenorJS, marMenor){
    // Agregar la leyenda
    var leyenda = new L.control.Legend({
        id: "leyenda",
        title: "Leyenda",
        position: "topright",
        collapsed: false,
        symbolWidth: 24,
        opacity: 1,
        column: 1,
        legends: [{
            label: "Mar Menor",
            type: "rectangle",
            color: "#0074f0",
            fillColor: "#009ff0",
            weight: 2,
            layers: marMenorJS,
            marMenor
        }]
    }).addTo(map);

    // Agregar la ID "leyenda" al elemento HTML de la leyenda
    leyenda._container.setAttribute("id", "leyenda");
    return leyenda;
}
// Agregar la guia de colores por numero de avistamientos
function addRegistros() {
    document.getElementById("listadoAvistamientos").innerHTML += `<div class="avistamiento">
                                                                      <div class="avistamientoItem rojo"></div>
                                                                      <div class="avistamientoLabel">
                                                                          <div class="avistamientoTitulo">15+</div>
                                                                      </div>
                                                                  </div>

                                                                  <div class="avistamiento">
                                                                      <div class="avistamientoItem naranja"></div>
                                                                      <div class="avistamientoLabel">
                                                                          <div class="avistamientoTitulo">10 - 15</div>
                                                                      </div>
                                                                  </div>

                                                                  <div class="avistamiento">
                                                                      <div class="avistamientoItem amarillo"></div>
                                                                      <div class="avistamientoLabel">
                                                                          <div class="avistamientoTitulo">5 - 10</div>
                                                                      </div>
                                                                  </div>

                                                                  <div class="avistamiento">
                                                                      <div class="avistamientoItem verde"></div>
                                                                      <div class="avistamientoLabel">
                                                                          <div class="avistamientoTitulo">2 - 5</div>
                                                                      </div>
                                                                  </div>

                                                                  <div class="avistamiento">
                                                                      <div class="avistamientoItem gris"></div>
                                                                      <div class="avistamientoLabel">
                                                                          <div class="avistamientoTitulo">1 - 2</div>
                                                                      </div>
                                                                  </div>`;

}
// ----------------------------------------------------------------------------------------------------------------------------

// Mapa de calor

// Desdibujar el mapa de calor al deseleccionarlo
function deseleccionarMapaCalor(map) {
    document.getElementById("mapaCalor").checked = false;
    map.eachLayer(function(layer) {
        if (layer instanceof HeatmapOverlay) {
            map.removeLayer(layer);
        }
    });
}
// Obtener las coordenadas de los lugares del mapa para representar el mapa de calor
async function getCoordenadasMapaCalor(map, markers, regionCode, date, type) {
    var data = await obtenerObservacionesInfo(map, markers, regionCode, date);
    // Recorrer las especies seleccionadas y agregar sus observaciones correspondientes
    const total = {};
    switch (type) {
        case "especifico":
            var speciesName = getNombreEspecie();
            data.forEach(observation => {
                for (const region of regionCode) {
                    if (observation.sciName === speciesName && observation.locId === region && observation.howMany > 0) {
                        if (!total[region]) {
                            total[region] = { total: 0, coordenadas: { lat: observation.lat, lng: observation.lng } };
                        } else {
                            total[region].coordenadas.lat = observation.lat;
                            total[region].coordenadas.lng = observation.lng;
                        }
                        total[region].total += observation.howMany;
                    }
                }
            });
            break;
        case "general":
            data.forEach(observation => {
                for (const region of regionCode) {
                    if (observation.locId === region && observation.howMany > 0) {
                        if (!total[region]) {
                            total[region] = { total: 0, coordenadas: { lat: observation.lat, lng: observation.lng } };
                        } else {
                            total[region].coordenadas.lat = observation.lat;
                            total[region].coordenadas.lng = observation.lng;
                        }
                        total[region].total += observation.howMany;
                    }
                }
            });
            break;
    }
    return total;
}
// Dibujar mapa de calor
async function addMapaCalor(map, markers, regionCode, date, type) {
    const totalCoordenadas = await getCoordenadasMapaCalor(map, markers, regionCode, date, type);
    let data = [];

    for (const coordenada in totalCoordenadas) {
        data.push({lat: totalCoordenadas[coordenada].coordenadas.lat, lng: totalCoordenadas[coordenada].coordenadas.lng, count: totalCoordenadas[coordenada].total});
    }

    var coordenadas = {
        max: 200,
        min: 0,
        data: data,
        length: 11
    };
    var config = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        "radius": 0.03,
        "maxOpacity": .8,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'count'
    };
    var heatmapLayer = new HeatmapOverlay(config);
    heatmapLayer.setData(coordenadas);
    heatmapLayer.addTo(map);
}
// ----------------------------------------------------------------------------------------------------------------------------

// Obtener avistamientos de aves

// Obtener la URL segun la fecha para hacer las peticiones
function getEbirdUrl(date, regionCode) {
    let url = "";
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; // El +1 es porque los meses empiezan en 0
    const anyo = fechaActual.getFullYear();

    switch (date) {
        case "hoy":
            url = `https://api.ebird.org/v2/data/obs/${regionCode}/recent?back=1`; //historic/${anyo}/${mes}/${dia}
            break;
        case "mes":
            url = `https://api.ebird.org/v2/data/obs/${regionCode}/recent`;
            break;
        case "semana":
            url = `https://api.ebird.org/v2/data/obs/${regionCode}/recent?back=7`;
            break;
    }

    return url;
}
// Obtener y dibujar las observaciones de las aves de todas las especies (funcion intermedia)
async function obtenerObservaciones(map, markers, regionCode, date) {
    return new Promise((resolve, reject) => {
        getAllAves(map, markers, regionCode, date)
            .then(observations => {
            resolve(observations);
        })
            .catch(error => {
            reject(error);
        });
    });
}
// Obtener las observaciones de las aves de todas las especies (funcion intermedia)
async function obtenerObservacionesInfo(map, markers, regionCode, date) {
    return new Promise((resolve, reject) => {
        getAllAvesInfo(map, markers, regionCode, date)
            .then(observations => {
            resolve(observations);
        })
            .catch(error => {
            reject(error);
        });
    });
}
// Obtener y dibujar avistamientos de una especie en específico
function getAves(map, markers, regionCodes, date, speciesName){
    var myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", "so7u5sv82cup");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // Hago la peticion fetch una vez por cada ubicacion del array regionCode
    for (let i = 0; i < regionCodes.length; i++) {
        const regionCode = regionCodes[i];
        let url = getEbirdUrl(date, regionCode);

        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
            var data = JSON.parse(result);
            data.forEach(observation => {
                // Comprueba que sea la misma especie que la pasada por parámetro y que hayan avistamientos
                if(observation.sciName.toLowerCase() === speciesName.toLowerCase() && observation.howMany > 0){
                    addLayerPunto(map, markers, observation);
                }
            });
        })
            .catch(error => console.log('error', error));
    }
}
// Obtener y dibujar avistamientos de todas las especies
function getAllAves(map, markers, regionCodes, date) {
    var myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", "so7u5sv82cup");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // Objeto para almacenar los avistamientos
    const allObservations = {};

    // Hago la peticion fetch una vez por cada ubicacion del array regionCode
    const fetchObservations = (regionCode) => {
        let url = getEbirdUrl(date, regionCode);
        return fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
            var data = JSON.parse(result);
            data.forEach(observation => {
                // Comprueba que hayan habido avistamientos en la ubicacion
                if (observation.howMany > 0) {
                    // Agrega la observación al objeto allObservations
                    if (!allObservations[observation.sciName]) {
                        allObservations[observation.sciName] = {};
                    }
                    if (!allObservations[observation.sciName][regionCode]) {
                        allObservations[observation.sciName][regionCode] = "";
                    }
                    allObservations[observation.sciName][regionCode] += observation.howMany + "," + observation.locName;

                    addLayerPunto(map, markers, observation);
                }
            });
        })
            .catch(error => console.log('error', error));
    };

    const fetchPromises = regionCodes.map(fetchObservations);
    return Promise.all(fetchPromises).then(() => allObservations);
}
// Obtener la informacion de los avistamientos de todas las especies
function getAllAvesInfo(map, markers, regionCodes, date) {
    var myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", "so7u5sv82cup");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const fetchObservations = (regionCode) => {
        let url = getEbirdUrl(date, regionCode);
        return fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => JSON.parse(result))
            .catch(error => console.log('error', error));
    };

    const fetchPromises = regionCodes.map(fetchObservations); // Array de objetos que representan los datos de avistamientos de aves para cada ubicación en el array regionCodes.
    return Promise.all(fetchPromises).then(data => data.flat()); // para que los datos obtenidos de la API se aplanen en un solo arreglo
}
// ----------------------------------------------------------------------------------------------------------------------------

// Obtener datos abiertos sobre el estado del Mar Menor

// Llamar a la funcion getEstadoMar al pulsar uno de los botones. Esta funcion se crea porque no funciona esto otro: <button class="estadoAgua" onclick="getEstadoMar('temperatura')">Temperatura</button>
function llamarGetEstadoMar(){
    const botones = document.getElementsByClassName("estadoAgua");
    for (let i=0; i<botones.length; i++) {
        botones[i].addEventListener('click', async function() {
            await getEstadoMar(botones[i].value);
        });
    }
}
// Una primera llamada para obtener el total de records para obtener todos los datos registrados
async function getTotalRecords(id) {
    const response = await fetch("https://datosabiertos.regiondemurcia.es/catalogo/api/action/datastore_search?resource_id=" + id);
    const data = await response.json();
    const totalRecords = data.result.total;
    return totalRecords;
}
// Obtener array de datos por parametro
async function getEstadoMar(parameter) {
    let totalRecords = "";
    let response = "";
    let data = "";
    let results = "";
    switch (parameter) {
        case "temperatura":
            totalRecords = await getTotalRecords("dbafcaf1-820c-4fee-9209-e7dd10560a8b");
            response = await fetch("https://datosabiertos.regiondemurcia.es/catalogo/api/action/datastore_search?resource_id=dbafcaf1-820c-4fee-9209-e7dd10560a8b&limit=" + totalRecords);
            data = await response.json();
            results = data.result.records;
            break;
        case "oxigeno":
            totalRecords = await getTotalRecords("bd3c2fd1-c1dc-41ec-906b-34bc5ff33f98");
            response = await fetch("https://datosabiertos.regiondemurcia.es/catalogo/api/action/datastore_search?resource_id=bd3c2fd1-c1dc-41ec-906b-34bc5ff33f98&limit=" + totalRecords);
            data = await response.json();
            results = data.result.records;
            break;
        case "salinidad":
            totalRecords = await getTotalRecords("194638ff-adcd-4980-99a1-1be3b8b7030d");
            response = await fetch("https://datosabiertos.regiondemurcia.es/catalogo/api/action/datastore_search?resource_id=194638ff-adcd-4980-99a1-1be3b8b7030d&limit=" + totalRecords);
            data = await response.json();
            results = data.result.records;
            break;
        case "turbidez":
            totalRecords = await getTotalRecords("c6824049-7bad-4128-9cc0-ab099af17009");
            response = await fetch("https://datosabiertos.regiondemurcia.es/catalogo/api/action/datastore_search?resource_id=c6824049-7bad-4128-9cc0-ab099af17009&limit=" + totalRecords);
            data = await response.json();
            results = data.result.records;
            break;
        case "transparencia":
            totalRecords = await getTotalRecords("93de5a09-aea4-4897-91f7-f79a4d39394a");
            response = await fetch("https://datosabiertos.regiondemurcia.es/catalogo/api/action/datastore_search?resource_id=93de5a09-aea4-4897-91f7-f79a4d39394a&limit=" + totalRecords);
            data = await response.json();
            results = data.result.records;
            break;
        case "clorofila":
            totalRecords = await getTotalRecords("2125cefc-7e9a-44a3-8086-1815e33750f9");
            response = await fetch("https://datosabiertos.regiondemurcia.es/catalogo/api/action/datastore_search?resource_id=2125cefc-7e9a-44a3-8086-1815e33750f9&limit=" + totalRecords);
            data = await response.json();
            results = data.result.records;
            break;
    }
    showMensajeModal(results, parameter);
}
// Mostrar mensaje modal para las graficas
function showMensajeModal(values, parameter) {
    if (parameter == "oxigeno") {
        parameter = "oxígeno";
    }
    document.getElementById("grafica").innerHTML = `<div id="modalVentana" class="modal">
                                                        <div class="modalContenido">
                                                            <span class="modalCerrar">&times;</span>
                                                            <h2>Gráfica con los niveles de ${parameter}</h2>
                                                            <div id="graficaContenido" style="width:700px;height:400px;margin-top:20px;margin-bottom:20px;"></div>
                                                            <a id="datosAbiertos" href="https://datosabiertos.regiondemurcia.es/" target="_blank">Datos abiertos Región de Murcia</a>
                                                        </div>
                                                    </div>`;
    // Ventana modal
    var modal = document.getElementById("modalVentana");
    modal.style.display = "block";

    // Hace referencia al elemento <span> que tiene la X que cierra la ventana
    var span = document.getElementsByClassName("modalCerrar")[0];
    // Si el usuario hace clic en la x, la ventana se cierra
    span.addEventListener("click", function() {
        modal.style.display = "none";
    });
    // Si el usuario hace clic fuera de la ventana, se cierra.
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    addGrafica(values, parameter);
}
// Dibujar grafica
function addGrafica(values, parameter) {
    // Se crea un array con las fechas, otro con las medias y otro con las desviaciones
    // El método map() itera sobre cada elemento del array original y aplica una función a cada uno de ellos.
    // En este caso, la función que se aplica a cada elemento del array original es una función flecha que simplemente extrae el valor de una propiedad del objeto y lo añade a un nuevo array.
    const fechas = values.map(d => d.Fecha.split("T")[0]);
    const medias = values.map(d => d.Medias);
    const desviaciones = values.map(d => d.Desviaciones);
    // Se obtiene el elemento donde se introduce la grafica
    const grafica = echarts.init(document.getElementById("graficaContenido"));
    // Se configura la grafica
    const option = {
        title: {
            text: 'Parámetros físico-químicos-biológicos del Mar Menor: ' + parameter,
            subtext: 'Fuente: Comunidad Autónoma de la Región de Murcia'
        },
        grid: {
            top: '25%' // ajusta este valor según necesites,
        },
        tooltip: {},
        legend: {
            data: ['Media', 'Desviación'],
            top: 'bottom'
        },
        xAxis: {
            type: 'category',
            data: fechas
        },
        yAxis: [{
            type: 'value',
            name: 'Temperatura (°C)',
        }, {
            type: 'value',
            name: 'Desviación (°C)',
        }],
        series: [{
            data: medias,
            type: 'line',
            name: 'Media',
            smooth: true,
            yAxisIndex: 0,
        }, {
            data: desviaciones,
            type: 'line',
            name: 'Desviación',
            smooth: true,
            yAxisIndex: 1,
        }]
    };

    grafica.setOption(option);
}
// ----------------------------------------------------------------------------------------------------------------------------
