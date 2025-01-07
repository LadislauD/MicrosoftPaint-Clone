let stackStore = [];

let shapeId = "";

let functionShape;

const coordinates = {
    x0: 0, 
    y0: 0,
    xf: 0,
    yf: 0,

    setInitialCoord( x, y ) {
        this.x0 = x;
        this.y0 = y;
    },

    setFinalCoord( x, y ) {
        this.xf = x;
        this.yf = y;
    },

    setAllCoord( xi, yi, xf, yf ) {
        this.x0 = xi;
        this.y0 = yi;
        this.xf = xf;
        this.yf = yf;
    }
}

const shapes = {
    lineShape: document.getElementById( "lineShape" ),
    rectShape: document.getElementById( "rectShape" ),
    ovalShape: document.getElementById( "ovalShape" ),
    curveLine: document.getElementById( "curveLine" ),
    roundedRectShape: document.getElementById ( "roundedRect"),
    unifiedLine: document.getElementById ("unifiedLine"),
}

var previewsGeometry = {
    x0Temp: 0,
    y0Temp: 0,
    colorTemp: "",

    setInitialCoord( x, y ) {
        this.y0Temp = y;
        this.x0Temp = x;
    },

    setColorTemp( colorTemp ) {
        this.colorTemp = colorTemp;
    }
};

function setShapeId( id ) {
    shapeId = id;
}

function typeOfShape(idOfShape){
    if(idOfShape === "lineShape")
        return drawLines;
    if(idOfShape === "rectShape")
        return drawRect;
    if(idOfShape === "ovalShape")
        return drawOval;
    if(idOfShape === "curveLine")
        return drawLineCurve;
    if(idOfShape === "roundedRect")
        return drawRoundCurve;
    if(idOfShape === "unifiedLine")
        return drawUnifiedLines;
}

function addNewShapeEvents() {
    functionShape = typeOfShape(this.id);
    eventsFunctions.setNewEvents( finishShape, startStretching, stretchShape );
    subscribeEvents( eventsFunctions );
}

function unifiedLineEvents(){
    eventsFunctions.setNewEvents( stopPainting000, startPainting000, unifyMoveLine );
    subscribeEvents( eventsFunctions );
}

function unifyMoveLine( event ) {
    if( !isPainting ) return;
    lineColor( color1.style.backgroundColor );
    lineForm( formate );
    c2D.beginPath();
    c2D.moveTo( coordinates.x0, coordinates.y0 );
    getPosition( event );
    c2D.lineTo( x, y );
    c2D.stroke();
    whiteBack();
}

function startPainting000( event ) {
    isPainting = true;
    getPosition( event );
    coordinates.setInitialCoord( x, y );
}

function stopPainting000() {
    isPainting = false;
    c2D.lineTo( x, y );
    c2D.stroke();
}

function startStretching( event ) {
    startPainting( event );
    previewsGeometry.setInitialCoord( x, y );
}

function shapesData( event ) {
    repaintShapes();
    getPosition( event );
    coordinates.setAllCoord( previewsGeometry.x0Temp, previewsGeometry.y0Temp, x, y );
}

/*function saveShape( coord, idShape, cor = previewsGeometry.colorTemp ) {
    stackStore.push({
        x0Temp: coord.x0,
        y0Temp: coord.y0,
        xfTemp: coord.xf,
        yfTemp: coord.yf,
        cor:  cor,
        idShape: idShape
    });
}*/

function finishShape() {
    stopPainting();
    previewsGeometry.setColorTemp( c2D.strokeStyle );
    coordinates.setAllCoord( previewsGeometry.x0Temp, previewsGeometry.y0Temp, x, y );
}

function repaintShapes() {
    whiteBack();
}

function stretchShape ( event ) {
    if( isPainting ) {
        shapesData( event );
        functionShape( coordinates, color1.style.backgroundColor );
    }
}

function lineCoordinate( coordinates ) {
    c2D.moveTo( coordinates.x0, coordinates.y0 );
    c2D.lineTo( coordinates.xf, coordinates.yf );
    c2D.stroke();
}

function drawLines( coordinates, cor ) {
    c2D.beginPath();
    lineColor( cor );
    lineCoordinate( coordinates );
}

function drawRect( coordinates, cor ) {
    lineColor( cor );
    c2D.strokeRect( coordinates.x0, coordinates.y0, coordinates.xf-coordinates.x0, coordinates.yf-coordinates.y0 );
}

function drawOval( coordinates, cor) {
    var radiusX = coordinates.xf-coordinates.x0;
    var radiusY = coordinates.yf-coordinates.y0;
    if( radiusX < 0 ) radiusX = -radiusX;
    if( radiusY < 0 ) radiusY = -radiusY;
    c2D.beginPath();
    lineColor( cor );
    c2D.ellipse( coordinates.x0, coordinates.y0, radiusX, radiusY, 0, 0, 2*Math.PI );
    c2D.stroke();
}

function drawLineCurve( coordinates, cor ) {
    var cp1y, cp1x, cp2x, cp2y;

    cp1x = ( coordinates.x0 + coordinates.xf ) / 2;
    cp1y = coordinates.y0;

    cp2x = ( coordinates.x0 + coordinates.xf ) / 2;
    cp2y = coordinates.yf

    lineColor( cor );

    c2D.beginPath();
    c2D.moveTo( coordinates.x0, coordinates.y0 );
    c2D.bezierCurveTo( cp1x, cp1y, cp2x, cp2y, coordinates.xf, coordinates.yf );
    c2D.stroke();
}

function drawRoundCurve( coordinates, cor ) {
    lineColor( cor );
    c2D.beginPath();
    c2D.roundRect( coordinates.x0, coordinates.y0, coordinates.xf-coordinates.x0, coordinates.yf-coordinates.y0, [10] );
    c2D.stroke();
}

function drawUnifiedLines( coordinates, cor ) {    
    if( !isPainting ) return;
    lineColor( cor );
    lineForm( formate );
    c2D.beginPath();
    c2D.moveTo( coordinates.x0, coordinates.y0 );
    getPosition( event );
    c2D.lineTo( x, y );
    c2D.stroke();
    whiteBack();
}

shapes.lineShape.addEventListener( 'click', addNewShapeEvents );
shapes.rectShape.addEventListener( 'click', addNewShapeEvents );
shapes.ovalShape.addEventListener( 'click', addNewShapeEvents );
shapes.curveLine.addEventListener( 'click', addNewShapeEvents );
shapes.roundedRectShape.addEventListener( 'click', addNewShapeEvents );
shapes.unifiedLine.addEventListener('click', unifiedLineEvents);