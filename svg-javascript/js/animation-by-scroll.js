var animations;

function initAnimation() {

    var values = getValues();
    var customLagrange = setupLagrange(values.arrayX[0], values.arrayY[0], values.arrayX[1], values.arrayY[1], values.moreValues);

    animations = new AnimationsManager();
    animations.setSpeedChangeListener(this);

    var container = document.getElementsByClassName('mainDiv')[0];
    container.onmousemove = animations.animationListener;

    updateAnimationMetrics();

    setupCritterAnimation();
}

function updateAnimationMetrics() {
    var values = getValues();
    var customLagrange = setupLagrange(values.arrayX[0], values.arrayY[0], values.arrayX[1], values.arrayY[1], values.moreValues);
    animations.setLagrange(customLagrange);
}

function setupCritterAnimation() {

    this.idDiv = "div-svg";
    this.idSvg = 'svg1';

    var snapMenuCritter = Snap('#' + this.idDiv);

    fileLoader.loadFile("svg/pig.svg", function (loadedSvg) {

        snapMenuCritter.append(loadedSvg);
        document.getElementById(this.idDiv).firstElementChild.id = this.idSvg;

        var item1 = { name: 'leftEar', position: 0 };
        var item2 = { name: 'rightEar', position: 1 };
        var item3 = { name: 'leftEye', position: 2 };
        var item4 = { name: 'rightEye', position: 3 };

        var properties = [];
        properties.push({ svgName: item1.name, svgPosition: item1.position, rotate: animations.RotateLeftBySpeed, translate: animations.DEFAULT_TRANSLATE });
        properties.push({ svgName: item2.name, svgPosition: item2.position, rotate: animations.RotateRightBySpeed, translate: animations.DEFAULT_TRANSLATE });
        properties.push({ svgName: item3.name, svgPosition: item3.position, rotate: animations.DEFAULT_ROTATE, translate: animations.TranslateUpDownBySpeed });
        properties.push({ svgName: item4.name, svgPosition: item4.position, rotate: animations.DEFAULT_ROTATE, translate: animations.TranslateUpDownBySpeed });

        animations.add(this.idSvg, properties);
    });
}

function speedChange(speed) {
    document.getElementById('labelSpeed').innerHTML = speed;
}
