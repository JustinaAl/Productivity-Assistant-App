//Random quote code up to line 11
let getData = async()=>{
    let data = await axios("https://dummyjson.com/quotes/random");
    let quote = data.data.quote;
    return quote;
}
let printOutQuote = async()=>{
    let quotePlace = document.querySelector("#startSidaH2");
    quotePlace.textContent = await getData();
}
printOutQuote();
//
