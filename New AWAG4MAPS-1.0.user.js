// ==UserScript==
// @name         New AWAG4MAPS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Introduce un mapa con los avistamientos de aves registrados en el mar Menor. También muestra datos abiertos sobre el estado del agua de la laguna.
// @author       Paula González Martínez
// @match        https://es.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @license      GPL-3.0-or-later
// @resource     leaflet_css https://unpkg.com/leaflet@1.7.1/dist/leaflet.css
// @resource     legend_css https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/Leaflet.Legend-master/src/leaflet.legend.css
// @resource     own_css https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/styles.css
// @resource     markercluster_css https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/Leaflet.markercluster-1.4.1/dist/MarkerCluster.css
// @resource     markerclusterdefault_css https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/Leaflet.markercluster-1.4.1/dist/MarkerCluster.Defaults.css
// @require      https://unpkg.com/leaflet@1.7.1/dist/leaflet.js
// @require      https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/echarts.min.js
// @require      https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/Leaflet.Legend-master/src/leaflet.legend.js
// @require      https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/heatmap.js-2.0.5/build/heatmap.js
// @require      https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/heatmap.js-2.0.5/plugins/leaflet-heatmap/leaflet-heatmap.js
// @require      https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/Leaflet.markercluster-1.4.1/dist/leaflet.markercluster.js
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
loadScript("https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/heatmap.js-2.0.5/build/heatmap.js");
loadScript("https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/heatmap.js-2.0.5/plugins/leaflet-heatmap/leaflet-heatmap.js");
// Cargar plugin MarkerCluster
loadScript("https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/Leaflet.markercluster-1.4.1/dist/leaflet.markercluster.js");
// Cargar libreria Echarts
loadScript("https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/echarts.min.js");
// Cargar plugin Leyenda
loadScript("https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/Leaflet.Legend-master/src/leaflet.legend.js");
// ----------------------------------------------------------------------------------------------------------------------------

// VALORES GENERALES

// Ruta pagina actual
var pathname = window.location.pathname;
// Listado especies que mostraran la informacion del mapa
// Cambiar para que lo haga automático
const lista_pathname = ["/wiki/Larus_genei", "/wiki/Tachybaptus_ruficollis", "/wiki/Pandion_haliaetus", "/wiki/Tadorna_tadorna", "/wiki/Anas_platyrhynchos", "/wiki/Podiceps_cristatus", "/wiki/Podiceps_nigricollis", "/wiki/Gallinula_chloropus", "/wiki/Himantopus_himantopus", "/wiki/Pluvialis_squatarola", "/wiki/Charadrius_alexandrinus", "/wiki/Charadrius_hiaticula", "/wiki/Charadrius_dubius", "/wiki/Arenaria_interpres", "/wiki/Calidris_ferruginea", "/wiki/Calidris_alba", "/wiki/Calidris_alpina", "/wiki/Calidris_minuta", "/wiki/Tringa_nebularia", "/wiki/Tringa_totanus", "/wiki/Chroicocephalus_genei", "/wiki/Chroicocephalus_ridibundus", "/wiki/Larus_michahellis", "/wiki/Sternula_albifrons", "/wiki/Hydroprogne_caspia", "/wiki/Sterna_hirundo", "/wiki/Ardea_cinerea", "/wiki/Ardea_alba", "/wiki/Egretta_garzetta", "/wiki/Apus_apus", "/wiki/Cecropis_daurica", "/wiki/Delichon_urbicum", "/wiki/Oenanthe_oenanthe", "/wiki/Columba_livia", "/wiki/Streptopelia_decaocto", "/wiki/Apus_pallidus", "/wiki/Thalasseus_sandvicensis", "/wiki/Phalacrocorax_carbo", "/wiki/Gulosus_aristotelis", "/wiki/Hirundo_rustica", "/wiki/Curruca_melanocephala", "/wiki/Sturnus_unicolor", "/wiki/Turdus_merula", "/wiki/Erithacus_rubecula", "/wiki/Passer_domesticus", "/wiki/Motacilla_alba", "/wiki/Emberiza_calandra", "/wiki/Phoenicopterus_roseus", "/wiki/Recurvirostra_avosetta", "/wiki/Galerida_cristata", "/wiki/Columba_palumbus", "/wiki/Falco_tinnunculus", "/wiki/Lanius_senator", "/wiki/Galerida_theklae", "/wiki/Phylloscopus_bonelli", "/wiki/Ficedula_hypoleuca", "/wiki/Chloris_chloris", "/wiki/Linaria_cannabina", "/wiki/Burhinus_oedicnemus", "/wiki/Ichthyaetus_audouinii", "/wiki/Myiopsitta_monachus", "/wiki/Cisticola_juncidis", "/wiki/Serinus_serinus", "/wiki/Alectoris_rufa", "/wiki/Streptopelia_turtur", "/wiki/Platalea_leucorodia", "/wiki/Merops_apiaster", "/wiki/Phylloscopus_trochilus", "/wiki/Curruca_iberiae", "/wiki/Muscicapa_striata", "/wiki/Actitis_hypoleucos", "/wiki/Ciconia_ciconia", "/wiki/Curruca_communis", "/wiki/Carduelis_carduelis", "/wiki/Tringa_glareola", "/wiki/Phoenicurus_phoenicurus", "/wiki/Gelochelidon_nilotica", "/wiki/Upupa_epops", "/wiki/Calandrella_brachydactyla", "/wiki/Alauda_arvensis", "/wiki/Cettia_cetti", "/wiki/Bubulcus_ibis", "/wiki/Parus_major", "/wiki/Acrocephalus_schoenobaenus", "/wiki/Sturnus_vulgaris", "/wiki/Calidris_pugnax", "/wiki/Haematopus_ostralegus", "/wiki/Circus_aeruginosus", "/wiki/Glareola_pratincola", "/wiki/Numenius_phaeopus", "/wiki/Nycticorax_nycticorax", "/wiki/Apus_melba", "/wiki/Ardeola_ralloides", "/wiki/Plegadis_falcinellus", "/wiki/Calidris_temminckii", "/wiki/Circus_pygargus", "/wiki/Saxicola_rubicola", "/wiki/Aythya_ferina", "/wiki/Ardea_purpurea", "/wiki/Acrocephalus_scirpaceus", "/wiki/Chlidonias_niger", "/wiki/Ixobrychus_minutus", "/wiki/Pica_pica", "/wiki/Corvus_monedula", "/wiki/Acrocephalus_arundinaceus", "/wiki/Luscinia_megarhynchos", "/wiki/Curruca_undata", "/wiki/Spatula_clypeata", "/wiki/Numenius_arquata", "/wiki/Falco_naumanni", "/wiki/Fulica_atra", "/wiki/Lanius_meridionalis", "/wiki/Chlidonias_hybrida", "/wiki/Motacilla_flava", "/wiki/Tringa_ochropus"];
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

    // MarkerCluster Sensors
    var markersSensors = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            var childCount = cluster.getChildCount();

            // Estilo CSS para centrar el contenido y hacer un círculo perfecto
            var containerStyle = 'width: 10px; height: 10px;';
            var contentStyle = 'display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; border-radius: 50%; background-color: rgba(0, 0, 0, 0.8); border: solid white;';

            return new L.DivIcon({
                html: '<div style="' + containerStyle + '"><div style="' + contentStyle + '"><span style="margin-top: 50px;">Sensors</span></div></div>',
                className: "sensor",
                iconSize: new L.Point(10, 10)
            });
        }
    });


    // Guia numero de avistamientos
    addRegistros();

    // Listado de codigos de las zonas de avistamientos en el Mar Menor
    // QUitarlo porque ya no lo utiliza, los datos ya están filtrados
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
                    actualizarFecha(map, markers, markersSensors, regionCode, selectedValue, "especifico");
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
            // Agregar sensores
            var layer = "";
            getSensorsInfo(map, markersSensors, periodoObservacion, layer);
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
            getAllAves(map, markers, regionCode, periodoObservacion);
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
                    actualizarFecha(map, markers, markersSensors, regionCode, selectedValue, "general");
                    deseleccionarMapaCalor(map);
                });
            }
            // Agregar sensores
            var layer = "";
            getSensorsInfo(map, markersSensors, periodoObservacion, layer);
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
    hilera_titulo.innerHTML = '<th colspan="3" style="text-align:center;background-color: #FF9800;"><a href="https://es.wikipedia.org/wiki/Mar_Menor" style="color: #2C2C2C; text-decoration: none;" title="Avistamientos mar Menor">Bird watching in the Mar Menor</a></th>';
    body.insertBefore(hilera_titulo, ultimo); // Inserto el enlace al mapa antes del ultimo elemento
    // Cuerpo nueva fila
    var hilera_enlace = document.createElement("tr");
    hilera_enlace.innerHTML = '<th colspan="3"><a href="https://es.wikipedia.org/wiki/Mar_Menor" title="Enlace al mar Menor">See Mar Menor</a></th>';
    body.insertBefore(hilera_enlace, ultimo);

    // Insertar mapa
    let mapContainer = document.createElement("div");
    mapContainer.id = "map";
    mapContainer.style = "height: 35em; width: 25em";

    hilera_enlace.firstChild.appendChild(mapContainer);
    // Informacion mapa
    let infoContainer = document.createElement("div");
    infoContainer.id = "infoLateral";
    infoContainer.innerHTML = `<h3>Sighting areas</h3>
                               <div id="listadoZonasLateral"></div>
                               <h3>Date of sightings</h3>
                               <div id="contenedorBotonesLateral">
                                   <input type="radio" id="fecha2Anyos" class="fecha" name="periodo" value="2anyo"/>
                                   <label for="fecha2Anyos" class="boton">Last 2 years</label>
                                   <input type="radio" id="fecha2Anyo" class="fecha" name="periodo" value="1anyo"/>
                                   <label for="fecha2Anyo" class="boton">Last year</label>
                                   <input type="radio" id="fecha6Meses" class="fecha" name="periodo" value="6meses" checked/>
                                   <label for="fecha6Meses" class="boton">Last 6 months</label>
                               </div>
                               <h3>Number of sightings</h3>
                               <div id="listadoAvistamientos"></div>
                               <input id="mapaCalor" type="checkbox" name="calor" style="margin-bottom: 20px;"/> Show heat map`;

    // Modal para graficas
    let modal = document.createElement("div");
    modal.id = "grafica";

    hilera_enlace.firstChild.appendChild(modal);
    hilera_enlace.firstChild.appendChild(infoContainer);

    return mapContainer;
}

function crearContenedorMapaGeneral(){
    /*----------ARREGLO TRAS LA ACTUALIZACIÓN DEL FORMATO DE WIKIPEDIA 12/2023----------*/
    const pageContainer = document.querySelector(".mw-page-container");
    pageContainer.style.margin = "0 auto";
    pageContainer.style.display = "flex";
    pageContainer.style.width = "100%";
    // Obtener el elemento con la clase y el selector de medios específicos
    var elemento = document.querySelector('.vector-feature-zebra-design-enabled .mw-body');
    if (elemento) {
        // Modificar los estilos según la condición de medios
        if (window.matchMedia("(min-width: 1000px)").matches) {
            // Si la pantalla es igual o mayor a 1000px
            elemento.style.display = 'grid';
            elemento.style.gridTemplate = 'min-content min-content min-content 1fr / minmax(0,129.25rem) min-content';
            elemento.style.gridTemplateAreas = "'titlebar-cx .' 'titlebar columnEnd' 'toolbar columnEnd' 'content columnEnd'";
        } else {
            // Si la pantalla es menor a 1000px
            elemento.style.display = 'grid';
            elemento.style.gridTemplate = 'min-content min-content min-content 1fr / minmax(0,59.25rem) min-content';
            elemento.style.gridTemplateAreas = "'titlebar-cx .' 'titlebar columnEnd' 'toolbar columnEnd' 'content columnEnd'";
        }
    }
    const header = document.querySelector(".vector-header");
    header.style.maxWidth= "100%";
    const body = document.querySelector(".vector-feature-zebra-design-enabled .mw-page-container");
    body.style.maxWidth= "100%";

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
    title.innerHTML = '<span class="mw-headline" id="Avistamientos">Bird watching in the Mar Menor</span><span class="mw-editsection"></span>';
    // Insertar mapa
    let mapContainer = document.createElement("div");
    mapContainer.id = "map";
    // Informacion mapa
    let infoContainer = document.createElement("div");
    infoContainer.id = "info";
    let infoElements = document.createElement("div");
    infoElements.id = "infoElements";
    infoElements.innerHTML = `<h3>Sighting areas</h3>
                               <div id="listadoZonas"></div>
                               <h3>Species sighted</h3>
                               <div id="listadoAves"></div>
                               <h3>Date of sightings</h3>
                               <div id="contenedorBotones">
                                   <input type="radio" id="fecha2Anyos" class="fecha" name="periodo" value="2anyo"/>
                                   <label for="fecha2Anyos" class="boton">Last 2 years</label>
                                   <input type="radio" id="fecha2Anyo" class="fecha" name="periodo" value="1anyo"/>
                                   <label for="fecha2Anyo" class="boton">Last year</label>
                                   <input type="radio" id="fecha6Meses" class="fecha" name="periodo" value="6meses" checked/>
                                   <label for="fecha6Meses" class="boton">Last 6 months</label>
                               </div>
                               <h3>Number of sightings</h3>
                               <div id="listadoAvistamientos"></div>
                               <input id="mapaCalor" type="checkbox" name="calor" style="margin-bottom: 20px;"/> Show heat map`;
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
    var data = await getAllAvesInfo(map, markers, regionCode, date);
    var species = [];
    var regions = [];
    switch (type) {
        case "aves-zonas":
            species = [];
            regions = [];
            data.forEach(observation => {
                var idSpecies = observation.sciname.replace(" ", "").toLowerCase();
                if(!species.includes(idSpecies) && observation.value > 0){
                    species.push(idSpecies);
                    document.getElementById("listadoAves").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idSpecies}" name="aves" class="check_aves" \> ${observation.sciname}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
                var idRegion = observation.idubication.toLowerCase();
                if(!regions.includes(idRegion) && observation.value > 0){
                    regions.push(idRegion);
                    document.getElementById("listadoZonas").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idRegion}" name="zonas" class="check_zonas" \> ${observation.ubication}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
            });
            if (regions.length < 1 && species.length < 1) {
                document.getElementById("listadoZonas").innerHTML = `<label>No observations have been recorded on this date</label>`;
                document.getElementById("listadoAves").innerHTML = `<label>No observations have been recorded on this date</label>`;
            }
            break;
        case "aves":
            species = [];
            data.forEach(observation => {
                var idSpecies = observation.sciname.replace(" ", "").toLowerCase();
                if(!species.includes(idSpecies) && observation.value > 0){
                    species.push(idSpecies);
                    document.getElementById("listadoAves").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idSpecies}" name="aves" class="check_aves" \> ${observation.sciname}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
            });
            if (species.length < 1) {
                document.getElementById("listadoAves").innerHTML = `<label>No observations have been recorded on this date</label>`;
            }
            break;
        case "zonas":
            regions = [];
            data.forEach(observation => {
                var idRegion = observation.idubication.toLowerCase();
                if(!regions.includes(idRegion) && observation.value > 0){
                    regions.push(idRegion);
                    document.getElementById("listadoZonas").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idRegion}" name="zonas" class="check_zonas" \> ${observation.ubication}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
            });
            if (regions.length < 1) {
                document.getElementById("listadoZonas").innerHTML = `<label>No observations have been recorded on this date</label>`;
            }
            break;
    }
}
// Agregar listados de zonas

async function setListadoZonas(map, markers, regionCode, date, speciesName) {
    var regions = [];
    var data = await getAllAvesInfo(map, markers, regionCode, date);
    data.forEach(observation => {
        // Comprueba que sea la misma especie que la pasada por parámetro y que hayan avistamientos
        if(observation.sciname.toLowerCase() === speciesName.toLowerCase() && observation.value > 0){
            var idRegion = observation.idubication.toLowerCase();
            if(!regions.includes(idRegion)){
                regions.push(idRegion);
                document.getElementById("listadoZonasLateral").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idRegion}" name="zonas" class="check_zonas" \> ${observation.ubication}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
            }
        }
    });
    if (regions.length < 1) {
        document.getElementById("listadoZonasLateral").innerHTML = `<label>No observations have been recorded on this date</label>`;
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

async function actualizarFecha(map, markers, markersSensors, regionCode, date, type) {
    markers.clearLayers();
    markersSensors.clearLayers();

    var layer = "";
    getSensorsInfo(map, markersSensors, date, layer);

    switch (type) {
        case "general":
            document.getElementById("listadoAves").innerHTML = "";
            document.getElementById("listadoZonas").innerHTML = "";
            await getAllAves(map, markers, regionCode, date);
            setListados(map, markers, regionCode, date, "aves-zonas");
            break;
        case "especifico":
            var speciesName = getNombreEspecie();
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
            var dataAves = await getAllAvesInfo(map, markers, regionCode, date);
            var regionCodes = [];
            var speciesIds = [];

            if (especiesSeleccionadas.length > 0) {
                // Limpiar los marcadores existentes
                markers.clearLayers();
                // Recorrer las especies seleccionadas y agregar sus observaciones correspondientes
                dataAves.forEach(observation => {
                    for (const especieSeleccionada of especiesSeleccionadas) {
                        if (observation.sciname.toLowerCase().replace(" ", "") === especieSeleccionada && observation.value > 0) {
                            if (!speciesIds.includes(observation.sciname)) {
                                speciesIds.push(observation.sciname);
                            }
                            if (!regionCodes.includes(observation.idubication) && speciesIds.includes(observation.sciname)) {
                                regionCodes.push(observation.idubication);
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
            var dataZonas = await getAllAvesInfo(map, markers, regionCode, date);
            var regionCodeIds = [];

            if (zonasSeleccionadas.length > 0) {
                // Limpiar los marcadores existentes
                markers.clearLayers();
                // Recorrer las especies seleccionadas y agregar sus observaciones correspondientes
                dataZonas.forEach(observation => {
                    for (const zonaSeleccionada of zonasSeleccionadas) {
                        if (observation.idubication.toLowerCase() === zonaSeleccionada && observation.value > 0) {
                            if (!regionCodeIds.includes(observation.idubication)) {
                                regionCodeIds.push(observation.idubication);
                            }
                        }
                    }
                });
                // Agregar evento a las casillas Listado Aves
                document.getElementById("listadoAves").innerHTML = "";
                await getAllAves(map, markers, regionCodeIds, date);
                setListados(map, markers, regionCodeIds, date, "aves");
            } else {
                markers.clearLayers();
                actualizarMarcadores(map, markers, regionCode, date, "aves");
            }
            break;
        case "zonas-especificas":
            var zonasSeleccionadasEspe = Array.from(document.querySelectorAll("input.check_zonas:checked"))
            .map((checkbox) => checkbox.id);
            var dataZonasEspe = await getAllAvesInfo(map, markers, regionCode, date);
            var regionCodeIdsEspe = [];
            var speciesName = getNombreEspecie();

            if (zonasSeleccionadasEspe.length > 0) {
                // Limpiar los marcadores existentes
                markers.clearLayers();
                // Recorrer las especies seleccionadas y agregar sus observaciones correspondientes
                dataZonasEspe.forEach(observation => {
                    for (const zonaSeleccionadaEspe of zonasSeleccionadasEspe) {
                        if (observation.idubication.toLowerCase() === zonaSeleccionadaEspe && observation.value > 0) {
                            if (!regionCodeIdsEspe.includes(observation.idubication)) {
                                regionCodeIdsEspe.push(observation.idubication);
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
            var data = await getAllAvesInfo(map, markers, regionCode, date);
            var regions = [];
            // Limpiar los marcadores existentes
            markers.clearLayers();
            // Recorrer las especies seleccionadas y agregar sus observaciones correspondientes
            data.forEach(observation => {
                for (const zonaSeleccionada of zonasSeleccionadas) {
                    for (const especieSeleccionada of especiesSeleccionadas) {
                        if (observation.idubication.toLowerCase() === zonaSeleccionada && observation.sciname.toLowerCase().replace(" ", "") === especieSeleccionada && observation.value > 0) {
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
            await getAllAves(map, markers, regionCode, date);
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
    if(observation.value <= 2){
        color = "#8F9CA0";
        url = "";
    }
    else if(observation.value > 2 && observation.value <= 5){
        color = "#C7E466";
        url = "";
    }
    else if(observation.value > 5 && observation.value <= 10){
        color = "#FAC500";
        url = "";
    }
    else if(observation.value > 10 && observation.value <= 15){
        color = "#E57701";
        url = "";
    }
    else if(observation.value > 15){
        color = "#E33B15";
        url = "";
    }
    else{
        color = "black";
        url = "";
    }
    var puntoObservacion = L.circleMarker(L.latLng(observation.lat, observation.long), {
        radius: 8,
        fillColor: color,
        color: "black",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
    });
    var popupContent = "";
    if (pathname.includes(marMenor_pathname)) { // General
        popupContent += "<strong>Species:</strong> " + observation.sciname + "<br>" +
            "<strong>Last sighting date:</strong> " + observation.date + "<br>" +
            "<strong>Number of birds:</strong> " + observation.value + "<br>" +
            "<strong>Location:</strong> " + observation.ubication + "<br>" +
            "<strong>Coordinates:</strong> <br> Latitude: " + observation.lat + ", Longitude: " + observation.long + "<br>" +
            "<strong>Link:</strong> <a href='https://es.wikipedia.org/wiki/" + observation.sciname.split(" ")[0]+"_"+observation.sciname.split(" ")[1] + "' target='_blank'>See in Wikipedia</a>";
    } else { // Especifico
        popupContent += "<strong>Last sighting date:</strong> " + observation.date + "<br>" +
            "<strong>Number of birds:</strong> " + observation.value + "<br>" +
            "<strong>Location:</strong> " + observation.ubication + "<br>" +
            "<strong>Coordinates:</strong> <br> Latitude: " + observation.lat + ", Longitude: " + observation.long;
    }
    puntoObservacion.bindPopup(popupContent);

    puntoObservacion.on("click", function() {
        puntoObservacion.openPopup();
    });

    markers.addLayer(puntoObservacion);
    map.addLayer(markers);
}
// Dibujar puntos sensores
function addLayerSensor(map, markers, observation){
    // Agregar puntos de avistamientos
    let color = "";
    let url = "";
    color = "black";
    var puntoObservacion = L.circleMarker(L.latLng(observation.lat, observation.long), {
        radius: 8,
        fillColor: color,
        color: "red",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
    });
    var popupContent = "";
    popupContent += "<strong>Sensor:</strong> " + observation.name + "<br>" +
        "<strong>Last register date:</strong> " + observation.date + "<br>" +
        "<strong>Number of registers:</strong> " + observation.total + "<br>" +
        "<strong>Average value:</strong> " + observation.media + " " + observation.units + "<br>" +
        "<strong>Coordinates:</strong> <br> Latitude: " + observation.lat + ", Longitude: " + observation.long + "<br>" +
        "<a href='#' id='registers'>See more</a>";
    puntoObservacion.bindPopup(popupContent);

    puntoObservacion.on("click", function() {
        puntoObservacion.openPopup();
        var registros = document.getElementById("registers");
        registros.addEventListener("click", function() {
            showMensajeModal(observation);
        });
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
        title: "Legend",
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
    var data = await getAllAvesInfo(map, markers, regionCode, date);
    // Recorrer las especies seleccionadas y agregar sus observaciones correspondientes
    const total = {};
    switch (type) {
        case "especifico":
            var speciesName = getNombreEspecie();
            data.forEach(observation => {
                for (const region of regionCode) {
                    if (observation.sciname === speciesName && observation.idubication === region && observation.value > 0) {
                        if (!total[region]) {
                            total[region] = { total: 0, coordenadas: { lat: observation.lat, lng: observation.long } };
                        } else {
                            total[region].coordenadas.lat = observation.lat;
                            total[region].coordenadas.lng = observation.long;
                        }
                        total[region].total += parseInt(observation.value);
                    }
                }
            });
            break;
        case "general":
            data.forEach(observation => {
                for (const region of regionCode) {
                    if (observation.idubication === region && observation.value > 0) {
                        if (!total[region]) {
                            total[region] = { total: 0, coordenadas: { lat: observation.lat, lng: observation.long } };
                        } else {
                            total[region].coordenadas.lat = observation.lat;
                            total[region].coordenadas.lng = observation.long;
                        }
                        total[region].total += parseInt(observation.value);
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

// Obtener puntos del mapa
// Función para obtener la fecha de hace X meses
function getStartDate(months) {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - months);
    return currentDate;
}
// Función devolver la fecha de inicio
function getDate(date) {
    let startDate;
    switch (date) {
        case "2anyo":
            startDate = getStartDate(24);
            break;
        case "1anyo":
            startDate = getStartDate(12);
            break;
        case "6meses":
            startDate = getStartDate(6);
            break;
        default:
            startDate = new Date();
            break;
    }
    return startDate;
}
// Obtener y dibujar avistamientos de una especie en específico
function getAves(map, markers, regionCode, date, speciesName) {
    const apiUrl = 'http://localhost:8080/ebird';
    let startDate = getDate(date);

    // Hacer la solicitud GET con fetch
    fetch(apiUrl)
        .then(response => {
            // Verificar si la solicitud fue exitosa (código de estado 200)
            if (!response.ok) {
                throw new Error('La solicitud no fue exitosa');
            }
            // Parsear la respuesta como JSON
            return response.json();
        })
        .then(data => {
            // Verificar si la respuesta tiene la estructura esperada
            if (data && Array.isArray(data.results)) {
                // Filtrar los resultados por fecha localmente
                var filteredResults = data.results.filter(result => {
                    // Convertir la fecha de la cadena al objeto Date
                    var resultDate = new Date(result.date);
                    // Comparar la fecha y filtrar los resultados desde la fecha especificada
                    return resultDate >= startDate;
                });

                // Filtrar y procesar solo las observaciones válidas
                var validObservations = filteredResults.filter(observation => {
                    return observation.value !== undefined && observation.value > 0;
                });

                // Agregar todas las capas de puntos después del filtrado
                regionCode.forEach(region => {
                    validObservations.forEach(observation => {
                        if (region == observation.idubication) {
                            if(observation.sciname.toLowerCase() === speciesName.toLowerCase() && observation.value > 0){
                                addLayerPunto(map, markers, observation);
                            }
                        }
                    });
                });
            } else {
                console.warn('Los datos recibidos de la API no tienen la estructura esperada.');
            }
        })
        .catch(error => {
            // Capturar y manejar errores
            console.error('Error de solicitud:', error);
        });
}
// Obtener y dibujar avistamientos de todas las especies
function getAllAves(map, markers, regionCode, date) {
    const apiUrl = 'http://localhost:8080/ebird';
    let startDate = getDate(date);

    // Hacer la solicitud GET con fetch
    fetch(apiUrl)
        .then(response => {
            // Verificar si la solicitud fue exitosa (código de estado 200)
            if (!response.ok) {
                throw new Error('La solicitud no fue exitosa');
            }
            // Parsear la respuesta como JSON
            return response.json();
        })
        .then(data => {
            // Verificar si la respuesta tiene la estructura esperada
            if (data && Array.isArray(data.results)) {
                // Filtrar los resultados por fecha localmente
                var filteredResults = data.results.filter(result => {
                    // Convertir la fecha de la cadena al objeto Date
                    var resultDate = new Date(result.date);
                    // Comparar la fecha y filtrar los resultados desde la fecha especificada
                    return resultDate >= startDate;
                });

                // Filtrar y procesar solo las observaciones válidas
                var validObservations = filteredResults.filter(observation => {
                    return observation.value !== undefined && observation.value > 0;
                });

                // Agregar todas las capas de puntos después del filtrado
                regionCode.forEach(region => {
                    validObservations.forEach(observation => {
                        if (region == observation.idubication) {
                            addLayerPunto(map, markers, observation);
                        }
                    });
                });
            } else {
                console.warn('Los datos recibidos de la API no tienen la estructura esperada.');
            }
        })
        .catch(error => {
            // Capturar y manejar errores
            console.error('Error de solicitud:', error);
        });
}
// Función obtener información de todos los avistamientos
async function getAllAvesInfo(map, markers, regionCode, date) {
    const apiUrl = 'http://localhost:8080/ebird';
    let startDate = getDate(date);
    let allObservations = [];

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('La solicitud no fue exitosa');
        }

        const data = await response.json();

        if (data && Array.isArray(data.results)) {
            var filteredResults = data.results.filter(result => {
                var resultDate = new Date(result.date);
                return resultDate >= startDate;
            });

            var validObservations = filteredResults.filter(observation => {
                return observation.value !== undefined && observation.value > 0;
            });

            regionCode.forEach(region => {
                validObservations.forEach(observation => {
                    if (region == observation.idubication) {
                        allObservations.push(observation);
                    }
                });
            });
            return allObservations;
        } else {
            console.warn('Los datos recibidos de la API no tienen la estructura esperada.');
        }
    } catch (error) {
        console.error('Error de solicitud:', error);
    }
}
// Función para obtener los datos de los sensores filtrados por fecha
async function getData(apiUrl, startDate) {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('La solicitud no fue exitosa');
        }

        const data = await response.json();

        if (data && Array.isArray(data.results)) {
            var filteredResults = data.results.filter(result => {
                var resultDate = new Date(result.date);
                return resultDate >= startDate;
            });

            var validObservations = filteredResults.filter(observation => {
                return observation.value !== undefined && observation.value > 0;
            });
            return validObservations;
        } else {
            console.warn('Los datos recibidos de la API no tienen la estructura esperada.');
        }
    } catch (error) {
        console.error('Error de solicitud:', error);
    }
}
// Funcion intermedia para representar los sensores
async function getSensorsInfo(map, markers, date, layer) {
    const apiUrl = "http://localhost:8080/" + layer;

    var startDate = getDate(date);
    var data = await getData(apiUrl, startDate);
    getSensors(map, markers, data);
}
// Funcion dibujar sensores
function getSensors(map, markers, data) {
    let total = 0, media = 0;
    let name = "", lastDate = "", lat = "", long = "", units = "", others = "";
    let allRegisters = [];
    data.forEach(register => {
        if (register) {
            total++;
            media += parseInt(register.value);
            if(lastDate == "" || lastDate <= register.date){
                lastDate = register.date;
            }
            name = register.sensor;
            lat = register.lat;
            long = register.long;
            units = register.units;
            others = register.others;
            allRegisters.push({
                name: name,
                id: register.locationId,
                lat: lat,
                long: long,
                value: register.value,
                units: units,
                date: register.date,
                others: register.others
            });
        }
    });
    let observation = {
        name: name,
        lat: lat,
        long: long,
        total: total, media: (media/total).toFixed(2), units: units,
        date: lastDate,
        all: allRegisters
    };
    addLayerSensor(map, markers, observation);
}

// ----------------------------------------------------------------------------------------------------------------------------

// Mostrar mensaje modal para las graficas
function showMensajeModal(values) {
    var name = values.name.charAt(0).toUpperCase() + values.name.slice(1);
    document.getElementById("grafica").innerHTML = `<div id="modalVentana" class="modal">
                                                        <div class="modalContenido">
                                                            <span class="modalCerrar">&times;</span>
                                                            <h2>${name} sensor logs</h2>
                                                            <div id="registrosColumnas"></div>
                                                            <div id="registros"></div>
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

    addRegisters(values);
}
// Dibujar grafica
function addRegisters(values) {
    var registros = "";
    var classname = "darkBackground";
    console.log(values.all);
    for (let i in values.all) {
        if(i == 0){
           document.getElementById("registrosColumnas").innerHTML = "<div class='rows main'><div>Sensor</div><div class='idubication'>Id</div><div>Latitude</div><div>Longitude</div><div>Value</div><div>Units</div><div>Date</div><div>Others</div></div>";
        }
        if(i%2 == 0){
            classname = "clearBackground";
        }
        else {
            classname = "darkBackground";
        }
        let value = values.all[i];
        registros += "<div class='rows " + classname + "'><div>" + value.name + "</div><div class='idubication'>" + value.id + "</div><div>" + value.lat + "</div><div>" + value.long + "</div><div>" + value.value + "</div><div>" + value.units + "</div><div>" + value.date + "</div><div>" + value.others + "</div></div>";
    }
    document.getElementById("registros").innerHTML = registros;

}
// ----------------------------------------------------------------------------------------------------------------------------
