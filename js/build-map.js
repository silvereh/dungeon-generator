function displayContents(contents) {
	let map = document.getElementById('map');
	map.innerHTML = '';

	for (i = 0; i < contents.length; i ++) {
		if (contents[i] === '0') {
			let tile = document.createElement('span');
			tile.setAttributeNode(wall);

			let wall = document.createAttribute('class');
			wall.value = 'tile wall';

			map.appendChild(tile);
		}
		else if (contents[i] === '-') {
			let tile = document.createElement('span');
			tile.setAttributeNode(space);

			let space = document.createAttribute('class');
			space.value = 'tile space';

			map.appendChild(tile);
		}
		else {
			let lineBreak = document.createElement('br');

			map.appendChild(lineBreak);
		}
	}
}

function loadFile(filename) {
	fetch(filename, {
		method: 'GET',
		headers: {
			'Content-Type': 'text/plain'
		}
	})
	.then(response => {
		if (response.status !== 200) {
			console.log('Looks like there was a problem. Status Code: ' + response.status);
			return;
		}

		// Examine the text in the response
		response.text().then(data => {
			console.log(data.length);
			displayContents(data);
		});
	})
	.catch(err => {
		console.log('Fetch Error :-S', err);
	});
}

(function () {
	loadFile('assets/map.txt');
})();
