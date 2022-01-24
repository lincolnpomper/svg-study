function AnimationsManager() {

    const debug = true;
    const DURATION_ANIMATION = 300;
    const DURATION_WAIT = 200;
    const DEFAULT_TRANSLATE = 't0 0';
    const DEFAULT_ROTATE = 'r0';
    var running = false;
    var waitForStart = false;
    var speedChangeListener = null;
    var currentScrollYPosition = 0;
    var latestKnownScrollY = 0;
    var animations = [];

    var lagrange = null;

    function setupLagrangeForMenuScroll() {
        var lagrange = new Lagrange(1, 1, 53, 4);
        lagrange.addPoint(104, 6);
        lagrange.addPoint(500, 8);
        return lagrange;
    }

    function init() {
        lagrange = setupLagrangeForMenuScroll();
    }

    return {
        init: init,
        setLagrange: setLagrange,
        setTouchListener: setTouchListener,
        setSpeedChangeListener: setSpeedChangeListener,
        animationListener: animationListener,
        add: add,
        DEFAULT_TRANSLATE,
        DEFAULT_ROTATE,
        TranslateUpDownBySpeed: new TranslateUpDownBySpeed(),
        RotateRightBySpeed: new RotateRightBySpeed(),
        RotateLeftBySpeed: new RotateLeftBySpeed()
    }

    function setLagrange(customLagrange) {
        lagrange = customLagrange;
    }

    function setTouchListener(touchListener) {

        if (/Android|iPhone/i.test(navigator.userAgent)) {
            touchListener.addEventListener("touchmove", animationListener, false); // mobile
        } else {
            window.onscroll = animationListener; // browser
            // touchListener.onscroll = animationListener; // browser
        }
    }

    function add(id, properties) {
        animations.push({ id: id, properties: properties });
    }

    function RotateRightBySpeed() {
        this.get = function (speed) { return 'r' + speed };
    }

    function RotateLeftBySpeed() {
        this.get = function (speed) { return 'r' + (speed * -1) };
    }

    function TranslateUpDownBySpeed() {
        this.get = function (speed) { return 't0 ' + (speed > 0 ? speed > 6 ? '3' : '1' : speed < -6 ? '-3' : '-1') };
    }

    function animationListener(event) {

        currentScrollYPosition = event.clientY ? event.clientY : event.pageY ? event.pageY : window.scrollY;

        if (waitForStart) {
            return;
        }

        if (waitForStart == false) {
            waitForStart = true;
            setTimeout(function () {
                waitForStart = false;
            }, 300);
        }

        if (running || (running == false && lagrange == null)) {
            return;
        }

        var delta = latestKnownScrollY - currentScrollYPosition;

        if (delta > 1 || delta < -1) {

            if (debug) console.log('variação do scroll: ' + delta);

            var absDelta = Math.abs(delta);
            var speed = speedByLagrange(absDelta);

            if (delta < 0) {
                speed = speed * -1;
            }

            running = true;

            animations.forEach(data => {
                animate(data.id, data.properties, speed);
            });
        }

        latestKnownScrollY = currentScrollYPosition;
    }

    function animate(id, properties, speed) {

        var snap = Snap('#' + id);

        properties.forEach(item => {

            var child = snap.selectAll('circle, path')[item.svgPosition];
            var x = child.getBBox().cx;
            var y = child.getBBox().cy;

            var animateIn = function () {

                var rotateValue = typeof item.rotate === 'string' ? item.rotate : item.rotate.get(speed);
                var translateValue = typeof item.translate === 'string' ? item.translate : item.translate.get(speed);
                var snapProperties = { transform: rotateValue + ' ' + x + ' ' + y + ' ' + translateValue };

                if (debug) {
                    console.log('animação em ' + id + ' -> ' + item.svgName + ' -> ' + JSON.stringify(snapProperties));
                }
                child.animate(snapProperties, DURATION_ANIMATION, mina.backout, animateOut);
            };

            var animateOut = function () {
                child.animate({ transform: 'r0 0 0 t0 0' }, DURATION_ANIMATION, mina.backout, animationEnds);
            };

            var animationEnds = function () {
                setTimeout(function () {
                    running = false;
                }, 50);
            };

            animateIn();
        });
    }


    function setSpeedChangeListener(listener) {
        speedChangeListener = listener;
    }

    function speedByLagrange(value) {
        var output = lagrange.valueOf(value);
        if (debug) {
            console.log('scroll speed: ' + output);
            if (speedChangeListener) {
                speedChangeListener.speedChange(output);
            }
        }
        return output;
    }
}