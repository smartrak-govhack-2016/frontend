declare function require(filename: string): string;
let markerStartFile = require('./icons/marker-start.png')

import ToolTip = require('./toolTip');

export = class App {

	//game: Phaser.Game;
	//marker: Phaser.Sprite;

	startMarker: L.Marker = null;
	endMarker: L.Marker = null;
	routeLine: L.Polyline;

	instructionsDiv: HTMLDivElement;

	constructor(public map: L.Map) {
		this.instructionsDiv = <HTMLDivElement>document.getElementById('instructions');
		map.on('click', (e) => this.mapClick(<L.LeafletMouseEvent>e));

		document.getElementById('start-at-my-location').addEventListener('click', (ev) => this.createStartMarker(new L.LatLng(-37.787383, 175.319811)));
		//this.game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'phaser', this, true);
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
			this.instructionsDiv.innerHTML = "<span>Click the map to choose your destination</span>";
	}

	mapClick(e: L.LeafletMouseEvent) {
		if (!this.startMarker) {
			this.createStartMarker(e.latlng);
		} else if (!this.endMarker) {
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
			this.instructionsDiv.innerHTML = "<span>Loading route...</span>";

			this.startMarker.on('dragend', () => this.reroute());
			this.endMarker.on('dragend', () => this.reroute());
			setTimeout(() => this.fakeRoute(), 1000);
		}
	}

	fakeRoute(): void {
		this.instructionsDiv.innerHTML = "<span>Route found! Drag markers to modify.</span>";
		let poly = new L.Polyline([this.startMarker.getLatLng(), this.endMarker.getLatLng()], {
			weight: 5
		});
		this.routeLine = poly;
		this.map.addLayer(poly);
		//https://github.com/IvanSanchez/Leaflet.Polyline.SnakeAnim

		(<any>poly).snakeIn({
			snakingSpeed: 100
		});

		new ToolTip(poly);

		document.getElementById('route-details').style.display = 'block';
	}

	reroute(): void {
		this.map.removeLayer(this.routeLine);
		this.fakeRoute();
	}

	/*
		preload() {
			this.game.stage.disableVisibilityChange = true;
	
			this.game.load.image('marker-start', markerStartFile);
		}
	
		//Phaser
		create() {
			let pos = this.map.project([175.268, -37.771])
			this.marker = this.game.add.sprite(pos.x, pos.y, 'marker-start');
			this.marker.anchor.set(0.5, 1);
		}
	
		//Phaser
		update() {
			let pos = this.map.project([175.268, -37.771])
			this.marker.position.set(pos.x, pos.y);
		}*/
}