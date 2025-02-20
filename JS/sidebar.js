

const checkLoginStatus = () =>{ 
    userId = sessionStorage.getItem("userId");

    if( !userId ){
        window.location.replace("index.html");
        return
    }};

checkLoginStatus();
setInterval(checkLoginStatus, 2000);


const logOutBtn = document.querySelector("#logOutBtn");


logOutBtn.addEventListener('click', () => {
    sessionStorage.removeItem("userId");
    window.location.replace("index.html");
})