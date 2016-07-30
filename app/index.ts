import App = require('./app');

declare function require(filename: string): void;
require('./index.css');

WebFont.load({
    google: { families: ['Voltaire::latin'] },
    active: () => {

let map = new L.Map('map', {
    //center: new L.LatLng(-37.771, 175.268),
	//zoom: 11,

	layers:
	[
		L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
			attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: 'abcd',
			id: 'mapbox.streets',
			accessToken: 'pk.eyJ1IjoiZ3V0ZW55ZSIsImEiOiJmNjJlMDNmYTUyMzNjMzQxZmY4Mzc1ZmFiYmExNjMxOSJ9.xgl1PBwQV9CtwW-usedrcQ'
		})
		/*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	})*/
	]
});
let bounds = new L.LatLngBounds({ lat: -37.813852, lng: 175.217514}, { lat: -37.723071, lng: 175.331669 });
map.fitBounds(bounds);


		new App(map);
    }
});

//let pos = this.map.project([first[2], first[1]]);
