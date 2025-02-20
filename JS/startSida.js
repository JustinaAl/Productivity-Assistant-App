import { getData } from "./services.js";

//Checking if user is still logged in
let userId = sessionStorage.getItem("userId");



document.querySelector("#habitsBtnNav").addEventListener('click', () => {
    window.location.href = "habits.html";
});

document.querySelector("#eventsBtnNav").addEventListener('click', () => {
    window.location.href = "events.html";
});

document.querySelector("#todosBtnNav").addEventListener('click', () => {
    window.location.href = "toDos.html";
});

const user =  await getData(`http://localhost:5001/users/${userId}`);

let startSidaH1 = document.querySelector("#startSidaH1");
startSidaH1.innerText = `Hi, ${user.username}!`;


let data = await getData("https://dummyjson.com/quotes/random")


let printOutQuote = async()=>{
    let quotePlace = document.querySelector("#startSidaH2");
    quotePlace.textContent = await data.quote;
}
printOutQuote();

