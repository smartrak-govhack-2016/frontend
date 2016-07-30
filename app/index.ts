import App = require('./app');

declare function require(filename: string): void;
require('./index.css');

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2ZWxlYXZlciIsImEiOiJjaW15ZHB2azAwM3lidXJra2V1dWJyZHl3In0.BcJAOnQQumtT9xUAlgwvaw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [175.268, -37.771], zoom: 11,

    attributionControl: true
});

let mapLoaded = false;
let fontLoaded = false;

map.on('load', function () {
    mapLoaded = true;

    if (fontLoaded) {
        new App(map);
    }

});

WebFont.load({
    google: { families: ['Voltaire::latin'] },
    active: () => {
        fontLoaded = true;
        if (mapLoaded) {
            new App(map);
        }
    }
});

//let pos = this.map.project([first[2], first[1]]);
