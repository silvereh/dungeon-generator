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
		WALL       : ' ',
		SPACE      : '.',
		PLAYER     : 'P',
		MOB        : 'm',
		BOSS       : 'B',
		CHEST      : 'X',
		QUEST      : '!',
		GOAL       : '?'
	}
}
const MAP = {
	LENGTH    : {
		SM : 52,
		MD : 77,
		LG : 101
	},
	SUBNUM    : {
		SM : 3,
		MD : 4,
		LG : 5
	},
}

/**
 * Generates a random integer between 0 (included) and the specified number (not included)
 * Param: baserate - The maximum for the generated number.
 */
const getRandNum = (baserate) => {
	if (baserate <= 1) {
		return 0;
	}
	return Math.floor(Math.random() * baserate);
}

/**
 * Displays the map on a web page, building all the necessary DOM elements to do so.
 * Param: map - The map object.
 */
const displayContents = (map) => {
	let mapContainer = document.getElementById('map');
	mapContainer.innerHTML = '';

	for (i = 0; i < map.contents.length; i ++) {
		let tile = document.createElement('span');
		let tileClass = document.createAttribute('class');
		let interactiveElmt = document.createElement('span');
		let interactiveElmtClass = document.createAttribute('class');
		if (map.contents[i] == TILE.CHAR.WALL) {
			tileClass.value = 'tile ' + TILE.CLASS.WALL;
		}
		else {
			tileClass.value = 'tile ' + TILE.CLASS.SPACE;
			switch (map.contents[i]) {
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
					mapContainer.appendChild(lineBreak);
					continue;
			}
		}
		tile.setAttributeNode(tileClass);
		mapContainer.appendChild(tile);
	}
}

/**
 * Returns a map object, containing the string representation of the map, as well as the interactive elements of the map.
 * Param: contents - The content of the map, as a string.
 */
const getMapObject = (contents) => {
	if (contents.length == 0) {
		console.log('no map entered')
		return null;
	}
	let mapArr = contents.split('\n');
	console.log('mapArr: ', mapArr);
	let mapWidth = mapArr[0].length;
	let mapHeight = mapArr.length;

	let submapNumWidth = MAP.SUBNUM.SM;
	let submapNumHeight = MAP.SUBNUM.SM;
	let submapHeight = Math.ceil(mapHeight / submapNumHeight);
	let submapWidth = Math.ceil(mapWidth / submapNumWidth);

	if (mapWidth > MAP.LENGTH.SM) {
		submapNumWidth = MAP.SUBNUM.MD;
	}
	if (mapWidth > MAP.LENGTH.MD) {
		submapNumWidth = MAP.SUBNUM.LG;
	}
	if (mapHeight > MAP.LENGTH.SM) {
		submapNumHeight = MAP.SUBNUM.MD;
	}
	if (mapHeight > MAP.LENGTH.MD) {
		submapNumHeight = MAP.SUBNUM.LG;
	}

	let submaps = [];
	for (let i = 0; i < submapNumWidth; i ++) {
		for (let j = 0; j < submapNumHeight; j ++) {
			submaps.push({
				xmin : i == 0 ? 0 : i * submapWidth + 1,
				xmax : (i + 1) * submapWidth,
				ymin : j == 0 ? 0 : j * submapHeight + 1,
				ymax : (j + 1) * submapHeight,
				contents : ''
			});
		}
	}

	let buff = '';
	let output = '';
	let availableSpaces = 0;
	for (i = 0; i < contents.length; i ++) {
		if (contents[i] == TILE.CHAR.SPACE) {
			availableSpaces ++;
		}
		output += contents[i];
	}

	const mobsMin = Math.floor(availableSpaces / 5);
	const mobsMax = Math.floor(availableSpaces / 4);

	let mobrate = parseInt(document.getElementById('mobrate').value);
	if (mobrate <= 0) {
		mobrate = 0.1;
		document.getElementById('mobrate').value = 0,1;
	}
	let playerrate = parseInt(document.getElementById('playerrate').value);
	if (playerrate <= 0) {
		playerrate = 0.1;
		document.getElementById('playerrate').value = 0,1;
	}
	let bossrate = parseInt(document.getElementById('bossrate').value);
	if (bossrate <= 0) {
		bossrate = 0.1;
		document.getElementById('bossrate').value = 0,1;
	}
	let questrate = parseInt(document.getElementById('questrate').value);
	if (questrate <= 0) {
		questrate = 0.1;
		document.getElementById('questrate').value = 0,1;
	}
	let goalrate = parseInt(document.getElementById('goalrate').value);
	if (goalrate <= 0) {
		goalrate = 0.1;
		document.getElementById('goalrate').value = 0,1;
	}
	let chestrate = parseInt(document.getElementById('chestrate').value);
	if (chestrate <= 0) {
		chestrate = 0.1;
		document.getElementById('chestrate').value = 0,1;
	}
	let successrate = parseInt(document.getElementById('successrate').value);
	if (successrate <= 0) {
		successrate = 0.1;
		document.getElementById('successrate').value = 0,1;
	}

	let map = {
		contents     : output,
		height       : mapHeight,
		width        : mapWidth,
		submapHeight : submapHeight,
		submapWidth  : submapWidth,
		emptySpaces  : availableSpaces,
		mobsMin      : mobsMin,
		mobsMax      : mobsMax,
		mobrate      : mobrate,
		playerrate   : playerrate,
		bossrate     : bossrate,
		questrate    : questrate,
		goalrate     : goalrate,
		chestrate    : chestrate,
		successrate  : successrate,
		mobs         : [],
		quests       : [],
		goals        : [],
		chests       : [],
		submaps      : submaps,
		player       : null,
		boss         : null,
	};

	return map;
}

/**
 * Populate the map with interactive elements.
 * Param: map - The map object.
 */
const populateMap = (map) => {
	if (map == null) {
		console.log('no map entered')
		return false;
	}
	let buff = '';
	let output = '';
	if (map.playerrate + map.bossrate + map.questrate + map.goalrate + map.chestrate >= map.mobrate) {
		console.log('too few mobs compared to other interactive elements');
		return false;
	}
	if (map.mobrate + map.playerrate + map.bossrate + map.questrate + map.goalrate + map.chestrate >= 1000) {
		console.log('too many interactive elements');
		return false;
	}

	populateMobs(map);

	populateOthers(map);

	return true;
}

/**
 * Populate the map with mobs.
 * Param: map - The map object.
 */
const populateMobs = (map) => {
	if (map == null) {
		console.log('no map entered')
		return false;
	}

	let buff = '';
	let output = map.contents;
	let x = 0;
	let y = 0;

	while (map.mobs.length < map.mobsMin) {
		for (i = 0; i < output.length; i ++) {
			if (output[i] === TILE.CHAR.SPACE && map.mobs.length < map.mobsMax) {
				let val = getRandNum(1000);
				let success = getRandNum(100);
				if (val < map.mobrate && success < map.successrate) {
					buff += TILE.CHAR.MOB;
					map.mobs.push({
						x: x,
						y: y
					});
				}
				else {
					buff += output[i];
				}
			}
			else {
				buff += output[i];
			}
			if (output[i] != '\n') {
				x ++;
				if (x >= map.width) {
					x = 0;
					y ++;
				}
			}
		}
		console.log('Mobs placed: ', map.mobs.length);
		output = buff;
		buff = '';
		x = 0;
		y = 0;
	}

	map.contents = output;
	return true;
}

/**
 * Populate the map with other interactive elements.
 * Param: map - The map object.
 */
const populateOthers = (map) => {
	if (map == null) {
		console.log('no map entered')
		return false;
	}

	let buff = '';
	let output = map.contents;
	let x = 0;
	let y = 0;

	console.log('checking while conditions ...');
	while (map.player == null || map.boss == null || map.quests.length < 1 || map.goals.length < map.quests.length || map.chests.length < 1) {
		console.log('Placing interactive elements ...');
		for (i = 0; i < output.length; i ++) {
			if (output[i] === TILE.CHAR.SPACE) {
				let val = getRandNum(1000);
				let success = getRandNum(100);
				if (success >= successrate) {
					buff += output[i];
				}
				else if (val < map.playerrate) {
					if (map.player != null) {
						buff += output[i];
					}
					else {
						console.log('Placing player spawning point ...');
						buff += TILE.CHAR.PLAYER;
						map.player = {
							x : x,
							y : y
						};
					}
				}
				else if (val < (map.playerrate + map.bossrate)) {
					if (map.boss != null) {
						buff += output[i];
					}
					else {
						console.log('Placing boss ...');
						buff += TILE.CHAR.BOSS;
						map.boss = {
							x : x,
							y : y
						};
					}
				}
				else if (val < (map.playerrate + map.bossrate + map.questrate)) {
					if (map.quests.length >= Math.sqrt(map.submaps.length)) {
						buff += output[i];
					}
					else {
						console.log('Placing quest ...');
						buff += TILE.CHAR.QUEST;
						map.quests.push({
							x: x,
							y: y
						});
					}
				}
				else if (val < (map.playerrate + map.bossrate + map.questrate + map.goalrate)) {
					if (map.goals.length >= map.quests.length) {
						buff += output[i];
					}
					else {
						console.log('Placing goal ...');
						buff += TILE.CHAR.GOAL;
						map.goals.push({
							x: x,
							y: y
						});
					}
				}
				else if (val < (map.playerrate + map.bossrate + map.questrate + map.goalrate + map.chestrate)) {
					if (map.chests.length >= map.submaps.length) {
						buff += output[i];
					}
					else {
						console.log('Placing treasure chest ...');
						buff += TILE.CHAR.CHEST;
						map.chests.push({
							x: x,
							y: y
						});
					}
				}
				else {
					buff += output[i];
				}
			}
			else {
				buff += output[i];
			}
			if (output[i] != '\n') {
				x ++;
				if (x >= map.width) {
					x = 0;
					y ++;
				}
			}
		}
		console.log('Interactive elements placed.');
		output = buff;
		buff = '';
		x = 0;
		y = 0;
	}

	map.contents = output;
	return true;
}

/**
 * Populate the download map link with the download url for the generated map.
 * Param: map - The map object.
 */
const downloadMap = (map) => {
	const type = 'text/plain;charset=utf-8';
	const filename = 'generated-map.txt';
	const file = new Blob([map.contents], {type: type});
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
 * Divides the map in subsections for evaluation purposes.
 * Param: map - The map object.
 */
const divideMap = (map) => {
	if (map == null) {
		return false;
	}

	let x = 0;
	let y = 0;

	for (let i = 0; i < map.contents.length; i ++) {
		if (map.contents[i] != '\n') {
			for (let j = 0; j < map.submaps.length; j ++) {
				if (x <= map.submaps[j].xmax && x >= map.submaps[j].xmin &&
						y <= map.submaps[j].ymax && y >= map.submaps[j].ymin) {
					map.submaps[j].contents += map.contents[i];
				}
			}
			if (x < map.width) {
				x ++;
			}
			else {
				x = 0;
				y ++;
			}
		}
	}

	return true;
}

/**
 * Evaluates the map, based on interactive elements spreading.
 * Param: map - The map object.
 */
const scoreMap = (map) => {
	if (map == null) {
		return false;
	}

	let scoreDisplay = document.getElementById('score');
	divideMap(map);

	console.log('Map to evaluate: ', map);
	let playerBossScore = evalDistPlayerBoss(map);
	console.log('Player / Boss score: ', playerBossScore);
	let mobSpreadScore = evalMobsSpread(map);
	console.log('Mob spread score: ', mobSpreadScore);
	let questSpreadScore = evalQuestsSpread(map);
	console.log('Quest spread score: ', questSpreadScore);
	let chestSpreadScore = evalTreasureSpread(map);
	console.log('Chest spread score: ', chestSpreadScore);

	let score = 25 * (playerBossScore + mobSpreadScore + questSpreadScore + chestSpreadScore) / 4;
	console.log('Map score: ', score);
	scoreDisplay.value = score
}

/**
 * Evaluates the distance between the player and the boss.
 * Param: map - The map object.
 * Return: score - Integer between 0 and 4 included.
 */
const evalDistPlayerBoss = (map) => {
	console.log('Player coord: \n x: ', map.player.x, '\n y: ', map.player.y);
	console.log('boss coord: \n x: ', map.boss.x, '\n y: ', map.boss.y);
	let distance = Math.sqrt(Math.pow(Math.abs(map.boss.x - map.player.x), 2) + Math.pow(Math.abs(map.boss.y - map.player.y), 2));
	console.log('distance: ', distance);
	console.log('map size: ', map.width);
	let score = 0;
	if (distance < map.width / 2) {
		score = 0;
	}
	else if (distance < map.width * 2 / 3) {
		score = 1;
	}
	else if (distance < map.width * 3 / 4) {
		score = 2;
	}
	else if (distance < map.width * 4 / 5) {
		score = 3;
	}
	else if (distance < map.width * 6 / 5) {
		score = 4;
	}
	else if (distance < map.width * 5 / 4) {
		score = 3;
	}
	else if (distance < map.width * 4 / 3) {
		score = 2;
	}
	else if (distance < map.width * 3 / 2) {
		score = 1;
	}

	return score;
}

/**
 * Evaluates the spreading of quests.
 * Param: map - The map object.
 * Return: score - Integer between 0 and 4 included.
 */
const evalQuestsSpread = (map) => {
	let maxQuest = 0;
	let buff = 0;
	for (let i = 0; i < map.submaps.length; i ++) {
		for (let j = 0; j < map.submaps[i].contents.length; j ++) {
			if (map.submaps[i][j] == TILE.CHAR.QUEST || map.submaps[i][j] == TILE.CHAR.GOAL) {
				buff ++;
			}
		}
		if (buff > maxQuest) {
			maxQuest = buff;
		}
	}

	let score = 0;
	switch (maxQuest) {
		case 1: 
			score = 4;
			break;
		case 2: 
			score = 2;
			break;
		case 3:
			score = 1;
		default:
			break;
	}
	return score;
}

/**
 * Evaluates the spreading of treasures.
 * Param: map - The map object.
 * Return: score - Integer between 0 and 4 included.
 */
const evalTreasureSpread = (map) => {
	let maxChest = 0;
	let buff = 0;
	for (let i = 0; i < map.submaps.length; i ++) {
		for (let j = 0; j < map.submaps[i].contents.length; j ++) {
			if (map.submaps[i][j] == TILE.CHAR.CHEST) {
				buff ++;
			}
		}
		if (buff > maxChest) {
			maxChest = buff;
		}
	}

	let score = 0;
	switch (maxChest) {
		case 1: 
			score = 4;
			break;
		case 2: 
			score = 2;
			break;
		case 3:
			score = 1;
		default:
			break;
	}
	return score;
}

/**
 * Evaluates the spreading of mobs.
 * Param: map - The map object.
 * Return: score - Integer between 0 and 4 included.
 */
const evalMobsSpread = (map) => {
	let maxMob = 0;
	let minMob = 1000;
	let buff = 0;
	for (let i = 0; i < map.submaps.length; i ++) {
		for (let j = 0; j < map.submaps[i].contents.length; j ++) {
			if (map.submaps[i][j] == TILE.CHAR.MOB) {
				buff ++;
			}
		}
		if (buff < minMob) {
			minMob = buff;
		}
		if (buff > maxMob) {
			maxMob = buff;
		}
	}

	let score = 0;
	if (maxMob - minMob < 10) {
		score = 4;
	}
	else if (maxMob - minMob < 20) {
		score = 3;
	}
	else if (maxMob - minMob < 30) {
		score = 2;
	}
	else if (maxMob - minMob < 40) {
		score = 1;
	}
	return score;
}

/**
 * Trim outer walls to improve map scoring.
 * Param: contents - The content of the map, as a string.
 * Param: map - The map object.
 */
const trimOuterWalls = (contents) => {
	let mapArr = contents.split('\n');
	console.log('mapArr: ', mapArr);
	let mapArrR = [];
	for (let k = 0; k < mapArr.length; k ++) {
		mapArrR.push('');
	}
	for (let i = 0; i < mapArr.length; i ++) {
		console.log('line empty: ', mapArr[i].trim() == '');
		if (mapArr[i].trim() != '') {
			for (let j = 0; j < mapArr[i].length; j++) {
				mapArrR[j] += mapArr[i][j];
			}
		}
	}
	let outputArr = [];
	for (let o = 0; o < mapArrR[0].length; o ++) {
		outputArr.push('');
	}
	console.log('mapArrR: ', mapArrR);
	for (let m = 0; m < mapArrR.length; m ++) {
		console.log('line empty: ', mapArrR[m].trim() == '');
		if (mapArrR[m].trim() != '') {
			for (let l = 0; l < mapArrR[m].length; l ++) {
				outputArr[l] += mapArrR[m][l];
			}
		}
	}
	console.log('outputArr: ', outputArr);
	let outputStr = '';
	for (let n = 0; n < outputArr.length; n ++) {
		outputStr += outputArr[n];
		outputStr += '\n';
	}
	console.log('outputStr: ', outputStr);
	return outputStr;
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
				let map = getMapObject(trimOuterWalls(data));
				populateMap(map);
				downloadMap(map);
				displayContents(map);
				scoreMap(map);
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
	