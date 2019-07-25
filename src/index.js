const axios = require("axios").default;

module.exports = {
	
	async getLocations (location) {

		return (await axios.post("https://bandcamp.com/api/location/1/geoname_search", {
		
			q: location,
			
			n: 5,
			geocoder_fallback: true
	
		})).data.results;

	},

	async getRecentTracks (tracks, location) {

		var _ = [];
		var page = 1;

		async function getPage (page) {

			return (await axios.post("https://bandcamp.com/api/hub/2/dig_deeper", {
		
				filters: {
					
					format: "all",
					location: parseInt(location || "0"),
					sort: "date",
					tags: ["vaporwave"]
				
				},
				
				page
		
			})).data;

		}

		while (_.length < tracks) {

			_.push(...(await getPage(page++)).items);

		}

		_ = _.slice(0, tracks);

		return _;
		
	}

}
