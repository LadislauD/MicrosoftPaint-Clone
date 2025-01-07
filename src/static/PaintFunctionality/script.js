const p = document.createElement("p");
const color1 = document.getElementById("color1");
const serverPort = "http://127.0.0.1:5001";
const color2 = document.getElementById("color2");
let allColorsDiv = document.getElementById("coloracao");
let palet = ["black", "grey", "brown", "red", "orange", "yellow", "green", "blue", "purple", "violet", "white",
    "#C8C8C8", "#C4A484", "pink", "#FFC300", "#DCD9CD", "#33CC66", "#4dd2ff", "#007399", "#9999ff"
            ];
//configuracoes do canvas
let lastImage;
let stackCtrlZ = [];
const newDrawing = document.getElementById("novoDesenho");
const paint = document.querySelector("canvas");
const c2D = paint.getContext('2d', {willReadFrequently: true});
const canvasOffsetX = paint.offsetLeft;
const canvasOffsetY = paint.offsetTop;
c2D.canvas.width = window.innerWidth - canvasOffsetX;
c2D.canvas.height = window.innerHeight - canvasOffsetY;
//configuracoes iniciais do pincel
let isPainting = false;
let formate = "round";
let density = 5;
let x = 0;
let y = 0;
const eventsFunctions = {
    currentDownEvent: startPainting,
    currentUpEvent: stopPainting,
    currentMoveEvent: movePencil,

    newDownEvent: null,
    newUpEvent: null,
    newMoveEvent: null,

    setNewEvents(upFunction, downFunction, moveFunction) {
        this.newUpEvent = upFunction;
        this.newDownEvent = downFunction;
        this.newMoveEvent = moveFunction;
    },

    setCurrentEvents() {
        this.currentDownEvent = this.newDownEvent;
        this.currentUpEvent = this.newUpEvent;
        this.currentMoveEvent = this.newMoveEvent;
    }
};
//variables to download
const canvaSave = document.getElementById("canvaSave");
//tools
const tools = {
    borracha: document.getElementById("rubber"),
    lapis: document.getElementById("pencil"),
    balde: document.getElementById("balde"),
    magicGlass: document.getElementById("magicGlass"),
    brushes: document.getElementById("brushes"),
    rubberState: false,
    getRubberState() {
        return this.rubberState;
    }
}
//variavel para abrir e salvar imagem
const input = document.getElementById("addImg");
const salvar = document.getElementById("open");
//=============================================================
function getPosition(event) {
    x = event.clientX - paint.offsetLeft;
    y = event.clientY - paint.offsetTop;
}

function pushCanvasRedo() {
    stackCtrlZ.push(c2D.getImageData(0, 0, c2D.canvas.width, c2D.canvas.height)); //para fazer o undo e o redo
}

function popCanvasRedo() {
    if (stackCtrlZ.length === 0) {
        whiteBack();
        return;
    }
    c2D.putImageData(stackCtrlZ.pop(), 0, 0);
}

//funcoes de pintura
function startPainting(event) {
    isPainting = true;
    getPosition(event);
}

function movePencil(event) {
    if (!isPainting) return;
    c2D.beginPath();
    lineColor(color1.style.backgroundColor);
    lineForm(formate);
    stretchLine(event);
}

function stretchLine(event) {
    c2D.moveTo(x, y);   //valores capatados pela funcao startPainting
    coordinates.setInitialCoord(x, y);
    getPosition(event);//actualizar os pontos da linha
    coordinates.setFinalCoord(x, y);
    c2D.lineTo(x, y);//fazer a ligacao
    c2D.stroke();   //pintar
}

function stopPainting() {
    isPainting = false;
    pushCanvasRedo();
    updateLast();
}

//grossura, cor e forma da uma linha
function lineWidth(width) {
    c2D.lineWidth = width;
}

function lineColor(color) {
    if (tools.getRubberState()) return;
    c2D.strokeStyle = color;
}

function lineForm(form) {
    c2D.lineCap = form;
}
//responsavel por deletar eventos anteriores
function deletePreviewsEvents(eventsToDelete) {
    paint.removeEventListener("mousedown", eventsToDelete.currentDownEvent);
    paint.removeEventListener("mouseup", eventsToDelete.currentUpEvent);
    paint.removeEventListener("mousemove", eventsToDelete.currentMoveEvent);
}
//botao borracha
function rubber() {
    paintingConfig("square", "white", 20);
    tools.rubberState = true;
}
function paintingConfig(form, cor, width) {
    lineForm(form);
    lineColor(cor);
    lineWidth(width);
}
//botao lapis
function pencil() {
    paintingConfig("round", "black", 1);
    tools.rubberState = false;
}
//
function brushesPencil() {
    eventsFunctions.setNewEvents(stopPainting, startPainting, movePencil);
    subscribeEvents(eventsFunctions);
    paintingConfig("round", color1.style.backgroundColor, 5);
    tools.rubberState = false;
}
//usado para subscrever funçoes de eventos
function subscribeEvents(eventsFunctions) {
    deletePreviewsEvents(eventsFunctions);
    eventsFunctions.setNewEvents(eventsFunctions.newUpEvent, eventsFunctions.newDownEvent, eventsFunctions.newMoveEvent);
    eventsFunctions.setCurrentEvents();
    addEvent(eventsFunctions);
}
//
function addEvent(eventsFunctions) {
    paint.addEventListener('mousedown', eventsFunctions.currentDownEvent);
    paint.addEventListener('mouseup', eventsFunctions.currentUpEvent);
    paint.addEventListener('mousemove', eventsFunctions.currentMoveEvent);
}
//==================================Functionality==================================================
//apagar desenho
tools.borracha.addEventListener('click', rubber);
//lapis
tools.lapis.addEventListener('click', pencil);
//brushes
tools.brushes.addEventListener('click', brushesPencil);
//funcao para salvar o canvas desenhado(cuidado!)
canvaSave.addEventListener('click', function () {
    const pngDataUrl = paint.toDataURL("image/jpeg", 1.0);
    canvaSave.href = pngDataUrl;
    //saveInDb(pngDataUrl);
});
//abrir um desenho
input.addEventListener('change', () => {
    const reader = new FileReader(); //usei o filereader para conseguir a url da imagem;
    reader.addEventListener('load', function () {
        openDrawing(reader.result);
    });
    reader.readAsDataURL(input.files[0]);
});

function openDrawing(value){
    const img = new Image();
    img.onload = () => {
        c2D.drawImage(img, 10, 10);
        c2D.stroke();
    };
    img.src = value;
}
//salvar um desenho
salvar.addEventListener('click', function () {
    input.click();
});
//criar novo desenho
newDrawing.addEventListener('click', function () {
    whiteBack();
});

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'z') {
        popCanvasRedo();
    }
});

function whiteBack() {
    if(stackCtrlZ.length === 0){
        c2D.fillStyle = "white";
        c2D.fillRect(0, 0, c2D.canvas.width, c2D.canvas.height);
        updateLast();
        return;
    }
    paintLast();
}

function paintLast(){
    c2D.putImageData(lastImage, 0, 0);
}

function updateLast(){
    lastImage = c2D.getImageData(0, 0, c2D.canvas.width, c2D.canvas.height);
}

document.addEventListener('keydown', (event)=>{
    if(event.key === 'p'){
        console.log(stackCtrlZ);
        console.log("value:",lastImage);
    }
})

function initialize() {
    for (let i = 0; i < 30; i++) {
        let severalButton = document.createElement("button");
        if (i < palet.length) {
            severalButton.id = palet[i];
            severalButton.style.backgroundColor = palet[i];
            severalButton.addEventListener('click', () => {
                color1.style.backgroundColor = severalButton.style.backgroundColor;
                lineColor(color1.style.backgroundColor);
            });
        }
        allColorsDiv.append(severalButton);
        lineWidth(density);
        lineForm(formate);
    }
    addEvent(eventsFunctions);
    updateLast();
    whiteBack();
    window.onbeforeunload = clearLocal;
    var tempDraw = localStorage.getItem('imgData');
    if(tempDraw){
        openDrawing(tempDraw);
    }
}

function clearLocal(){
    localStorage.removeItem('imgData');
    localStorage.removeItem('idImg');
}

function print(value){
    console.log(value);
}

document.getElementById('share-drawing')
.addEventListener('click', ()=>{
    if(!localStorage.getItem('userLogged')){
        window.alert("Precisa fazer log-in");
        return;
    }
    let temp = localStorage.getItem('imgData');
    if(temp !== null) temp = localStorage.getItem('idImg');
    const request = new XMLHttpRequest();
    const dataRequest = {
        title: "Novo Desenho",
        drawURL: paint.toDataURL("image/jpeg", 1.0),
        date: `${new Date().getFullYear()}/${new Date().getDate()}/${new Date().getDay()}`,
        editValue: true,
        username: localStorage.getItem('userLogged'),
        id: temp
    }
    request.onload = function () {
        console.log("Drawing shared");
    }
    request.open("POST", `${serverPort}/saveDrawing`);
    request.setRequestHeader("Content-Type", 'application/json');
    request.send(JSON.stringify(dataRequest));
});

document.getElementById('home-hub')
.addEventListener('click',
function(){
    const request = new XMLHttpRequest();
    request.onload = function() {
        window.location.href = "./painthob.html";
    }
    request.open("GET", `${serverPort}/painthob`);
    request.send();
});

initialize();
