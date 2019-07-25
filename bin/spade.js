#!/usr/bin/env node

const _chalk = require("chalk").default;
const spade = require("../src");

function info (text) {

	console.log(`INFO ${chalk.cyan(text)}`);

}

function isNumber (value) {

	try {parseFloat(value); return true;} catch {return false;}

}

var args = process.argv.slice(2);

let chalk;

if (args.indexOf("colorless") !== -1) {

	chalk = new _chalk.constructor({level: 0});

} else {

	chalk = _chalk;

}

if (args[0] && isNumber(args[0])) {

	(async () => {

		function log (text) {

			console.log(`\t${text}`);

		}

		console.log("\n\n");
		log(chalk.cyan.bold.underline("Spade dug up these albums:"));
		// console.log("");

		for (const album of await spade(args[0])) {

			console.log(`\n\n${"─".repeat(50)}\n\n`);

			log(`${chalk.bold(album.title)} by ${album.band_name}`);
			log(`\n`);

			log(`${chalk.bold.cyan("URL")} ${album.tralbum_url}`);
			log(`${chalk.bold.cyan("Genre")} ${album.genre}`);
			log(`${chalk.bold.cyan("Featured Track")} ${album.featured_track_title}`);

		}

		console.log(`\n\n${"─".repeat(50)}\n\n`);

	})();

} else {

	info("Usage: spade <number_of_tracks>")

}
