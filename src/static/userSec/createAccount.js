const botao = document.getElementById('btnCreateAccount');
botao.addEventListener('click', () => {
    let data;
    const jsonRequest = {
        new_username:  document.getElementById("newusername").value,
        new_password: document.getElementById("newpassword").value
    };
    const request = new XMLHttpRequest();
    request.onload = function() {
    dataResponse = JSON.parse(request.response);
    if (!dataResponse.validation){
            document.getElementById('alertMessage').innerHTML = dataResponse.response;
    }
    else{
        console.log(dataResponse);
        localStorage.setItem('userLogged',jsonRequest['new_username']);
        window.location.href = "./painthob.html";
    }
    }
    request.open("POST", `http://127.0.0.1:5001/newaccountregister`, true);
    request.setRequestHeader("Content-Type", 'application/json');
    request.send(JSON.stringify(jsonRequest));
});
