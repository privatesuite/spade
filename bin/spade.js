#!/usr/bin/env node

const spade = require("../src");
const _chalk = require("chalk").default;
const minimist = require("minimist");

function info (text) {

	console.log(`INFO ${chalk.cyan(text)}`);

}

function isNumber (value) {

	try {parseFloat(value); return true;} catch {return false;}

}

var args = minimist(process.argv.slice(2));

let chalk;

if (args.colorless) {

	chalk = new _chalk.constructor({level: 0});

} else {

	chalk = _chalk;

}

if (args._[0] && isNumber(args._[0])) {

	(async () => {

		function log (text) {

			console.log(`\t${text}`);

		}

		console.log("\n\n");
		log(chalk.cyan.bold.underline("Spade dug up these albums:"));
		// console.log("");

		let loc = await spade.getLocations(args.location || 0);
		let recentAlbums = await spade.getRecentAlbums(args._[0], args.location ? (loc)[0].id : undefined);

		if (args.sort === "newest") recentAlbums = recentAlbums.sort((a, b) => b.release_date - a.release_date);
		if (args.sort === "oldest") recentAlbums = recentAlbums.sort((a, b) => a.release_date - b.release_date);

		for (const album of recentAlbums) {

			console.log(`\n\n${"─".repeat(50)}\n\n`);

			log(`${chalk.bold(album.title)} by ${album.artist}`);
			log(`\n`);

			log(`${chalk.bold.cyan("URL")} ${album.url}`);
			log(`${chalk.bold.cyan("Genre")} ${album.genre}`);
			log(`${chalk.bold.cyan("Location")} ${album.location}`);
			log(`${chalk.bold.cyan("Release Date")} ${album.release_date.toUTCString()}`);
			log(`${chalk.bold.cyan("Featured Track")} ${album.featured_track.title}`);

		}

		console.log(`\n\n${"─".repeat(50)}\n\n`);

	})();

} else {

	info("Usage: spade <number_of_tracks>")

}
