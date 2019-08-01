const spade = require("../src");

async function main () {

	console.log(await spade.getAlbum("https://australmusic.bandcamp.com/album/reflect"));

}

main();
