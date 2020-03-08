const TILE = {
	CLASS      : {
		WALL       : 'wall',
		SPACE      : 'space',
		PLAYER     : 'player',
		MOB        : 'mob',
		BOSS       : 'boss',
		CHEST      : 'chest',
		QUEST      : 'quest',
		GOAL       : 'goal'
	},
	CHAR       : {
		WALL       : '0',
		SPACE      : '.',
		PLAYER     : 'P',
		MOB        : 'm',
		BOSS       : 'B',
		CHEST      : 'X',
		QUEST      : '!',
		GOAL       : '?'
	}
}

/**
 * Displays the map on a web page, building all the necessary DOM elements to do so.
 * Param: contents - The content of the map, as a string.
 */
const displayContents = (contents) => {
	let map = document.getElementById('map');
	map.innerHTML = '';

	for (i = 0; i < contents.length; i ++) {
		let tile = document.createElement('span');
		let tileClass = document.createAttribute('class');
		let interactiveElmt = document.createElement('span');
		let interactiveElmtClass = document.createAttribute('class');
		if (contents[i] == TILE.CHAR.WALL) {
			tileClass.value = 'tile ' + TILE.CLASS.WALL;
		}
		else {
			tileClass.value = 'tile ' + TILE.CLASS.SPACE;
			switch (contents[i]) {
				case TILE.CHAR.SPACE:
					break;
				case TILE.CHAR.PLAYER:
					interactiveElmtClass.value = 'elmt ' + TILE.CLASS.PLAYER;
					interactiveElmt.setAttributeNode(interactiveElmtClass);
					tile.appendChild(interactiveElmt);
					break;
				case TILE.CHAR.MOB:
					interactiveElmtClass.value = 'elmt ' + TILE.CLASS.MOB;
					interactiveElmt.setAttributeNode(interactiveElmtClass);
					tile.appendChild(interactiveElmt);
					break;
				case TILE.CHAR.BOSS:
					interactiveElmtClass.value = 'elmt ' + TILE.CLASS.BOSS;
					interactiveElmt.setAttributeNode(interactiveElmtClass);
					tile.appendChild(interactiveElmt);
					break;
				case TILE.CHAR.CHEST:
					interactiveElmtClass.value = 'elmt ' + TILE.CLASS.CHEST;
					interactiveElmt.setAttributeNode(interactiveElmtClass);
					tile.appendChild(interactiveElmt);
					break;
				case TILE.CHAR.QUEST:
					interactiveElmtClass.value = 'elmt ' + TILE.CLASS.QUEST;
					interactiveElmt.setAttributeNode(interactiveElmtClass);
					tile.appendChild(interactiveElmt);
					break;
				case TILE.CHAR.GOAL:
					interactiveElmtClass.value = 'elmt ' + TILE.CLASS.GOAL;
					interactiveElmt.setAttributeNode(interactiveElmtClass);
					tile.appendChild(interactiveElmt);
					break;
				default:
					let lineBreak = document.createElement('br');
					map.appendChild(lineBreak);
					continue;
			}
		}
		tile.setAttributeNode(tileClass);
		map.appendChild(tile);
	}
}

/**
 * Populate the map with interactive elements.
 * Param: contents - The content of the map, as a string.
 */
const populateMap = (contents) => {
	let buff = '';
	let output = '';

	buff = populateMobs(contents);
	console.log('Temporary output:\n', buff);

	output = populateOthers(buff);
	console.log('Final output:\n', output);

	return output;
}

/**
 * Populate the map with mobs.
 * Param: contents - The content of the map, as a string.
 *        mobsMin - The minimum acceptable number of mobs.
 *        mobsMax - The maximum acceptable number of mobs.
 */
const populateMobs = (contents) => {
	let buff = '';
	let output = '';
	let availableSpaces = 0;
	let mobsPlaced      = 0;

	for (i = 0; i < contents.length; i ++) {
		if (contents[i] === TILE.CHAR.SPACE) {
			availableSpaces ++;
		}
		output += contents[i];
	}
	console.log('Available Slots: ', availableSpaces);

	const mobMin = availableSpaces / 5;
	const mobMax = availableSpaces / 4;

	while (mobsPlaced < mobMin) {
		for (i = 0; i < output.length; i ++) {
			if (output[i] === TILE.CHAR.SPACE && mobsPlaced < mobMax) {
				let val = Math.floor(Math.random() * 4);
				if (val == 0) {
					buff += TILE.CHAR.MOB;
					mobsPlaced ++;
				}
				else {
					buff += output[i];
				}
			}
			else {
				buff += output[i];
			}
		}
		console.log('Mobs placed: ', mobsPlaced);
		output = buff;
		buff = '';
	}

	return output;
}

/**
 * Populate the map with other interactive elements.
 * Param: contents - The content of the map, as a string.
 */
const populateOthers = (contents) => {
	let buff = '';
	let output = contents;
	let ratiobase = document.getElementById('ratiobase').value;
	let chestsPlaced    = 0;
	let questsPlaced    = 0;
	let goalsPlaced     = 0;
	let bossPlaced      = false;
	let playerPlaced    = false;

	while (! (playerPlaced && bossPlaced) || questsPlaced < 1 || goalsPlaced < questsPlaced || chestsPlaced < 1) {
		console.log('Placing interactive elements ...');
		for (i = 0; i < output.length; i ++) {
			if (output[i] === TILE.CHAR.SPACE) {
				let val = Math.floor(Math.random() * ratiobase);
				if (val < 1) {
					if (playerPlaced) {
						buff += output[i];
					}
					else {
						console.log('Placing player spawning point ...');
						buff += TILE.CHAR.PLAYER;
						playerPlaced = true;
					}
				}
				else if (val < 2) {
					if (bossPlaced) {
						buff += output[i];
					}
					else {
						console.log('Placing boss ...');
						buff += TILE.CHAR.BOSS;
						bossPlaced = true;
					}
				}
				else if (val < 4) {
					if (questsPlaced >= 3) {
						buff += output[i];
					}
					else {
						console.log('Placing quest ...');
						buff += TILE.CHAR.QUEST;
						questsPlaced ++;
					}
				}
				else if (val < 6) {
					if (goalsPlaced >= questsPlaced) {
						buff += output[i];
					}
					else {
						console.log('Placing goal ...');
						buff += TILE.CHAR.GOAL;
						goalsPlaced ++;
					}
				}
				else if (val < 9) {
					if (chestsPlaced >= 10) {
						buff += output[i];
					}
					else {
						console.log('Placing treasure chest ...');
						buff += TILE.CHAR.CHEST;
						chestsPlaced ++;
					}
				}
				else {
					buff += output[i];
				}
			}
			else {
				buff += output[i];
			}
		}
		output = buff;
		buff = '';
		console.log('Interactive elements placed.');
	}

	return output;
}

/**
 * Populate the download map link with the download url for the generated map.
 * Param: contents - The content of the map, as a string.
 */
const downloadMap = (contents) => {
	const type = 'text/plain;charset=utf-8';
	const filename = 'generated-map.txt';
	const file = new Blob([contents], {type: type});
	if (window.navigator.msSaveOrOpenBlob) { // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	}
	else { // Other browsers
		let a = document.getElementById('download');
		const url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
	}
}

/**
 * Evaluates the map, based on interactive elements spreading.
 * Param: contents - The content of the map, as a string.
 */
const scoreMap = (contents) => {
	let scoreDisplay = document.getElementById('score');
}

/**
 * Evaluates the distance between the player and the boss.
 * Param: contents - The content of the map, as a string.
 */
const evalDistPlayerBoss = (contents) => {}

/**
 * Evaluates the spreading of quests.
 * Param: contents - The content of the map, as a string.
 */
const evalQuestsSpread = (contents) => {}

/**
 * Evaluates the spreading of treasures.
 * Param: contents - The content of the map, as a string.
 */
const evalTreasureSpread = (contents) => {}

/**
 * Evaluates the spreading of mobs.
 * Param: contents - The content of the map, as a string.
 */
const evalMobsSpread = (contents) => {}

/**
 * Loads the map from a file.
 * Param: filename - The name of the map file to load.
 */
const loadFile = (filename) => {
	fetch(filename, {
		method: 'GET',
		headers: {
			'Content-Type': 'text/plain'
		}
	})
	.then((response) => {
		if (response.status !== 200) {
			console.log('Looks like there was a problem. Status Code: ' + response.status);
			return;
		}
		// Examine the text in the response
		response.text()
			.then((data) => {
				let map = populateMap(data);
				downloadMap(map);
				displayContents(map);
			});
	})
	.catch((err) => {
		console.log('Fetch Error :-S', err);
	});
}

/**
 * Loads a new map onto the page.
 */
const loadMap = () => {
	loadFile('./assets/map.txt');
}

/**
 * Self-invoked function to load the map on page load.
 */
(() => {
	loadMap();
})();
	