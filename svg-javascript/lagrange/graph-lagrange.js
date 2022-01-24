const debug = false;

function init() {

    attachListeners();

    setupMinMax();

    sizeChanged();

    updateGraphAndDraw();
}

function attachListeners() {

    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', updateGraphAndDraw);
    }

    var input = document.getElementById('inputWidth');
    input.addEventListener('change', resizeAndUpdate);

    input = document.getElementById('inputHeight');
    input.addEventListener('change', resizeAndUpdate);
}

function attachListenersForNewInput(input) {
    input.addEventListener('change', updateGraphAndDraw);
}

function setupMinMax() {

    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].min = 1;
        inputs[i].max = 500;
    }

    var input = document.getElementById('inputWidth');
    input.max = 800;

    input = document.getElementById('inputHeight');
    input.max = 800;
}

function resizeAndUpdate() {
    sizeChanged();
    draw();
}

function sizeChanged() {

    var canvas = document.getElementById('canvas');

    var width = document.getElementById('inputWidth').value;
    var height = document.getElementById('inputHeight').value;

    canvas.width = new Number(width);
    canvas.height = new Number(height);
}

function setupLagrange(x1, y1, x2, y2, moreValues) {

    var lagrange = new Lagrange(x1, y1, x2, y2);
    if (moreValues) {
        moreValues.forEach(function (coord) {
            lagrange.addPoint(coord.x, coord.y);
        });
    }

    return lagrange;
}

function addFields() {

    var nextNumber = document.getElementsByClassName('x').length + 1;

    addFieldForX(nextNumber);
    addFieldForY(nextNumber);

    updateGraphAndDraw();
}

function addFieldForX(nextNumber) {

    var label = '<label for="x' + nextNumber + '">x' + nextNumber + '</label>';
    var input = '<input id="x' + nextNumber + '" class="x" value="0" type="number" />';

    var divX = document.getElementById('divX');
    divX.appendChild(htmlToElement(label));

    var inputNodeX = htmlToElement(input);
    divX.appendChild(inputNodeX);

    attachListenersForNewInput(inputNodeX);

    var previousInputIndex = divX.children.length - 3;
    var previousInput = divX.children[previousInputIndex];
    inputNodeX.value = previousInput.value;
}

function addFieldForY(nextNumber) {

    label = '<label for="y' + nextNumber + '">y' + nextNumber + '</label>';
    input = '<input id="y' + nextNumber + '" class="y" value="0" type="number" />';

    var divY = document.getElementById('divY');
    divY.appendChild(htmlToElement(label));

    var inputNodeY = htmlToElement(input);
    divY.appendChild(inputNodeY);

    attachListenersForNewInput(inputNodeY);

    var previousInputIndex = divY.children.length - 3;
    var previousInput = divY.children[previousInputIndex];
    inputNodeY.value = previousInput.value;
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function removeLastFields() {

    if (document.getElementById('divX').children.length == 4) {
        return;
    }

    removeLastField('divX');
    removeLastField('divX');
    removeLastField('divY');
    removeLastField('divY');

    updateGraphAndDraw();
}

function removeLastField(name) {
    var div = document.getElementById(name);
    var lastIndex = div.children.length - 1;
    div.removeChild(div.children[lastIndex]);
}

var lagrange;

function getValues() {

    var values = {};

    var arrayInputX = document.getElementsByClassName('x');
    var arrayInputY = document.getElementsByClassName('y');

    var arrayX = [];
    var arrayY = [];
    var moreValues;

    if (arrayInputX.length < 2 || arrayInputY.length < 2) {
        console.error('Erro');
        return;
    }

    for (var i = 0; i < arrayInputX.length; i++) {
        arrayX.push(arrayInputX[i].value);
    }

    for (var i = 0; i < arrayInputY.length; i++) {
        arrayY.push(arrayInputY[i].value);
    }

    if (arrayX.length > 2) {
        moreValues = [];
        for (var i = 2; i < arrayInputX.length; i++) {
            moreValues.push({
                x: arrayInputX[i].value,
                y: arrayInputY[i].value
            });
        }
    }

    values.arrayX = arrayX;
    values.arrayY = arrayY;
    values.moreValues = moreValues;

    return values;
}

function updateGraphAndDraw() {
    
    var values = getValues();

    lagrange = setupLagrange(values.arrayX[0], values.arrayY[0], values.arrayX[1], values.arrayY[1], values.moreValues);

    draw();
}

function draw() {

    var zoomX = new Number(document.getElementById('inputZoomX').value);
    var zoomY = new Number(document.getElementById('inputZoomY').value);

    var maximumX = new Number(document.getElementById('inputMaximumX').value);
    var maximumY = new Number(document.getElementById('inputMaximumY').value);

    privateDraw(zoomX, zoomY, maximumX, maximumY);
}

function privateDraw(zoomX, zoomY, maximumX, maximumY) {

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    clear(canvas, context);

    drawFrame(canvas, context);

    var gap = 50;

    context.lineWidth = 2;
    context.font = '16px Palatino';
    context.fillStyle = '#5c5';
    context.strokeStyle = '#5c5';


    var maximumYGraph = gap + (maximumY * zoomY);
    drawYAxys(context, gap, maximumYGraph, maximumY, zoomY);
    drawXAxys(context, gap, maximumYGraph, maximumX, zoomX);


    context.strokeStyle = '#88d';
    context.beginPath();

    drawGraph(context, gap, maximumX, maximumY, zoomX, zoomY);

    context.stroke();
}

function clear(canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawFrame(canvas, context) {

    context.lineWidth = 4;
    context.strokeStyle = '#449';
    context.beginPath();
    context.rect(4, 4, canvas.width - 8, canvas.height - 8);
    context.stroke();
}

function drawYAxys(context, gap, maximumYGraph, maximumY, zoomY) {

    var zeroY = 0;

    context.fillText('' + zeroY, 20, maximumYGraph);
    context.fillText('' + maximumY, 20, gap);
    context.beginPath();
    context.moveTo(gap, gap + (0 * zoomY));
    context.lineTo(gap, maximumYGraph);
    context.stroke();
}

function drawXAxys(context, gap, maximumYGraph, maximumX, zoomX) {

    var zeroX = 0;
    var maximumXGraph = gap + (maximumX * zoomX);

    context.fillText('' + zeroX, 50, maximumYGraph + 20);
    context.fillText('' + maximumX, maximumXGraph, maximumYGraph + 20);
    context.beginPath();
    context.moveTo(gap, maximumYGraph);
    context.lineTo(maximumXGraph, maximumYGraph);
    context.stroke();
}

function drawGraph(context, gap, maximumX, maximumY, zoomX, zoomY) {

    var first = true;

    var graphX = 0;
    var graphY = 0;
    var x, y;
    for (x = 0; x < maximumX; x++) {

        y = lagrange.valueOf(x);
        graphX = gap + x * zoomX;
        graphY = gap + y * zoomY;

        graphY = (gap + (((y * -1) + maximumY) * zoomY)).toFixed(2);

        if (debug) {
            console.log('x: ' + x + ', graphX: ' + graphX + ', y: ' + y + ', graphY: ' + graphY);
        }

        if (first) {
            context.moveTo(graphX, graphY);
            first = false;
        }
        context.lineTo(graphX, graphY);
    }
}