function displayContents(contents) {
	var element = document.getElementById('map');
	element.textContent = contents;
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
