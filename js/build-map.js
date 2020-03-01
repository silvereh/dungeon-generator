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
		switch (contents[i]) {
			case TILE.CHAR.WALL:
				tileClass.value = 'tile ' + TILE.CLASS.WALL;
				break;
			case TILE.CHAR.SPACE:
				tileClass.value = 'tile ' + TILE.CLASS.SPACE;
				break;
			case TILE.CHAR.PLAYER:
				tileClass.value = 'tile ' + TILE.CLASS.SPACE;
				interactiveElmtClass.value = 'tile ' + TILE.CLASS.PLAYER;
				interactiveElmt.setAttributeNode(interactiveElmtClass);
				tile.appendChild(interactiveElmt);
				break;
			case TILE.CHAR.MOB:
				tileClass.value = 'tile ' + TILE.CLASS.SPACE;
				interactiveElmtClass.value = 'tile ' + TILE.CLASS.MOB;
				interactiveElmt.setAttributeNode(interactiveElmtClass);
				tile.appendChild(interactiveElmt);
				break;
			case TILE.CHAR.BOSS:
				tileClass.value = 'tile ' + TILE.CLASS.SPACE;
				interactiveElmtClass.value = 'tile ' + TILE.CLASS.BOSS;
				interactiveElmt.setAttributeNode(interactiveElmtClass);
				tile.appendChild(interactiveElmt);
				break;
			case TILE.CHAR.CHEST:
				tileClass.value = 'tile ' + TILE.CLASS.SPACE;
				interactiveElmtClass.value = 'tile ' + TILE.CLASS.CHEST;
				interactiveElmt.setAttributeNode(interactiveElmtClass);
				tile.appendChild(interactiveElmt);
				break;
			case TILE.CHAR.QUEST:
				tileClass.value = 'tile ' + TILE.CLASS.SPACE;
				interactiveElmtClass.value = 'tile ' + TILE.CLASS.QUEST;
				interactiveElmt.setAttributeNode(interactiveElmtClass);
				tile.appendChild(interactiveElmt);
				break;
			default:
				let lineBreak = document.createElement('br');
				map.appendChild(lineBreak);
				continue;
		}
		tile.setAttributeNode(tileClass);
		map.appendChild(tile);
	}
}

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
				displayContents(map);
			});
	})
	.catch((err) => {
		console.log('Fetch Error :-S', err);
	});
}

/**
 * Populate the map with interactive elements.
 * Param: contents - The content of the map, as a string.
 */
const populateMap = (contents) => {
	let output = '';
	let buff = '';
	let availableSpaces = 0;
	let mobsPlaced      = 0;
	let chestsPlaced    = 0;
	let questsPlaced    = 0;
	let goalsPlaced     = 0;
	let bossPlaced      = false;
	let playerPlaced    = false;

	// count available spaces.
	for (i = 0; i < contents.length; i ++) {
		if (contents[i] === TILE.CHAR.SPACE) {
			availableSpaces ++;
		}
		output += contents[i];
	}
	console.log('Available Slots: ', availableSpaces);

	const mobMin = availableSpaces / 5;
	const mobMax = availableSpaces / 4;

	// place random encounters.
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

	// place other interactive elements.
	while ((! playerPlaced) && (! bossPlaced) && (questsPlaced == 0) && (goalsPlaced < questsPlaced) && (chestsPlaced == 0)) {
		for (i = 0; i < output.length; i ++) {
			if (output[i] === TILE.CHAR.SPACE) {
				let val = Math.floor(Math.random() * 20);
				if (val == 0 && ! playerPlaced) {
					console.log('Placing player spawning point ...');
					buff += TILE.CHAR.PLAYER;
					playerPlaced = true;
				}
				else if (val == 1 && ! bossPlaced) {
					console.log('Placing boss ...');
					buff += TILE.CHAR.BOSS;
					bossPlaced = true;
				}
				else if ((val == 2 || val == 3) && questsPlaced < 3) {
					console.log('Placing quest ...');
					buff += TILE.CHAR.QUEST;
					questsPlaced ++;
				}
				else if ((val == 4 || val == 5) && goalsPlaced < questsPlaced) {
					console.log('Placing goal ...');
					buff += TILE.CHAR.GOAL;
					goalsPlaced ++;
				}
				else if ((val == 6 || val == 7 || val == 8) && chestsPlaced < 10) {
					console.log('Placing treasure chest ...');
					buff += TILE.CHAR.CHEST;
					chestsPlaced ++;
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
		console.log('Interactive Elements placed.');
	}

	output = output;
	console.log(output);
	return output;
}

(() => {
	loadFile('assets/map.txt');
})();
