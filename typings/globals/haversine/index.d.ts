declare module 'haversine' {
	interface latlng {
		latitude: number;
		longitude: number;
	}

	interface Options {
		unit?: string;
		threshold?: number;
	}
	
	function haversine(a: latlng, b: latlng, opts?: Options): number;

	export = haversine;
}