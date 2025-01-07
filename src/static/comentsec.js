const comentBox = document.querySelector('.comments');
const inputComent = document.querySelector('.usercoment');
const button = document.getElementById('postar');
const commentButton = document.querySelector('.comment-button');
const comentary = document.getElementById('coment');
comentary.style.display = "none";
let comentOn = true;

function comentSection(){
    if(comentary.style.display === 'none') 
        document.getElementById('coment').style.display = "flex";
    else
        document.getElementById('coment').style.display = "none";
}

async function showComment(){
    const request = new XMLHttpRequest();
    request.onload = function() {
        let dataResponse = JSON.parse(request.response);
        console.log(dataResponse)
        if(dataResponse.length == 0 || dataResponse.validation === false) return;
        dataResponse.forEach(element => {
            console.log(element);
            let div = document.createElement('div');
            div.innerHTML = `<div>${element[1]}</div>`;
            comentBox.appendChild(div);
            console.log(dataResponse);
        });
    }
    request.open("GET", `${serverPort}/getComentDraw/${localStorage.getItem('idImg')}`);
    //request.setRequestHeader("Content-Type", 'application/json');
    request.send();
    inputComent.value = "";
}

function comentar(){
    if(!localStorage.getItem('userLogged')) return;
    let value = inputComent.value;
    if(!value) return;

    let div = document.createElement('div');
    div.innerHTML = `<div>${value}</div>`;
    comentBox.appendChild(div);
    //console.log(dataResponse);

    const request = new XMLHttpRequest();
    const dataRequest = {
        username: localStorage.getItem('userLogged'),
        comment: value,
        idComment: localStorage.getItem('idImg')
    }
    request.onload = function() {
        console.log(request.response);
        //showComment();
    }
    request.open("POST", "http://127.0.0.1:5001/postComentDraw");
    request.setRequestHeader("Content-Type", 'application/json');
    request.send(JSON.stringify(dataRequest));
    inputComent.value = "";
}
showComment();
commentButton.addEventListener('click', comentSection);
button.addEventListener('click', comentar);
inputComent.addEventListener('keyup', (event) =>{
    if(!localStorage.getItem('userLogged')){
        
        return;
    }
    if(event.key == "Enter")
        comentar();
});
