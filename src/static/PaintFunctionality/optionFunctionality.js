const optionFile = document.getElementById( "opcaoFiles" );
const subMenuFile = document.getElementById( "subMenuFiles" );
const topestBar = document.querySelector('.optionMenu');
const menu = document.getElementById('menuId');
optionFile.addEventListener( 'click', closeOrOpen);

menu.addEventListener('click', ()=>{
    subMenuFile.style.display = "none"
});

function closeOrOpen(){
    if(subMenuFile.style.display !== "inline")
        subMenuFile.style.display = "inline"
    else
        subMenuFile.style.display = "none"
}

paint.addEventListener( 'click', function() {
    subMenuFile.style.display = "none";
});