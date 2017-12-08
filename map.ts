const enum Color {
    red = "rot",
    turquoise = "tuerkis",
    brightGreen = "hellgruen",
    beige = "beige",
    green = "gruen",
    purple = "lila",
    violet = "violett",
    blue = "blau",
    brown = "braun",
    yellow = "gelb",
    gray = "grau",
    lightBlue = "hellblau",
    lightBrown = "hellbraun",
    orange = "orange",
    pink = "pink",
    lightPink = "rosa"
}

let definitions: {color: Color, count: number}[] = [
    {color: Color.red, count:4},
    {color: Color.turquoise, count:5},
    {color: Color.brightGreen, count:7},
    {color: Color.beige, count:2},
    {color: Color.green, count:4},
    {color: Color.purple, count:3},
    {color: Color.violet, count:4},
    {color: Color.blue, count:3},
    {color: Color.brown, count:4},
    {color: Color.yellow, count:4},
    {color: Color.gray, count:1},
    {color: Color.lightBlue, count:4},
    {color: Color.lightBrown, count:5},
    {color: Color.orange, count:1},
    {color: Color.pink, count:4},
    {color: Color.lightPink, count:6}
]

function getCenter(p: google.maps.Polygon): google.maps.LatLng {
    var bounds = new google.maps.LatLngBounds()
    p.getPath().forEach(element => {
        bounds.extend(element);
    });
    return bounds.getCenter();
}

function makeColor(r: number, g: number, b: number) {
    var rgb = b | (g << 8) | (r << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

function hex(c: Color) {
    switch(c) {
        case Color.red:
            return makeColor(255, 0, 0)
        case Color.turquoise:
            return makeColor(0, 159, 159)
        case Color.brightGreen:
            return makeColor(104, 195, 12)
        case Color.violet:
            return makeColor(174, 165, 213)
        case Color.purple:
            return makeColor(135, 27, 138)
        case Color.green:
            return makeColor(0, 132, 70)
        case Color.beige:
            return makeColor(227, 177, 151)
        case Color.blue:
            return makeColor(0, 92, 181)
        case Color.brown:
            return makeColor(126, 50, 55)
        case Color.yellow:
            return makeColor(255, 244, 0)
        case Color.gray:
            return makeColor(174, 165, 213)
        case Color.lightBlue:
            return makeColor(0, 166, 198)
        case Color.lightBrown:
            return makeColor(190, 135, 90)
        case Color.orange:
            return makeColor(255, 122, 36)
        case Color.pink:
            return makeColor(255, 0, 94)
        case Color.lightPink:
            return makeColor(255, 122, 183)


    }
}

function read(color: Color, number: number) {
    let filename = "wabe " + color + "-strecke " + number + ".gpx"
    console.log(filename)

    let request = new XMLHttpRequest();
    request.open("GET", "gpx/" + filename, false)
    request.send();
    if(request.status == 200) {
        // console.log(request.responseXML)
        let seg = request.responseXML.getElementsByTagName("trkseg")[0];
        // console.log(seg);
        var result: google.maps.LatLngLiteral[] = []
        seg.childNodes.forEach(element => {
            if(element.nodeName == "trkpt") {
                let latlng = {
                    lat: parseFloat(element.attributes.getNamedItem("lat").value),
                    lng: parseFloat(element.attributes.getNamedItem("lon").value)
                };            
                result.push(latlng);
            }
        });
        let p = new google.maps.Polygon({
            paths: result,
            strokeColor: hex(color),
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: hex(color),
            fillOpacity: 0.35
        });
        p.addListener(
            "click", _ => {
                console.log(filename)
            }
        )
        p.setMap(map);
        // // console.log(p);
        // new google.maps.Marker({
        //   position: getCenter(p),
        //   label: filename,
        //   map: map  
        // })
    } else {
        console.log("Couldn't parse", request);        
    }

}

var map: google.maps.Map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 53.18, lng: 13.14},
        zoom: 10
    });

    definitions.forEach(element => {
        for(var i = 0; i < element.count; i++) {
            read(element.color, i+1);
        }
    });

    let xml: XMLDocument;
}
