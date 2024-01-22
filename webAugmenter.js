// ==UserScript==
// @name         New AWAG4MAPS
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Introduces a map with bird sightings recorded in the Mar Menor. It also shows open data on the state of the lagoon water.
// @author       Paula Gonzalez Martinez
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

loadCSS("own_css");
loadCSS("leaflet_css");
loadCSS("legend_css");
loadCSS("markerclusterdefault_css");
loadCSS("markercluster_css");
// ----------------------------------------------------------------------------------------------------------------------------

// JAVASCRIPT

loadScript("https://unpkg.com/leaflet@1.7.1/dist/leaflet.js");
loadScript("https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/heatmap.js-2.0.5/build/heatmap.js");
loadScript("https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/heatmap.js-2.0.5/plugins/leaflet-heatmap/leaflet-heatmap.js");
loadScript("https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/Leaflet.markercluster-1.4.1/dist/leaflet.markercluster.js");
loadScript("https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/echarts.min.js");
loadScript("https://raw.githubusercontent.com/lucyleia28/AWAG4Maps/main/plugin/Leaflet.Legend-master/src/leaflet.legend.js");
// ----------------------------------------------------------------------------------------------------------------------------

// General values
var pathname = window.location.pathname;
const list_pathname = await getLists("pathName");
const specific_pathname = "/wiki/Mar_Menor";

if (list_pathname.includes(pathname)) {
    let mapContainer = createLateralMapContainer();
    createMap("specific", mapContainer);
}
else if(pathname.includes(specific_pathname)){
    let mapContainer = createGeneralMapContainer();
    createMap("general", mapContainer);
}

// ----------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------FUNTIONS-------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------

// Load files
function loadCSS(string){
    const css = GM_getResourceText(string);
    GM_addStyle(css);
}
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

// General and Specific maps

// Main function
async function createMap(type, mapContainer){
    let zoom = 11;
    if (type == "general") {
        zoom = 11.5;
    }
    let map = L.map('map').setView([37.7325, -0.7790], zoom);
    let base = addLayerBase(map);
    let area = addLayerArea(map);
    let scale = addLayerScale(map);

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

    var markersSecondaryLayer = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            var childCount = cluster.getChildCount();
            var containerStyle = 'width: 10px; height: 10px;';
            var contentStyle = 'display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; border-radius: 50%; background-color: rgba(0, 0, 0, 0.8); border: solid white;';

            return new L.DivIcon({
                html: '<div style="' + containerStyle + '"><div style="' + contentStyle + '"><span style="margin-top: 50px;">Sensors</span></div></div>',
                className: "secondaryLayer",
                iconSize: new L.Point(10, 10)
            });
        }
    });

    addVisualGuide();

    const regionCode = await getLists("regionCode");
    const pointNamesList = document.getElementById("pointNamesList");
    let observationPeriod = document.querySelector('input[name="period"]:checked').value;
    let period = document.getElementsByName("period");
    let pointLocationsList = "";
    let heatMap = document.getElementById("heatMap");
    let layer = "";

    switch (type) {
            case "specific":
            var pointNames = getPointNames();
            getMainLayer(map, markers, regionCode, observationPeriod, pointNames);
            setPointLocationsList(map, markers, regionCode, observationPeriod, pointNames);
            for (var i = 0; i < period.length; i++) {
                period[i].addEventListener("change", function() {
                    var selectedValue = document.querySelector('input[name="period"]:checked').value;
                    updateDate(map, markers, markersSecondaryLayer, regionCode, selectedValue, "specific");
                    deselectHeatMap(map);
                });
            }
            pointLocationsList = document.getElementById("pointLocationsListLateral");
            pointLocationsList.addEventListener("change", function(event) {
                if (event.target.classList.contains("check_pointLocations")) {
                    uptadeMarkers(map, markers, regionCode, document.querySelector('input[name="period"]:checked').value, "specific-zones");
                }
            });
            getLayerInfo(map, markersSecondaryLayer, observationPeriod, layer);
            heatMap.addEventListener("change", function() {
                if (this.checked) {
                    addHeatMap(map, markers, regionCode, document.querySelector('input[name="period"]:checked').value, "specific");
                } else {
                    deselectHeatMap(map);
                }
            });
            break;
        case "general":
            getAllMainLayers(map, markers, regionCode, observationPeriod);
            setLists(map, markers, regionCode, observationPeriod, "pointNames-pointLocations");
            pointNamesList.addEventListener("change", function(event) {
                if (event.target.classList.contains("check_pointNames")) {
                    uptadeMarkers(map, markers, regionCode, document.querySelector('input[name="period"]:checked').value, "pointNames");
                }
            });
            pointLocationsList = document.getElementById("pointLocationsList");
            pointLocationsList.addEventListener("change", function(event) {
                if (event.target.classList.contains("check_pointLocations")) {
                    uptadeMarkers(map, markers, regionCode, document.querySelector('input[name="period"]:checked').value, "pointLocations");
                }
            });
            for (var j = 0; j < period.length; j++) {
                period[j].addEventListener("change", function() {
                    var selectedValue = document.querySelector('input[name="period"]:checked').value;
                    updateDate(map, markers, markersSecondaryLayer, regionCode, selectedValue, "general");
                    deselectHeatMap(map);
                });
            }
            getLayerInfo(map, markersSecondaryLayer, observationPeriod, layer);
            heatMap.addEventListener("change", function() {
                if (this.checked) {
                    addHeatMap(map, markers, regionCode, document.querySelector('input[name="period"]:checked').value, "general");
                } else {
                    deselectHeatMap(map);
                }
            });
            break;
        default:
            console.log("ERROR");
    }
    mapContainer.insertAdjacentHTML("afterbegin", map);
}
function createLateralMapContainer(){
    const infobox = document.getElementsByClassName("infobox")[0];

    let body = infobox.firstChild;
    let row = body.childNodes;
    let last = row[row.length-1];

    var row_title = document.createElement("tr");
    row_title.innerHTML = '<th colspan="3" style="text-align:center;background-color: #FF9800;"><a href="https://es.wikipedia.org/wiki/Mar_Menor" style="color: #2C2C2C; text-decoration: none;" title="Mar Menor Bird wathching">Bird watching in the Mar Menor</a></th>';
    body.insertBefore(row_title, last);
    var row_link = document.createElement("tr");
    row_link.innerHTML = '<th colspan="3"><a href="https://es.wikipedia.org/wiki/Mar_Menor" title="Mar Menor Link">See Mar Menor</a></th>';
    body.insertBefore(row_link, last);

    let mapContainer = document.createElement("div");
    mapContainer.id = "map";
    mapContainer.style = "height: 35em; width: 25em";

    row_link.firstChild.appendChild(mapContainer);
    let infoContainer = document.createElement("div");
    infoContainer.id = "infoLateral";
    infoContainer.innerHTML = `<h3>Sighting areas</h3>
                               <div id="pointLocationsListLateral"></div>
                               <h3>Date of sightings</h3>
                               <div id="buttonsContentLateral">
                                   <input type="radio" id="date2years" class="date" name="period" value="2years"/>
                                   <label for="date2years" class="boton">Last 2 years</label>
                                   <input type="radio" id="date1year" class="date" name="period" value="1year"/>
                                   <label for="date1year" class="boton">Last year</label>
                                   <input type="radio" id="date6months" class="date" name="period" value="6months" checked/>
                                   <label for="date6months" class="boton">Last 6 months</label>
                               </div>
                               <h3>Number of sightings</h3>
                               <div id="mainLayerList"></div>
                               <input id="heatMap" type="checkbox" name="calor" style="margin-bottom: 20px;"/> Show heat map`;

    let modal = document.createElement("div");
    modal.id = "graph";

    row_link.firstChild.appendChild(modal);
    row_link.firstChild.appendChild(infoContainer);

    return mapContainer;
}
function createGeneralMapContainer(){
    /*---------- WIKIPEDIA UPDATE 01/2024 ----------*/
    const pageContainer = document.querySelector(".mw-page-container");
    pageContainer.style.margin = "0 auto";
    pageContainer.style.display = "flex";
    pageContainer.style.width = "100%";
    pageContainer.style.maxWidth= "100%";
    var element = document.querySelector('.mw-body');
    if (element) {
        if (window.matchMedia("(min-width: 1000px)").matches) {
            element.style.display = 'grid';
            element.style.gridTemplate = 'min-content min-content min-content 1fr / minmax(0,129.25rem) min-content';
            element.style.gridTemplateAreas = "'titlebar-cx .' 'titlebar columnEnd' 'toolbar columnEnd' 'content columnEnd'";
        } else {
            element.style.display = 'grid';
            element.style.gridTemplate = 'min-content min-content min-content 1fr / minmax(0,59.25rem) min-content';
            element.style.gridTemplateAreas = "'titlebar-cx .' 'titlebar columnEnd' 'toolbar columnEnd' 'content columnEnd'";
        }
    }
    const header = document.querySelector(".vector-header");
    header.style.maxWidth= "100%";

    const h2Elements = document.getElementsByTagName('h2');
    const firstElementH2 = h2Elements[1];
    const mainLayerSection = document.createElement("div");
    mainLayerSection.id = "mainLayer_section";
    firstElementH2.parentNode.insertBefore(mainLayerSection, firstElementH2);
    /*--------------------------------------------------------------------------*/
    let title = document.createElement("h2");
    title.innerHTML = '<span class="mw-headline" id="mainLayer">Bird watching in the Mar Menor</span><span class="mw-editsection"></span>';
    let mapContainer = document.createElement("div");
    mapContainer.id = "map";
    let infoContainer = document.createElement("div");
    infoContainer.id = "info";
    let infoElements = document.createElement("div");
    infoElements.id = "infoElements";
    infoElements.innerHTML = `<h3>Sighting areas</h3>
                               <div id="pointLocationsList"></div>
                               <h3>Species sighted</h3>
                               <div id="pointNamesList"></div>
                               <h3>Date of sightings</h3>
                               <div id="buttonsContent">
                                   <input type="radio" id="date2years" class="date" name="period" value="2years"/>
                                   <label for="date2years" class="boton">Last 2 years</label>
                                   <input type="radio" id="date1year" class="date" name="period" value="1year"/>
                                   <label for="date1year" class="boton">Last year</label>
                                   <input type="radio" id="date6months" class="date" name="period" value="6months" checked/>
                                   <label for="date6months" class="boton">Last 6 months</label>
                               </div>
                               <h3>Number of sightings</h3>
                               <div id="mainLayerList"></div>
                               <input id="heatMap" type="checkbox" name="calor" style="margin-bottom: 20px;"/> Show heat map`;
    infoContainer.appendChild(infoElements);

    let generalMap = document.createElement("div");
    generalMap.id = "generalMap";
    generalMap.appendChild(mapContainer);
    generalMap.appendChild(infoContainer);
    let info = document.createElement("div");
    info.id = "infoUbicacion";
    let modal = document.createElement("div");
    modal.id = "graph";

    let seccion = document.getElementById("mainLayer_section");
    seccion.appendChild(title);
    seccion.appendChild(generalMap);
    seccion.appendChild(info);
    seccion.appendChild(modal);

    return mapContainer
}
// ----------------------------------------------------------------------------------------------------------------------------

// Lists
async function getLists(type) {
    const apiUrl = 'http://localhost:8080/ebird';
    var list = [];
    var content = "";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('The request was not successful.');
        }

        const data = await response.json();

        if (data && Array.isArray(data.results)) {
            var validObservations = data.results.filter(observation => {
                return observation.value !== undefined && observation.value > 0;
            });

            validObservations.forEach(observation => {
                var count = 0;
                switch(type){
                    case "pathName":
                        if(observation.sciname.includes(" ")){
                            content = "/wiki/" + observation.sciname.replace(" ", "_");
                        }
                        else {
                            content = "/wiki/" + observation.sciname;
                        }
                        break;
                    case "regionCode":
                        content = observation.idubication;
                        break;
                }

                if(list.length > 0){
                    list.forEach(element => {
                        if(element == content){
                            count ++;
                        }
                    });
                    if (count == 0){
                        list.push(content);
                    }
                }
                else {
                    list.push(content);
                }
            });
            return list;
        } else {
            console.warn('The data received from the API does not have the expected structure.');
        }
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
}
async function setLists(map, markers, regionCode, date, type) {
    var data = await getAllMainLayersInfo(map, markers, regionCode, date);
    var species = [];
    var regions = [];
    switch (type) {
        case "pointNames-pointLocations":
            species = [];
            regions = [];
            data.forEach(observation => {
                var idSpecies = observation.sciname.replace(" ", "").toLowerCase();
                if(!species.includes(idSpecies) && observation.value > 0){
                    species.push(idSpecies);
                    document.getElementById("pointNamesList").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idSpecies}" name="pointNames" class="check_pointNames" \> ${observation.sciname}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
                var idRegion = observation.idubication.toLowerCase();
                if(!regions.includes(idRegion) && observation.value > 0){
                    regions.push(idRegion);
                    document.getElementById("pointLocationsList").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idRegion}" name="pointLocations" class="check_pointLocations" \> ${observation.ubication}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
            });
            if (regions.length < 1 && species.length < 1) {
                document.getElementById("pointLocationsList").innerHTML = `<label>No observations have been recorded on this date</label>`;
                document.getElementById("pointNamesList").innerHTML = `<label>No observations have been recorded on this date</label>`;
            }
            break;
        case "pointNames":
            species = [];
            data.forEach(observation => {
                var idSpecies = observation.sciname.replace(" ", "").toLowerCase();
                if(!species.includes(idSpecies) && observation.value > 0){
                    species.push(idSpecies);
                    document.getElementById("pointNamesList").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idSpecies}" name="pointNames" class="check_pointNames" \> ${observation.sciname}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
            });
            if (species.length < 1) {
                document.getElementById("pointNamesList").innerHTML = `<label>No observations have been recorded on this date</label>`;
            }
            break;
        case "pointLocations":
            regions = [];
            data.forEach(observation => {
                var idRegion = observation.idubication.toLowerCase();
                if(!regions.includes(idRegion) && observation.value > 0){
                    regions.push(idRegion);
                    document.getElementById("pointLocationsList").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idRegion}" name="pointLocations" class="check_pointLocations" \> ${observation.ubication}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
                }
            });
            if (regions.length < 1) {
                document.getElementById("pointLocationsList").innerHTML = `<label>No observations have been recorded on this date</label>`;
            }
            break;
    }
}
async function setPointLocationsList(map, markers, regionCode, date, pointNames) {
    var regions = [];
    var data = await getAllMainLayersInfo(map, markers, regionCode, date);
    data.forEach(observation => {
        if(observation.sciname.toLowerCase() === pointNames.toLowerCase() && observation.value > 0){
            var idRegion = observation.idubication.toLowerCase();
            if(!regions.includes(idRegion)){
                regions.push(idRegion);
                document.getElementById("pointLocationsListLateral").innerHTML += `<label>
                                                                 <input type="checkbox" id="${idRegion}" name="pointLocations" class="check_pointLocations" \> ${observation.ubication}
                                                                 <span class="checkmark"></span>
                                                                 </label>`;
            }
        }
    });
    if (regions.length < 1) {
        document.getElementById("pointLocationsListLateral").innerHTML = `<label>No observations have been recorded on this date</label>`;
    }

}

// ----------------------------------------------------------------------------------------------------------------------------

// Names and Date
function getPointNames(){
    const value = window.location.pathname.split("/")[2].split("_");
    const pointNames = value[0] + " " + value[1];
    return pointNames;
}
function getStartDate(months) {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - months);
    return currentDate;
}
function getDate(date) {
    let startDate;
    switch (date) {
        case "2years":
            startDate = getStartDate(24);
            break;
        case "1year":
            startDate = getStartDate(12);
            break;
        case "6months":
            startDate = getStartDate(6);
            break;
        default:
            startDate = new Date();
            break;
    }
    return startDate;
}
async function updateDate(map, markers, markersSecondaryLayer, regionCode, date, type) {
    markers.clearLayers();
    markersSecondaryLayer.clearLayers();

    let layer = "";
    getLayerInfo(map, markersSecondaryLayer, date, layer);

    switch (type) {
        case "general":
            document.getElementById("pointNamesList").innerHTML = "";
            document.getElementById("pointLocationsList").innerHTML = "";
            await getAllMainLayers(map, markers, regionCode, date);
            setLists(map, markers, regionCode, date, "pointNames-pointLocations");
            break;
        case "specific":
            var pointNames = getPointNames();
            document.getElementById("pointLocationsListLateral").innerHTML = "";
            getMainLayer(map, markers, regionCode, date, pointNames);
            setPointLocationsList(map, markers, regionCode, date, pointNames);
            break;
    }

}

// ----------------------------------------------------------------------------------------------------------------------------

// Draw Map
async function uptadeMarkers(map, markers, regionCode, date, type) {
    var selectedSpecies = Array.from(document.querySelectorAll('input.check_pointNames:checked'))
    .map((checkbox) => checkbox.id);
    var selectedZones = Array.from(document.querySelectorAll('input.check_pointLocations:checked'))
    .map((checkbox) => checkbox.id);

    if (selectedSpecies.length > 0 && selectedZones.length > 0) {
        type = "pointLocations-pointNames";
    } else if (selectedSpecies.length < 1 && selectedZones.length < 1 && type != "specific-zones") {
        type = "clean";
    }

    switch (type) {
        case "pointNames":
            var dataPoints = await getAllMainLayersInfo(map, markers, regionCode, date);
            var regionCodes = [];
            var speciesIds = [];

            if (selectedSpecies.length > 0) {
                markers.clearLayers();
                dataPoints.forEach(observation => {
                    for (const selectedSpecie of selectedSpecies) {
                        if (observation.sciname.toLowerCase().replace(" ", "") === selectedSpecie && observation.value > 0) {
                            if (!speciesIds.includes(observation.sciname)) {
                                speciesIds.push(observation.sciname);
                            }
                            if (!regionCodes.includes(observation.idubication) && speciesIds.includes(observation.sciname)) {
                                regionCodes.push(observation.idubication);
                            }
                        }
                    }
                });
                document.getElementById("pointLocationsList").innerHTML = "";
                for (var i=0; i<speciesIds.length; i++) {
                    getMainLayer(map, markers, regionCodes, date, speciesIds[i]);
                }
                setLists(map, markers, regionCodes, date, "pointLocations");
            } else {
                markers.clearLayers();
                uptadeMarkers(map, markers, regionCode, date, "pointLocations");
            }
            break;
        case "pointLocations":
            var dataZones = await getAllMainLayersInfo(map, markers, regionCode, date);
            var regionCodeIds = [];

            if (selectedZones.length > 0) {
                markers.clearLayers();
                dataZones.forEach(observation => {
                    for (const selectedZone of selectedZones) {
                        if (observation.idubication.toLowerCase() === selectedZone && observation.value > 0) {
                            if (!regionCodeIds.includes(observation.idubication)) {
                                regionCodeIds.push(observation.idubication);
                            }
                        }
                    }
                });
                document.getElementById("pointNamesList").innerHTML = "";
                await getAllMainLayers(map, markers, regionCodeIds, date);
                setLists(map, markers, regionCodeIds, date, "pointNames");
            } else {
                markers.clearLayers();
                uptadeMarkers(map, markers, regionCode, date, "pointNames");
            }
            break;
        case "specific-zones":
            var selectedZonesEspe = Array.from(document.querySelectorAll("input.check_pointLocations:checked"))
            .map((checkbox) => checkbox.id);
            var dataZonesEspe = await getAllMainLayersInfo(map, markers, regionCode, date);
            var regionCodeIdsEspe = [];
            var pointNames = getPointNames();

            if (selectedZonesEspe.length > 0) {
                markers.clearLayers();
                dataZonesEspe.forEach(observation => {
                    for (const selectedZoneEspe of selectedZonesEspe) {
                        if (observation.idubication.toLowerCase() === selectedZoneEspe && observation.value > 0) {
                            if (!regionCodeIdsEspe.includes(observation.idubication)) {
                                regionCodeIdsEspe.push(observation.idubication);
                            }
                        }
                    }
                });
                getMainLayer(map, markers, regionCodeIdsEspe, date, pointNames);
            } else {
                markers.clearLayers();
                getMainLayer(map, markers, regionCode, date, pointNames);
            }
            break;
        case "pointLocations-pointNames":
            var data = await getAllMainLayersInfo(map, markers, regionCode, date);
            var regions = [];
            markers.clearLayers();
            data.forEach(observation => {
                for (const selectedZone of selectedZones) {
                    for (const selectedSpecie of selectedSpecies) {
                        if (observation.idubication.toLowerCase() === selectedZone && observation.sciname.toLowerCase().replace(" ", "") === selectedSpecie && observation.value > 0) {
                            addLayerPoint(map, markers, observation);
                        }
                    }
                }
            });
            break;
        case "clean":
            markers.clearLayers();
            document.getElementById("pointNamesList").innerHTML = "";
            document.getElementById("pointLocationsList").innerHTML = "";
            await getAllMainLayers(map, markers, regionCode, date);
            setLists(map, markers, regionCode, date, "pointNames");
            setLists(map, markers, regionCode, date, "pointNames-pointLocations");
            break;
    }
}
function addLayerBase(map){
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
}
function addLayerArea(map){
    fetch("https://raw.githubusercontent.com/lucyleia28/marmenor.github.io/main/areaMarMenor.json")
        .then(res => res.json())
        .then(response => {
        var marMenor = response;
        var marMenorJS = L.geoJson(marMenor).addTo(map);

        let legend = addLayerLegend(map, marMenorJS, marMenor);
    });
}
function addLayerPoint(map, markers, observation){
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
    var observationPoint = L.circleMarker(L.latLng(observation.lat, observation.long), {
        radius: 8,
        fillColor: color,
        color: "black",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
    });
    var popupContent = "";
    if (pathname.includes(specific_pathname)) { // General
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
    observationPoint.bindPopup(popupContent);

    observationPoint.on("click", function() {
        observationPoint.openPopup();
    });

    markers.addLayer(observationPoint);
    map.addLayer(markers);
}
function addSecondaryLayer(map, markers, observation){
    let color = "";
    let url = "";
    color = "black";
    var observationPoint = L.circleMarker(L.latLng(observation.lat, observation.long), {
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
        "<a href='#' id='showRegisters'>See more</a>";
    observationPoint.bindPopup(popupContent);

    observationPoint.on("click", function() {
        observationPoint.openPopup();
        var showRegisters = document.getElementById("showRegisters");
        showRegisters.addEventListener("click", function() {
            showModalMessage(observation);
        });
    });

    markers.addLayer(observationPoint);
    map.addLayer(markers);
}
function addLayerScale(map){
    var scale = new L.control.scale({ imperial: false, position: "bottomright" }).addTo(map);
    return scale;
}
function addLayerLegend(map, marMenorJS, marMenor){
    var legend = new L.control.Legend({
        id: "legend",
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

    legend._container.setAttribute("id", "legend");
    return legend;
}
function addVisualGuide() {
    document.getElementById("mainLayerList").innerHTML += `<div class="mainLayer">
                                                                      <div class="mainLayerItem red"></div>
                                                                      <div class="mainLayerLabel">
                                                                          <div class="mainLayerTitle">15+</div>
                                                                      </div>
                                                                  </div>

                                                                  <div class="mainLayer">
                                                                      <div class="mainLayerItem orange"></div>
                                                                      <div class="mainLayerLabel">
                                                                          <div class="mainLayerTitle">10 - 15</div>
                                                                      </div>
                                                                  </div>

                                                                  <div class="mainLayer">
                                                                      <div class="mainLayerItem yellow"></div>
                                                                      <div class="mainLayerLabel">
                                                                          <div class="mainLayerTitle">5 - 10</div>
                                                                      </div>
                                                                  </div>

                                                                  <div class="mainLayer">
                                                                      <div class="mainLayerItem green"></div>
                                                                      <div class="mainLayerLabel">
                                                                          <div class="mainLayerTitle">2 - 5</div>
                                                                      </div>
                                                                  </div>

                                                                  <div class="mainLayer">
                                                                      <div class="mainLayerItem gray"></div>
                                                                      <div class="mainLayerLabel">
                                                                          <div class="mainLayerTitle">1 - 2</div>
                                                                      </div>
                                                                  </div>`;

}
// ----------------------------------------------------------------------------------------------------------------------------

// HeatMap
function deselectHeatMap(map) {
    document.getElementById("heatMap").checked = false;
    map.eachLayer(function(layer) {
        if (layer instanceof HeatmapOverlay) {
            map.removeLayer(layer);
        }
    });
}
async function getHeatMapCoordinates(map, markers, regionCode, date, type) {
    var data = await getAllMainLayersInfo(map, markers, regionCode, date);
    const total = {};
    switch (type) {
        case "specific":
            var pointNames = getPointNames();
            data.forEach(observation => {
                for (const region of regionCode) {
                    if (observation.sciname === pointNames && observation.idubication === region && observation.value > 0) {
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
async function addHeatMap(map, markers, regionCode, date, type) {
    const totalCoordinates = await getHeatMapCoordinates(map, markers, regionCode, date, type);
    let data = [];

    for (const coordinate in totalCoordinates) {
        data.push({lat: totalCoordinates[coordinate].coordenadas.lat, lng: totalCoordinates[coordinate].coordenadas.lng, count: totalCoordinates[coordinate].total});
    }

    var coordinates = {
        max: 200,
        min: 0,
        data: data,
        length: 11
    };
    var config = {
        "radius": 0.03,
        "maxOpacity": .8,
        "scaleRadius": true,
        "useLocalExtrema": true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count'
    };
    var heatmapLayer = new HeatmapOverlay(config);
    heatmapLayer.setData(coordinates);
    heatmapLayer.addTo(map);
}

// ----------------------------------------------------------------------------------------------------------------------------

// Main Layer
function getMainLayer(map, markers, regionCode, date, pointNames) {
    const apiUrl = 'http://localhost:8080/ebird';
    let startDate = getDate(date);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('The request was not successful.');
            }
            return response.json();
        })
        .then(data => {
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
                            if(observation.sciname.toLowerCase() === pointNames.toLowerCase() && observation.value > 0){
                                addLayerPoint(map, markers, observation);
                            }
                        }
                    });
                });
            } else {
                console.warn('The data received from the API does not have the expected structure.');
            }
        })
        .catch(error => {
            console.error('Request Error:', error);
        });
}
function getAllMainLayers(map, markers, regionCode, date) {
    const apiUrl = 'http://localhost:8080/ebird';
    let startDate = getDate(date);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('The request was not successful.');
            }
            return response.json();
        })
        .then(data => {
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
                            addLayerPoint(map, markers, observation);
                        }
                    });
                });
            } else {
                console.warn('The data received from the API does not have the expected structure.');
            }
        })
        .catch(error => {
            console.error('Request Error:', error);
        });
}
async function getAllMainLayersInfo(map, markers, regionCode, date) {
    const apiUrl = 'http://localhost:8080/ebird';
    let startDate = getDate(date);
    let allObservations = [];

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('The request was not successful.');
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
            console.warn('The data received from the API does not have the expected structure.');
        }
    } catch (error) {
        console.error('Request Error:', error);
    }
}

// ----------------------------------------------------------------------------------------------------------------------------

// Secondary Layer
async function getData(apiUrl, startDate) {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('The request was not successful.');
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
            console.warn('The data received from the API does not have the expected structure.');
        }
    } catch (error) {
        console.error('Request Error:', error);
    }
}
async function getLayerInfo(map, markers, date, layer) {
    const apiUrl = "http://localhost:8080/" + layer;
    var startDate = getDate(date);
    var data = await getData(apiUrl, startDate);
    getSecondaryLayer(map, markers, data);
}
function getSecondaryLayer(map, markers, data) {
    let total = 0, media = 0;
    let name = "", lastDate = "", lat = "", long = "", units = "", others = "";
    let allRegisters = [];
    console.log(data);
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
                others: register.others,
                date: register.date
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
    addSecondaryLayer(map, markers, observation);
}

// ----------------------------------------------------------------------------------------------------------------------------

function showModalMessage(values) {
    var name = values.name.charAt(0).toUpperCase() + values.name.slice(1);
    document.getElementById("graph").innerHTML = `<div id="modalWindow" class="modal">
                                                        <div class="modalContent">
                                                            <span class="modalClose">&times;</span>
                                                            <h2>${name} sensor logs</h2>
                                                            <div id="columnRegisters"></div>
                                                            <div id="registers"></div>
                                                        </div>
                                                    </div>`;
    var modal = document.getElementById("modalWindow");
    modal.style.display = "block";

    var span = document.getElementsByClassName("modalClose")[0];
    span.addEventListener("click", function() {
        modal.style.display = "none";
    });
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    addRegisters(values);
}
function addRegisters(values) {
    var registers = "";
    var classname = "darkBackground";
    for (let i in values.all) {
        if(i == 0){
           document.getElementById("columnRegisters").innerHTML = "<div class='rows main'><div>Name</div><div>Id</div><div>Latitude</div><div>Longitude</div><div>Value</div><div>Units</div><div>Date</div><div>Sensor</div><div>Altitude</div></div>";
        }
        if(i%2 == 0){
            classname = "clearBackground";
        }
        else {
            classname = "darkBackground";
        }
        let value = values.all[i];
        registers += "<div class='rows " + classname + "'><div>" + value.name + "</div><div>" + value.id + "</div><div>" + value.lat + "</div><div>" + value.long + "</div><div>" + value.value + "</div><div>" + value.units + "</div><div>" + value.date + "</div><div>" + value.sensor + "</div><div>" + value.altitude + "</div></div>";
    }
    document.getElementById("registers").innerHTML = registers;
}
// ----------------------------------------------------------------------------------------------------------------------------