
var Lagrange = function (x1, y1, x2, y2) {

    this.xs = [x1, x2];
    this.ys = [y1, y2];
    this.ws = [];
    this._updateWeights();
}

/**
* Adds a new point to the polynomial. L(x) = y
* @return {Number} The index of the added point. Used for changing the point. See changePoint.
*/
Lagrange.prototype.addPoint = function (x, y) {
    this.xs.push(x);
    this.ys.push(y);
    this._updateWeights();
    return this.xs.length - 1;
}

/**
* Changes a previously added point.
*/
Lagrange.prototype.changePoint = function (index, x, y) {
    this.xs[index] = x;
    this.ys[index] = y;
    this._updateWeights();
}

/**
* Recalculate barycentric weights.
*/
Lagrange.prototype._updateWeights = function () {
    var k = this.xs.length;
    var w;

    for (var j = 0; j < k; ++j) {
        w = 1;
        for (var i = 0; i < k; ++i) {
            if (i != j) {
                w *= this.xs[j] - this.xs[i];
            }
        }
        this.ws[j] = 1 / w;
    }
}

/**
* Calculate L(x)
*/
Lagrange.prototype.valueOf = function (x) {
    var a = 0;
    var b = 0;
    var c = 0;

    for (var j = 0; j < this.xs.length; ++j) {
        if (x != this.xs[j]) {
            a = this.ws[j] / (x - this.xs[j]);
            b += a * this.ys[j];
            c += a;
        } else {
            return this.ys[j];
        }
    }
    var value = b / c;
    value = value.toFixed(2);
    return value;
}