const axios = require("axios").default;

let proxy = "";

module.exports = {
	
	setProxy (_proxy) {

		proxy = _proxy;

	},

	async getLocations (location) {

		return (await axios.post(proxy + "https://bandcamp.com/api/location/1/geoname_search", {
		
			q: location,
			
			n: 5,
			geocoder_fallback: true
	
		})).data.results;

	},

	async getRecentAlbums (albums, location) {

		var _ = [];
		var page = 1;

		async function getPage (page) {

			return (await axios.post(proxy + "https://bandcamp.com/api/hub/2/dig_deeper", {
		
				filters: {
					
					format: "all",
					location: parseInt(location || "0"),
					sort: "date",
					tags: ["vaporwave"]
				
				},
				
				page
		
			})).data;

		}

		while (_.length < albums) {

			_.push(...(await getPage(page++)).items);

		}

		_ = _.slice(0, albums);

		return _;
		
	}

}
