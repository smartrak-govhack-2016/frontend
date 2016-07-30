import App = require('./app');

declare function require(filename: string): void;
require('./index.css');

let map = new L.Map('map', {
    center: new L.LatLng(-37.771, 175.268),
	zoom: 11,

	layers:
	[L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	})]
});

WebFont.load({
    google: { families: ['Voltaire::latin'] },
    active: () => {
		new App(map);
    }
});

//let pos = this.map.project([first[2], first[1]]);
