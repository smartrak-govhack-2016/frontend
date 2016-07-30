declare function require(filename: string): string;
let markerStartFile = require('./icons/marker-start.png')

export = class App {

	//game: Phaser.Game;

	//marker: Phaser.Sprite;

	isMouseOverStart = false;

	constructor(public map: mapboxgl.Map) {
		var canvas = map.getCanvasContainer();

		this.createPoint('start', new mapboxgl.LngLat(175.268, -37.771));

		map.on('mousemove', function (e: mapboxgl.MapMouseEvent) {
			var features = map.queryRenderedFeatures(e.point, { layers: ['start'] });

			if (features.length) {
				this.isMouseOverStart = true;
				map.dragPan.disable();
			} else {
				this.isMouseOverStart = false;
				map.dragPan.enable();
			}
		});
		map.addLayer({
			"id": "start",
			"type": "circle",
			"source": "start",
			"paint": {
				"circle-radius": 10,
				"circle-color": "#3887be"
			}
		});

		//this.game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'phaser', this, true);
	}

	createPoint(key: string, lnglat: mapboxgl.LngLat) {
		var geojson = {
			"type": "FeatureCollection",
			"features": [{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [lnglat.lng, lnglat.lat]
				}
			}]
		};
		//TODO FUCK
		(<any>(this.map)).addSource(key, {
			"type": "geojson",
			"data": geojson
		});
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