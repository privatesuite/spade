const spade = require("../src");

async function main () {

	const testAlbum = await spade.getAlbum("https://xxyyxx.bandcamp.com/album/xxyyxx");

	console.log(testAlbum.tracks);

}

main();
