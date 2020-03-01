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
				tileClass.value = TILE.CLASS.WALL.prepend('tile ');
				break;
			case TILE.CHAR.SPACE:
				tileClass.value = TILE.CLASS.SPACE.prepend('tile ');
				break;
			case TILE.CHAR.PLAYER:
				tileClass.value = TILE.CLASS.SPACE.prepend('tile ');
				interactiveElmtClass.value = TILE.CLASS.PLAYER.prepend('tile ');
				interactiveElmt.setAttribute(interactiveElmtClass);
				tile.appendChild(interactiveElmt);
				break;
			case TILE.CHAR.MOB:
				tileClass.value = TILE.CLASS.SPACE.prepend('tile ');
				interactiveElmtClass.value = TILE.CLASS.MOB.prepend('tile ');
				interactiveElmt.setAttribute(interactiveElmtClass);
				tile.appendChild(interactiveElmt);
				break;
			case TILE.CHAR.BOSS:
				tileClass.value = TILE.CLASS.SPACE.prepend('tile ');
				interactiveElmtClass.value = TILE.CLASS.BOSS.prepend('tile ');
				interactiveElmt.setAttribute(interactiveElmtClass);
				tile.appendChild(interactiveElmt);
				break;
			case TILE.CHAR.CHEST:
				tileClass.value = TILE.CLASS.SPACE.prepend('tile ');
				interactiveElmtClass.value = TILE.CLASS.CHEST.prepend('tile ');
				interactiveElmt.setAttribute(interactiveElmtClass);
				tile.appendChild(interactiveElmt);
				break;
			case TILE.CHAR.QUEST:
				tileClass.value = TILE.CLASS.SPACE.prepend('tile ');
				interactiveElmtClass.value = TILE.CLASS.QUEST.prepend('tile ');
				interactiveElmt.setAttribute(interactiveElmtClass);
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
				populateMap(data);
			})
			.then((data) => {
				displayContents(data);
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
	let availableSpaces = 0,
			mobsPlaced      = 0,
			chestsPlaced    = 0,
			questsPlaced    = 0,
			goalsPlaced     = 0,
			bossPlaced      = false,
			playerPlaced    = false,

	// count available spaces.
	for (i = 0; i < contents.length; i ++) {
		if (contents[i] === TILE.CHAR.SPACE) {
			availableSpaces ++;
		}
	}

	const mobMin = availableSpaces / 5;
	const mobMax = availableSpaces / 4;

	// place random encounters.
	while (mobsPlaced < mobMin) {
		for (i = 0; i < contents.length; i ++) {
			if (mobsPlaced < mobMax) {
				contents[i] = TILE.CHAR.MOB;
				mobsPlaced ++;
			}
		}
	}

	// place other interactive elements.
	while ((! playerPlaced) && (! bossPlaced) && (! questsPlaced) && (! goalsPlaced) && (! chestsPlaced)) {
		for (i = 0; i < contents.length; i ++) {
			if (contents[i] === TILE.CHAR.SPACE) {
				let val = Math.floor(Math.random() * 20);
				switch (val) {
					case 0:
						if (! playerPlaced) {
							contents[i] = TILE.CHAR.PLAYER;
							playerPlaced = true;
						}
						break;
					case 1:
						if (! bossPlaced) {
							contents[i] = TILE.CHAR.BOSS;
							bossPlaced = true;
						}
						break;
					case 2:
					case 3:
						if (questsPlaced < 3) {
							contents[i] = TILE.CHAR.QUEST;
							questsPlaced ++;
						}
						break;
					case 4:
					case 5:
						if (goalsPlaced < (questsPlaced + 1)) {
							contents[i] = TILE.CHAR.GOAL;
							goalsPlaced ++;
						}
						break;
					case 6:
					case 7:
					case 8:
						if (chestsPlaced < 5) {
							contents[i] = TILE.CHAR.CHEST;
							chestsPlaced ++;
						}
						break;
					default:
				}
			}
		}
	}

	console.log(contents);
	return contents;
}

(() => {
	loadFile('assets/map.txt');
})();
