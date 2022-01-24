var snapMode1;
var snapMode2;

var path;

var pathLeftStretch = 'm 105.16032,177.57207 c -3.86068,3.48828 -10.159999,1.58187 -11.744592,-3.57662 L 37.250095,35.300625 c 0.004,-6.158489 5.426399,-7.270658 9.097214,-4.358439 L 181.46776,138.13195 c 4.41909,1.87243 10.28433,-0.16324 11.22555,-4.50184 l 0.33818,-47.154577 c -0.52798,-5.62755 -6.96399,-6.71825 -10.25076,-3.60879 z';
var pathRightStretch = 'm 127.33651,137.86679 c -5,3 -11.55473,0.15849 -12,-5 V 86.866743 c 0,-6.15849 6.87172,-7.23774 10,-4 l 77,94.000047 c 2.89999,3.50003 8.29828,3.80032 11,0 l 57,-140.000046 c 2,-5.999998 -3,-8.999997 -7,-6.999998 z';
var pathCenter = 'm 108.53786,162.62685 c -5,3 -12.981179,-0.317 -13.426449,-5.47549 l 0.05205,-80.595287 c 0.004,-6.15849 9.169889,-8.03021 12.298169,-4.79247 l 93.9783,90.757907 c 2.89999,3.50003 9.09075,1.89839 10.68301,-2.06043 l -0.0618,-85.175037 c 0.17731,-7.74344 -7.67559,-9.23774 -10.96236,-6.12828 z';

var pathMode2Center = 'M 50.0,50.0 L 50.0,50.0 L 50.0,50.0 L 50.0,50.0 z';
var pathMode2Left = 'M 0.0,0.0 L 26.0,99.4 L 99.0,35.0 L 100.0,45.0 z';
var pathMode2Right = 'M 2.5,32.4 L 0.0,43.4 L 99.3,0.0 L 73.0,100.0 z';

var durationLeft = 800;
var durationRight = 800;
var durationCenter = 900;
var duration = durationLeft + durationRight + durationCenter;

var running = false;
var progressAnimation;

const inOutElastic = function (n) {
    var s, a = 0.1, p = 0.4;
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (!a || a < 1) { a = 1; s = p / 4; }
    else s = p * Math.asin(1 / a) / (2 * Math.PI);
    if ((n *= 2) < 1) return - 0.5 * (a * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p));
    return a * Math.pow(2, -10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p) * 0.5 + 1;
};

const easingTypes = [mina.linear, mina.easeout, mina.easein, mina.easeinout, mina.backin, mina.backout, mina.elastic, mina.bounce, inOutElastic];

var easingStage1 = mina.backout, easingStage2 = mina.backout, easingStage3 = mina.bounce, easingStage4 = inOutElastic;

function init() {

    snapMode1 = Snap("#svgMode1");
    snapMode2 = Snap("#svgMode2");
    path = snapMode1.path(pathCenter);
}

function animationMode1() {

    if (running) {
        return;
    }

    $('#svgMode1').show();
    $('#svgMode2').hide();

    running = true;

    snapMode1.clear();
    path = snapMode1.path(pathCenter);

    var animateLeft = function () {
        path.animate({ 'd': pathLeftStretch }, durationLeft, easingStage1, animateRight);
    };
    var animateRight = function () {
        path.animate({ 'd': pathRightStretch }, durationRight, easingStage2, animateCenter);
    };
    var animateCenter = function () {
        path.animate({ 'd': pathCenter }, durationCenter, easingStage3, animationEnds);
    };

    var animationEnds = function () {
        running = false;
        progressAnimation = null;
    };

    progressAnimation = new Date();
    animateLeft();

    setInterval(function () {
        checkStatus();
    }, 80);
}

function animationMode2() {

    if (running) {
        return;
    }

    $('#svgMode1').hide();
    $('#svgMode2').show();

    running = true;

    snapMode2.clear();
    path = snapMode2.path(pathMode2Center);

    var pathMode2WithProgress = applyProgress();

    var animate = function () {
        path.animate({ 'd': pathMode2WithProgress }, 2400, easingStage4, animationEnds);
    };

    var animationEnds = function () {
        running = false;
        progressAnimation = null;
    };

    progressAnimation = new Date();
    animate();

    setInterval(function () {
        checkStatus();
    }, 80);
}

function applyProgress() {

    var pathMode2WithProgress = '';

    var range = document.getElementById('inputProgressoFlow').value;
    var ratio = range / 100;

    var arrayPathLeft = pathMode2Left.split(' ');
    var arrayPathRight = pathMode2Right.split(' ');
    var length = arrayPathLeft.length;
    var pathLeftRight = [];

    for (var i = 0; i < length; i++) {
        pathLeftRight.push({ left: arrayPathLeft[i], right: arrayPathRight[i] });
    }

    var arrayRatioApplied = pathLeftRight.map(function (item) {

        var difX = (getX(item.right) - getX(item.left)) * ratio;
        var difY = (getY(item.right) - getY(item.left)) * ratio;

        var x = getX(item.left) + difX;
        var y = getY(item.left) + difY;

        var value = item.left.length == 1 ? item.left : (x + ',' + y);
        return value;
    });

    function getX(item) {
        return Number(item.split(',')[0]);
    }

    function getY(item) {
        return Number(item.split(',')[1]);
    }

    arrayRatioApplied.forEach(function (item) {
        pathMode2WithProgress += (item + ' ');
    });

    return pathMode2WithProgress;
}

function checkStatus() {
    var anim = path.inAnim();
    if (anim != '') {
        var name = anim[0].anim.callback.name;
        var seconds = new Date().getTime() - progressAnimation.getTime();
        seconds = (seconds / 1000).toPrecision(2) + 's';
        $('#progressAnimation')[0].innerHTML = name + ': ' + seconds;
    }
}

function speed() {

    if (durationLeft == 800) {
        durationLeft = 1800;
        durationRight = 1800;
        durationCenter = 1900;
    } else {
        durationLeft = 800;
        durationRight = 800;
        durationCenter = 900;
    }

    duration = durationLeft + durationRight + durationCenter;
}

function initBotoes() {

    var bt = $("#bt1");
    bt.on('click', animationMode1);

    bt = $("#bt2");
    bt.on('click', speed);

    bt = $("#bt3");
    bt.on('click', animationMode2);
}

function easingTypeChange(event, stage) {

    switch (stage) {
        case 1:
            easingStage1 = easingTypes[event.currentTarget.value];
            break;
        case 2:
            easingStage2 = easingTypes[event.currentTarget.value];
            break;
        case 3:
            easingStage3 = easingTypes[event.currentTarget.value];
            break;
        case 4:
            easingStage4 = easingTypes[event.currentTarget.value];
            break;
        default:
            break;
    }
}

function inputProgressoFlowChange(event) {
    document.getElementById('labelProgressValue').innerHTML = event.currentTarget.value;
}