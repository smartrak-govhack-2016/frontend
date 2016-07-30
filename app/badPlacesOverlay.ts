
import ToolTip = require('./toolTip');
import HeatData = require('./heatDataBikes');

export = class BadPlacesOverlay {
	constructor(map: L.Map) {
		let danger = <L.PathOptions>{ color: 'red', fillColor: 'red' };
		let safeish = <L.PathOptions>{ color: 'orange', fillColor: 'orange' };
		
		//Roundabout with no alternative
		let roundaboutsWithoutPaths = new L.FeatureGroup([
			new L.Circle(new L.LatLng(-37.738706, 175.253815), 50, danger),
			new L.Circle(new L.LatLng(-37.768764, 175.301864), 50, danger),
			new L.Circle(new L.LatLng(-37.802134, 175.305265), 50, danger),
			new L.Circle(new L.LatLng(-37.792414, 175.281458), 50, danger),
			new L.Circle(new L.LatLng(-37.793787, 175.285696), 50, danger),
			new L.Circle(new L.LatLng(-37.794847, 175.284569), 50, danger),
			new L.Circle(new L.LatLng(-37.790939, 175.279527), 50, danger),
			new L.Circle(new L.LatLng(-37.794775, 175.247823), 50, danger),
			new L.Circle(new L.LatLng(-37.774718, 175.284719), 50, danger),
			new L.Circle(new L.LatLng(-37.772674, 175.293506), 50, danger),
			new L.Circle(new L.LatLng(-37.762238, 175.288174), 50, danger),
			new L.Circle(new L.LatLng(-37.720012, 175.240951), 50, danger),
			new L.Circle(new L.LatLng(-37.769290, 175.239776), 50, danger),
			new L.Circle(new L.LatLng(-37.785232, 175.271480), 50, danger),
			new L.Circle(new L.LatLng(-37.730573, 175.273358), 50, danger),
			new L.Circle(new L.LatLng(-37.757772, 175.246101), 50, danger),
			new L.Circle(new L.LatLng(-37.789752, 175.310200), 50, danger),
			new L.Circle(new L.LatLng(-37.781756, 175.315645), 50, danger),
			new L.Circle(new L.LatLng(-37.780895, 175.319250), 50, danger),
			new L.Circle(new L.LatLng(-37.731973, 175.285331), 50, danger),
		]);
		new ToolTip(roundaboutsWithoutPaths, 'Roundabout without suitable crossing area');
		let roundaboutsWithoutPathsAndCrashes = new L.FeatureGroup([
			new L.Circle(new L.LatLng(-37.800871, 175.319143), 50, danger),
			new L.Circle(new L.LatLng(-37.801049, 175.322657), 50, danger),
		]);
		new ToolTip(roundaboutsWithoutPathsAndCrashes, 'Roundabout without suitable crossing area<br/>Previous bicycle crash in area');
		
		let roundaboutsWithoutPathsBlahBlah = new L.FeatureGroup([
			roundaboutsWithoutPaths,
			roundaboutsWithoutPathsAndCrashes
		])
		map.addLayer(roundaboutsWithoutPathsBlahBlah);

		//Roundabout with paths
		let roundaboutsWithPaths = new L.FeatureGroup([
			new L.Circle(new L.LatLng(-37.739550, 175.261862), 50, safeish),
			new L.Circle(new L.LatLng(-37.744246, 175.274602), 50, safeish),
			new L.Circle(new L.LatLng(-37.750485, 175.293536), 50, safeish),
			new L.Circle(new L.LatLng(-37.731905, 175.259453), 50, safeish),
			new L.Circle(new L.LatLng(-37.727416, 175.257114), 50, safeish),
			new L.Circle(new L.LatLng(-37.723054, 175.254078), 50, safeish),
			new L.Circle(new L.LatLng(-37.782740, 175.252790), 50, safeish),
			new L.Circle(new L.LatLng(-37.726975, 175.258734), 50, safeish),
			new L.Circle(new L.LatLng(-37.725032, 175.272113), 50, safeish),
			new L.Circle(new L.LatLng(-37.781788, 175.308749), 50, safeish),
			new L.Circle(new L.LatLng(-37.781800, 175.305625), 50, safeish),
			new L.Circle(new L.LatLng(-37.727268, 175.251852), 50, safeish),
		])
		new ToolTip(roundaboutsWithPaths, 'Roundabout suitable for crossing');
		map.addLayer(roundaboutsWithPaths);


		let crashLayer = new (<any>L).HeatLayer(HeatData, { radius: 10, max: 0.04 });
		map.addLayer(crashLayer);


		L.control.layers(null, {
			'Dangerous Areas': roundaboutsWithoutPathsBlahBlah,
			'Warning Areas': roundaboutsWithPaths,
			'Crashes': crashLayer
		}).addTo(map);

	}
};
