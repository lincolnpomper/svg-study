function FileLoader() {

  function loadFile(fileName, callBack) {
    Snap.load(fileName, callBack);
  }

  function loadSvgPaths(pathsFromFile, fileNames, callBack) {

    if (fileNames.length == 0) {
      callBack(pathsFromFile);
      return;
    }

    var fileName = fileNames.pop();
    Snap.load(fileName, function (loadedSvg) {
      var path = loadedSvg.select("g").select('path').attr('d');
      pathsFromFile.push(path);
      loadSvgPaths(pathsFromFile, fileNames, callBack);
    });
  }

  return {
    loadFile: loadFile,
    loadSvgPaths: loadSvgPaths
  }
}

var fileLoader = new FileLoader();