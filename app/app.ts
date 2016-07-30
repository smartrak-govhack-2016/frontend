declare function require(filename: string): string;
let markerStartFile = require('./icons/marker-start.png')

export = class App {

	//game: Phaser.Game;
	//marker: Phaser.Sprite;

	startMarker: L.Marker = null;
	endMarker: L.Marker = null;

	instructionsDiv: HTMLDivElement;

	constructor(public map: L.Map) {
		this.instructionsDiv = <HTMLDivElement>document.getElementById('instructions');
		map.on('click', (e) => this.mapClick(<L.LeafletMouseEvent>e));

		//this.game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'phaser', this, true);
	}

	mapClick(e: L.LeafletMouseEvent) {
		if (!this.startMarker) {
			let icon = L.AwesomeMarkers.icon({
				prefix: "glyphicon",
				markerColor: "green",
				icon: "play"
			});
			this.startMarker = new L.Marker(e.latlng, {
				draggable: true,
				icon: icon
			});
			this.map.addLayer(this.startMarker);
			this.instructionsDiv.innerHTML = "Click the map to choose your destination";
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
			this.instructionsDiv.innerHTML = "Loading route...";
		}
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