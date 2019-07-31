let axios;
if (typeof require !== "undefined") axios = require("axios").default;

let proxy = "";

function capitalizeFirstLetter (string) {

	return string.charAt(0).toUpperCase() + string.slice(1);

}

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

	// async getRecentAlbums (albums, location) {

	// 	var _ = [];
	// 	var page = 1;

	// 	async function getPage (page) {

	// 		return (await axios.post(proxy + "https://bandcamp.com/api/hub/2/dig_deeper", {
		
	// 			filters: {
					
	// 				format: "all",
	// 				location: parseInt(location || "0"),
	// 				sort: "date",
	// 				tags: ["vaporwave"]
				
	// 			},
				
	// 			page
		
	// 		})).data;

	// 	}

	// 	while (_.length < albums) {

	// 		_.push(...(await getPage(page++)).items);

	// 	}

	// 	_ = _.slice(0, albums);

	// 	return _;
		
	// }

	async getRecentAlbums (albums, location = 0) {

		var _ = [];
		var page = 0;

		function convert (_) {

			return {

				title: _.primary_text,

				url: `https://${_.url_hints.subdomain}.${"bandcamp.com"}/album/${_.url_hints.slug}`,
				genre: capitalizeFirstLetter(_.genre_text),
				artist: _.secondary_text,
				location: _.location_text || "Unknown",
				release_date: new Date(_.publish_date),

				featured_track: _.featured_track,

				album_cover: size => `https://f4.bcbits.com/img/${_.type}${_.art_id}_${size}.jpg`,
				bio_image: size => `https://f4.bcbits.com/img/${_.bio_image.id}_${size}.jpg`,

			}

		}

		async function getPage (page) {

			return (await axios.get(proxy + `https://bandcamp.com/api/discover/3/get_web?g=electronic&s=new&p=${page}&gn=${location}&f=all&t=vaporwave&lo=true&lo_action_url=https%3A%2F%2Fbandcamp.com`)).data;

		}

		while (_.length < albums) {

			let p = await getPage(page);
			if (p.items.length === 0) return _;
			_.push(...(p).items.map(convert));
			page++;

		}

		_ = _.slice(0, albums);

		return _;
		
	}

}
