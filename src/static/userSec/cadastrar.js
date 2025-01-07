const loginbtn = document.getElementById("btnLogin");
const createAccount = document.getElementById("createAccount");
const serverPort = "http://127.0.0.1:5001";
loginbtn.addEventListener('click', function() {
  const request = new XMLHttpRequest();
  let dataResponse;
  const jsonRequest = {
      username:  document.getElementById("username").value,
      password: document.getElementById("password").value
  };
  request.onload = function() {
    dataResponse = JSON.parse(request.response);
    console.log(dataResponse);
    if (!dataResponse.validation){
      document.getElementById('alertMessage').innerHTML = dataResponse.response;
    }
    else{
      console.log(dataResponse);
      localStorage.setItem('userLogged',jsonRequest['username']);
      toPainthob();
    }
  }
  request.open("POST",`${serverPort}/login`);
  request.setRequestHeader("Content-Type", 'application/json');
  request.send(JSON.stringify(jsonRequest));
});

function toPainthob(){
    window.location.href = "./painthob.html";
}

function registNewUser(){
  const request = new XMLHttpRequest();
  const jsonData = {
    new_username: document.getElementById('newusername').value,
    new_password: document.getElementById('newpassword').value
  }
  request.onload = () =>{
    data = JSON.parse(request.response);
    if(data.validation){
      toPainthob();
    }
    else{
      document.getElementById('alertMessage').innerHTML = data.responseJson;
    }
  }
  request.open("POST",`${serverPort}/newaccountregister`);
  request.setRequestHeader("Content-Type", 'application/json');
  request.send(JSON.stringify(jsonData));
}

createAccount.addEventListener('click', function(){
  const request = new XMLHttpRequest();
  request.onload = function() {
    window.location.href = "./createAccount.html";
    document.getElementById('btnCreateAccount').addEventListener('click', registNewUser);
  }
  request.open("GET", `${serverPort}/register`);
  request.send();
});

function loadJS(urlFile, async = true) {
    let scriptEle = document.createElement("script");
  
    scriptEle.setAttribute("src", urlFile);
    scriptEle.setAttribute("async", async);
  
    document.body.appendChild(scriptEle);

    scriptEle.addEventListener('load', () => {
      console.log("File loaded");
    });

    scriptEle.addEventListener("error", (ev) => {
      console.log("Error on loading file", ev);
    });
}