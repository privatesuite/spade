const spade = require("../src");
const assert = require("assert");

async function main () {

	const xxyyxx = await spade.getAlbum("https://xxyyxx.bandcamp.com/album/xxyyxx");

	assert(xxyyxx.tracks[0].title === "About You", "Spade getAlbum");

	console.log("Tests Passed");

}

main();
