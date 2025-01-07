const select = document.getElementById('drawing');
const drawed = document.getElementById('optiondiv');
const createNewDrawing = document.querySelector('.create-new-drawing');
const serverPort = "http://127.0.0.1:5001";

function createDivCanvas(username, img, datacreated, id) {
    let div = document.createElement('div');
    div.innerHTML = `
    <img src="${img}" width="400" height="400" id ="canvadrawed">
    <span class="infouser">
        <p><strong>${username}</strong></p>
        <p><strong>${datacreated}</strong></p>
    </span>
    `;
    div.setAttribute('id', id);
    div.addEventListener('click', () => {
        const request = new XMLHttpRequest();
        request.onload = function() {
            localStorage.setItem("imgData", div.querySelector('img').getAttribute('src'));
            localStorage.setItem('idImg', div.getAttribute('id'));
            window.location.href = "./PaintClone.html";
        }
        request.open("GET", `${serverPort}/initmsclone`);
        request.send();
    })
    drawed.appendChild(div);
    drawed.append(div);
}

if(localStorage.getItem('userLogged')){
    document.getElementById('sigin-btn').style.display = "none";
    document.getElementById('login-btn').style.display = "none";
    document.getElementById('display-username').innerHTML = `<strong>${localStorage.getItem('userLogged')}<strong>`
}

document.getElementById('logout-btn').addEventListener('click',()=>{
    localStorage.removeItem('userLogged');
    document.getElementById('sigin-btn').style.display = "inline";
    document.getElementById('logout-btn').style.display = "none";
    document.getElementById('login-btn').style.display = "inline";
    document.getElementById('display-username').innerHTML = ``
});

document.getElementById('login-btn').addEventListener('click',()=>{
    window.location.href = "./index.html"
});

document.addEventListener('DOMContentLoaded', () => {
    const request = new XMLHttpRequest();
    request.onload = function() {
        let data = JSON.parse(request.response);
        if(data.length === 0)
            console.log("SEM DADOS NA BD");
        data.forEach(element => {
            createDivCanvas(element[0], element[1], element[2], element[3]);
            localStorage.removeItem('imgData');
            localStorage.removeItem('idImg');
        });
    }
    request.open("GET", `${serverPort}/drawshared`);
    request.send(JSON.stringify("ladislau"));
});

createNewDrawing.addEventListener('click', () => {
    const request = new XMLHttpRequest();
    request.onload = function() {
        window.location.href = "./PaintClone.html";
    }
    request.open("GET", `${serverPort}/initmsclone`);
    request.send();
});

/*function drawShared(endpoint, username = "") {
    const request = new XMLHttpRequest();
    request.onload = function() {
        let data = JSON.parse(request.response);
        if(data.length === 0)
            console.log("SEM DADOS NA BD");
        data.forEach(element => {
            createDivCanvas(element[0], element[1], element[2]);
        });
    }
    request.open("GET", `${serverPort}/${endpoint}${username}`);
    //request.setRequestHeader("Content-Type", 'application/json');
    request.send(JSON.stringify(username));
}*/