var definitions = [
    { color: "rot" /* red */, count: 4 },
    { color: "tuerkis" /* turquoise */, count: 5 },
    { color: "hellgruen" /* brightGreen */, count: 7 },
    { color: "beige" /* beige */, count: 2 },
    { color: "gruen" /* green */, count: 4 },
    { color: "lila" /* purple */, count: 3 },
    { color: "violett" /* violet */, count: 4 },
    { color: "blau" /* blue */, count: 3 },
    { color: "braun" /* brown */, count: 4 },
    { color: "gelb" /* yellow */, count: 4 },
    { color: "grau" /* gray */, count: 1 },
    { color: "hellblau" /* lightBlue */, count: 4 },
    { color: "hellbraun" /* lightBrown */, count: 5 },
    { color: "orange" /* orange */, count: 1 },
    { color: "pink" /* pink */, count: 4 },
    { color: "rosa" /* lightPink */, count: 6 }
];
function getCenter(p) {
    var bounds = new google.maps.LatLngBounds();
    p.getPath().forEach(function (element) {
        bounds.extend(element);
    });
    return bounds.getCenter();
}
function makeColor(r, g, b) {
    var rgb = b | (g << 8) | (r << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
}
function hex(c) {
    switch (c) {
        case "rot" /* red */:
            return makeColor(255, 0, 0);
        case "tuerkis" /* turquoise */:
            return makeColor(0, 159, 159);
        case "hellgruen" /* brightGreen */:
            return makeColor(104, 195, 12);
        case "violett" /* violet */:
            return makeColor(174, 165, 213);
        case "lila" /* purple */:
            return makeColor(135, 27, 138);
        case "gruen" /* green */:
            return makeColor(0, 132, 70);
        case "beige" /* beige */:
            return makeColor(227, 177, 151);
        case "blau" /* blue */:
            return makeColor(0, 92, 181);
        case "braun" /* brown */:
            return makeColor(126, 50, 55);
        case "gelb" /* yellow */:
            return makeColor(255, 244, 0);
        case "grau" /* gray */:
            return makeColor(174, 165, 213);
        case "hellblau" /* lightBlue */:
            return makeColor(0, 166, 198);
        case "hellbraun" /* lightBrown */:
            return makeColor(190, 135, 90);
        case "orange" /* orange */:
            return makeColor(255, 122, 36);
        case "pink" /* pink */:
            return makeColor(255, 0, 94);
        case "rosa" /* lightPink */:
            return makeColor(255, 122, 183);
    }
}
function read(color, number) {
    var filename = "wabe " + color + "-strecke " + number + ".gpx";
    console.log(filename);
    var request = new XMLHttpRequest();
    request.open("GET", "gpx/" + filename, false);
    request.send();
    if (request.status == 200) {
        // console.log(request.responseXML)
        var seg = request.responseXML.getElementsByTagName("trkseg")[0];
        // console.log(seg);
        var result = [];
        seg.childNodes.forEach(function (element) {
            if (element.nodeName == "trkpt") {
                var latlng = {
                    lat: parseFloat(element.attributes.getNamedItem("lat").value),
                    lng: parseFloat(element.attributes.getNamedItem("lon").value)
                };
                result.push(latlng);
            }
        });
        var p = new google.maps.Polygon({
            paths: result,
            strokeColor: hex(color),
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: hex(color),
            fillOpacity: 0.35
        });
        p.addListener("click", function (_) {
            console.log(filename);
        });
        p.setMap(map);
        // // console.log(p);
        // new google.maps.Marker({
        //   position: getCenter(p),
        //   label: filename,
        //   map: map  
        // })
    }
    else {
        console.log("Couldn't parse", request);
    }
}
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 53.18, lng: 13.14 },
        zoom: 10
    });
    definitions.forEach(function (element) {
        for (var i = 0; i < element.count; i++) {
            read(element.color, i + 1);
        }
    });
    var xml;
}
