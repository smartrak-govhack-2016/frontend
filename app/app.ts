import haversine = require('haversine');

import BadPlacesOverlay = require('./badPlacesOverlay');
import ToolTip = require('./toolTip');

declare function require(filename: string): string;
let markerStartFile = require('./icons/marker-start.png')


interface Segment {
	Start: {
		Lat: number,
		Lon: number
	};
	End: {
		Lat: number,
		Lon: number
	};
	SafetyRating: number;
	StreetName: string;
}

export = class App {

	//game: Phaser.Game;
	//marker: Phaser.Sprite;

	startMarker: L.Marker = null;
	endMarker: L.Marker = null;
	routeLine: L.Polyline;

	instructionsDiv: HTMLDivElement;

	btnCircle: HTMLButtonElement;
	btnP2P: HTMLButtonElement;

	mode: 'circle' | 'p2p';

	constructor(public map: L.Map) {
		this.instructionsDiv = <HTMLDivElement>document.getElementById('instructions');
		map.on('click', (e) => this.mapClick(<L.LeafletMouseEvent>e));

		new BadPlacesOverlay(map);

		this.btnCircle = <HTMLButtonElement>document.getElementById('btn-circle');
		this.btnP2P = <HTMLButtonElement>document.getElementById('btn-p2p');

		this.btnCircle.addEventListener('click', () => this.modeSwitch('circle'));
		this.btnP2P.addEventListener('click', () => this.modeSwitch('p2p'));

		//TODO: Initial mode
		this.modeSwitch('p2p');
	}

	tidyUp() {
		if (this.startMarker) {
			this.map.removeLayer(this.startMarker);
			this.startMarker = null;
		}
		if (this.endMarker) {
			this.map.removeLayer(this.endMarker);
			this.endMarker = null;
		}
		this.tidyUpRoute();
	}
	tidyUpRoute() {
		if (this.routeLine) {
			this.map.removeLayer(this.routeLine);
			this.routeLine = null;
		}

	}

	modeSwitch(mode: 'circle' | 'p2p') {
		this.tidyUp();

		if (mode == 'circle') {
			this.btnCircle.classList.add('active');
			this.btnP2P.classList.remove('active');
		} else { //p2p
			this.btnP2P.classList.add('active');
			this.btnCircle.classList.remove('active');
		}

        this.instructionsDiv.innerHTML = '<span>Click on the map to choose your start location</span> <br/><button id="start-at-my-location" class="btn btn-s btn-success">Start at my Location</button>';
		document.getElementById('start-at-my-location').addEventListener('click', (ev) => this.createStartMarker(new L.LatLng(-37.787383, 175.319811)));

		this.mode = mode;
	}

	createStartMarker(latlng: L.LatLng): void {

		let icon = L.AwesomeMarkers.icon({
			prefix: "glyphicon",
			markerColor: "green",
			icon: "play"
		});
		this.startMarker = new L.Marker(latlng, {
			draggable: true,
			icon: icon
		});
		this.map.addLayer(this.startMarker);

		if (this.mode == 'p2p') {
			this.instructionsDiv.innerHTML = '<span>Click the map to choose your destination</span>';
		} else {
			this.findRoute();
			this.startMarker.on('dragend', () => this.reroute());
		}
	}

	mapClick(e: L.LeafletMouseEvent) {
		if (this.mode == 'circle' || !this.startMarker) {
			this.tidyUp();
			this.createStartMarker(e.latlng);
		} else if (this.mode == 'p2p' && !this.endMarker) {
			let icon = L.AwesomeMarkers.icon({
				prefix: "glyphicon",
				markerColor: "red",
				icon: "stop"
			})
			this.endMarker = new L.Marker(e.latlng, {
				draggable: true,
				icon: icon
			});
			this.map.addLayer(this.endMarker);

			this.startMarker.on('dragend', () => this.reroute());
			this.endMarker.on('dragend', () => this.reroute());
			this.findRoute();
		}
	}

	findRoute(): void {
		this.instructionsDiv.innerHTML = "<span>Loading route...</span>";
		//setTimeout(() => this.showRoute(this.myFakeRoute), 1000);
		this.realRoute();
	}

	latest = 999;

	realRoute(): void {
		//http://localhost:53167/v1/route/37/175/37/175

		this.latest += 1;
		let r = this.latest;
		if (this.mode == 'circle') {
			$.ajax('http://localhost:53167/v1/circle/' +
				this.startMarker.getLatLng().lat + "/" +
				this.startMarker.getLatLng().lng + "/",
				{})
				.done((res) => {
					//res is the data, like myFakeRoute
					console.log('done', res);
					if (r == this.latest) {
						this.showRoute(res);
					}
				});
		} else {
			$.ajax('http://localhost:53167/v1/route/' +
				this.startMarker.getLatLng().lat + "/" +
				this.startMarker.getLatLng().lng + "/" +
				this.endMarker.getLatLng().lat + "/" +
				this.endMarker.getLatLng().lng + "/",
				{})
				.done((res) => {
					//res is the data, like myFakeRoute
					console.log('done', res);
					this.showRoute(res);
				});
		}
	}

	showRoute(route: Array<Segment>): void {
		this.tidyUpRoute();
		this.instructionsDiv.innerHTML = "<span>Route found! Drag markers to modify.</span>";

		//let poly = new L.Polyline([this.startMarker.getLatLng(), this.endMarker.getLatLng()], {
		let points = new Array<L.LatLng>();
		points.push(this.startMarker.getLatLng());
		//points.push(new L.LatLng(route[0].Start.Lat, route[0].Start.Lon));

		let dist = 0;
		for (var i = 0; i < route.length - 1; i++) {
			let p = route[i];
			points.push(new L.LatLng(p.End.Lat, p.End.Lon))
			dist += haversine(
				{ latitude: p.Start.Lat, longitude: p.Start.Lon },
				{ latitude: p.End.Lat, longitude: p.End.Lon },
				{ unit: 'km' }
			);
		}
		let lastMarker = this.endMarker || this.startMarker;
		points.push(lastMarker.getLatLng());
		dist += haversine(
			{ latitude: route[i - 1].End.Lat, longitude: route[i - 1].End.Lon },
			{ latitude: lastMarker.getLatLng().lat, longitude: lastMarker.getLatLng().lng },
			{ unit: 'km' });


		let poly = new L.Polyline(points, {
			weight: 5
		});
		this.routeLine = poly;
		this.map.addLayer(poly);
		//https://github.com/IvanSanchez/Leaflet.Polyline.SnakeAnim

		(<any>poly).snakeIn({
			snakingSpeed: 100
		});

		new ToolTip(poly, 'todo');

		document.getElementById('route-details').style.display = 'block';
		document.getElementById('dist').innerHTML = (Math.round(dist * 10) / 10) + "km";

		let hours = dist / 12; //Bike at this speed km/h
		let mins = Math.ceil((hours * 60) % 60);
		hours = Math.floor(hours);
		if (hours) {
			document.getElementById('time').innerHTML = hours + " hours, " + mins + " minutes";
		} else {
			document.getElementById('time').innerHTML = mins + " minutes";
		}
	}

	reroute(): void {
		this.map.removeLayer(this.routeLine);
		this.findRoute();
	}

	myFakeRoute = <Array<Segment>>[{
		"Start": {
			"Lat": - 37.7698995,
			"Lon": 175.2820704
		},
		"End": {
			"Lat": - 37.7689713,
			"Lon": 175.2815321
		},
		"SafetyRating": 0,
		"StreetName": null
	}, {
			"Start": {
				"Lat": - 37.770141,
				"Lon": 175.2822105
			},
			"End": {
				"Lat": - 37.7698995,
				"Lon": 175.2820704
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7707221,
				"Lon": 175.2825336
			},
			"End": {
				"Lat": - 37.770141,
				"Lon": 175.2822105
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7708784,
				"Lon": 175.2826205
			},
			"End": {
				"Lat": - 37.7707221,
				"Lon": 175.2825336
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7708784,
				"Lon": 175.2826205
			},
			"End": {
				"Lat": - 37.7707779,
				"Lon": 175.2830581
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7707779,
				"Lon": 175.2830581
			},
			"End": {
				"Lat": - 37.7703148,
				"Lon": 175.2850486
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7703148,
				"Lon": 175.2850486
			},
			"End": {
				"Lat": - 37.7697132,
				"Lon": 175.2875627
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7697132,
				"Lon": 175.2875627
			},
			"End": {
				"Lat": - 37.7695476,
				"Lon": 175.2884069
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7695476,
				"Lon": 175.2884069
			},
			"End": {
				"Lat": - 37.7695622,
				"Lon": 175.2885671
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7695622,
				"Lon": 175.2885671
			},
			"End": {
				"Lat": - 37.7696036,
				"Lon": 175.2886811
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7696036,
				"Lon": 175.2886811
			},
			"End": {
				"Lat": - 37.7696718,
				"Lon": 175.2887643
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7693479,
				"Lon": 175.2899289
			},
			"End": {
				"Lat": - 37.7696718,
				"Lon": 175.2887643
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7694088,
				"Lon": 175.2899628
			},
			"End": {
				"Lat": - 37.7693479,
				"Lon": 175.2899289
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7694088,
				"Lon": 175.2899628
			},
			"End": {
				"Lat": - 37.7691342,
				"Lon": 175.2911558
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7691996,
				"Lon": 175.2911875
			},
			"End": {
				"Lat": - 37.7691342,
				"Lon": 175.2911558
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7691996,
				"Lon": 175.2911875
			},
			"End": {
				"Lat": - 37.7688219,
				"Lon": 175.2925562
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7688219,
				"Lon": 175.2925562
			},
			"End": {
				"Lat": - 37.7684394,
				"Lon": 175.2924627
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7684394,
				"Lon": 175.2924627
			},
			"End": {
				"Lat": - 37.7682788,
				"Lon": 175.2924241
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7682788,
				"Lon": 175.2924241
			},
			"End": {
				"Lat": - 37.7681149,
				"Lon": 175.2926071
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7681149,
				"Lon": 175.2926071
			},
			"End": {
				"Lat": - 37.767906,
				"Lon": 175.2933673
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7680795,
				"Lon": 175.2934527
			},
			"End": {
				"Lat": - 37.767906,
				"Lon": 175.2933673
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7687431,
				"Lon": 175.2937535
			},
			"End": {
				"Lat": - 37.7680795,
				"Lon": 175.2934527
			},
			"SafetyRating": 0,
			"StreetName": null
		}, {
			"Start": {
				"Lat": - 37.7699164,
				"Lon": 175.2942943
			},
			"End": {
				"Lat": - 37.7687431,
				"Lon": 175.2937535
			},
			"SafetyRating": 0,
			"StreetName": null
		}
	];
}