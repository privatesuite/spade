if (typeof require !== "undefined") var axios = require("axios").default;

let proxy = "";

function capitalizeFirstLetter (string) {

	return string.charAt(0).toUpperCase() + string.slice(1);

}

const Spade = {
	
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

	async getRecentAlbums (albums, location = 0, genre = "electronic", subgenre = "vaporwave") {

		let _ = [];
		let page = 0;

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

			return (await axios.get(proxy + `https://bandcamp.com/api/discover/3/get_web?g=${genre}&s=new&p=${page}&gn=${location}&f=all&t=${subgenre}&lo=true&lo_action_url=https%3A%2F%2Fbandcamp.com`)).data;

		}

		while (_.length < albums) {

			let p = await getPage(page);
			if (p.items.length === 0) return _;
			_.push(...(p).items.map(convert));
			page++;

		}

		_ = _.slice(0, albums);

		return _;
		
	},

	async getAlbum (url) {

		let p = (await axios.get(url)).data;

		let raw = (new Function("return " + p.slice(p.indexOf("var TralbumData =") + "var TralbumData =".length, p.indexOf("if ( window.FacebookData )") - 1).trim().slice(0, -1)))();

		var album = {

			url,
			title: raw.current.title,
			artist: raw.artist,
			
			description: raw.current.about,
			release_date: new Date(raw.current.publish_date),
			minimum_price: raw.current.minimum_price

		}

		let i = 0;

		album.tracks = raw.trackinfo.map(_ => {

			return {

				album,

				position: i++,
				title: _.title,
				file: _.file,
				isFeatured: _.id === album.featured_track_id,
				duration: _.duration

			}

		});

		return album;

	}

}

if (typeof module !== "undefined") module.exports = Spade;
