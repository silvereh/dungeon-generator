async function displayContents() {
  var element = document.getElementById('map');
  const contents = await loadFile("./assets/map.txt");
  element.textContent = contents;
}

function loadFile(filename) {
  return new Promise(resolve => {
    var txt = '';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if(xmlhttp.status == 200 && xmlhttp.readyState == 4) {
        txt = xmlhttp.responseText;
      }
    };
    xmlhttp.open("GET", filename, true);
    xmlhttp.send();
    resolve(txt);
  });
}

(function () {
  displayContents();
})();