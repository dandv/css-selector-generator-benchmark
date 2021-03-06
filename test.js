var libraries = {}


function addLibrary(name, callback) {
  libraries[name] = callback;
}


function runTests() {

  results = {};

  for (key in libraries) {
    var testFunction = libraries[key];
    results[key] = getResults(testFunction);
  }

  drawResults(results);

}


function drawResults(results) {
  var wrapper = document.querySelector('#results');
  wrapper.innerHTML = '';

  var output = document.createDocumentFragment()

  function addCell(row, content) {
    var cell = row.appendChild(document.createElement('td'));
    cell.appendChild(document.createTextNode(content));
    return cell;
  }

  for (key in results) {
    var data = results[key];
    var row = output.appendChild(document.createElement('tr'));

    addCell(row, key);
    addCell(row, data.validSelectors.length);
    addCell(row, data.invalidSelectors.length);
    addCell(row, data.notFoundSelectors);
    addCell(row, data.nonUniqueSelectors.length);
    addCell(row, data.nonMatchingSelectors.length);
    addCell(row, "(" + data.longestSelector.length + ") " + data.longestSelector);
    addCell(row, data.duration + "ms");

  }

  wrapper.appendChild(output);

  console.log(results);

}


function getResults(testFunction) {

  var elements = document.querySelector('#wrap').querySelectorAll('*');

  var result = {
    duration: -1,
    validSelectors: [],
    invalidSelectors: [],
    nonUniqueSelectors: [],
    nonMatchingSelectors: [],
    notFoundSelectors: 0,
    longestSelector: ''
  };
  var outputs = [];

  var timeStart = (new Date).getTime();

  for (var i = 0, j = elements.length; i < j; i++) {
    var element = elements[i];
    var selector = testFunction(element);
    outputs.push({
      element: element,
      selector: selector
    });
  }

  var timeEnd = (new Date).getTime();
  result.duration = timeEnd - timeStart

  for (i = 0, j = outputs.length; i < j; i++) {
    var selector = outputs[i].selector;
    var element = outputs[i].element;

    if (selector) {

      var foundElements = []

      try {
        foundElements = document.querySelectorAll(selector);
      } catch (e) {
        result.invalidSelectors.push(selector);
      }


      if (foundElements.length > 1) {
        result.nonUniqueSelectors.push(selector);
      } else {
        if (foundElements[0] === element) {
          result.validSelectors.push(selector);
        } else {
          result.nonMatchingSelectors.push(selector);
        }
      }

      if (selector.length > result.longestSelector.length) {
        result.longestSelector = selector;
      }

    } else {
      result.notFoundSelectors++;
    }

  }

  return result;

}
