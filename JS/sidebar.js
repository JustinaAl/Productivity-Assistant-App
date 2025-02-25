const checkLoginStatus = () =>{ 
    let userId= sessionStorage.getItem("userId")
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

//Get habits
let getHabits = async()=>{
    let userId= sessionStorage.getItem("userId")
    let data = await axios.get("http://localhost:5001/habits", { params: { userId }});
    data.data.forEach((habit) => {
        habit.reps = Number(habit.reps);
      });

    let sort = data.data.sort((a, b) => b.reps - a.reps);
    let lastThree = sort.slice(0,3);  
    
    return lastThree;
}
//Post habits
let printOut = async()=>{
    let lastThree = await getHabits();
    let ul = document.querySelector("#navUlHabits");
    let index = 0;
    
    lastThree.forEach((element) => {
        let li = document.createElement("li");
        li.textContent = element.title;
        index+=1;
        ul.append(li);
    });
}
printOut();

let todaysDate =()=> {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    
    return `${year}${month}${day}`;
};


let getEvents = async()=>{
    let userId= sessionStorage.getItem("userId")
    let today = todaysDate();

    let data = await axios.get("http://localhost:5001/events", { params: { userId }});

    data.data.forEach(element => {
    let toNumber = element.startDate.replace(/[-\s:]/g, '').slice(0, -4);
    element.startDate = Number(toNumber);    
    });

    let upcomingEvents = data.data.filter(element => element.startDate >= Number(today));
    let sort = upcomingEvents.sort((a, b) => a.startDate - b.startDate);
    let lastThree = sort.slice(0,3);

    
    return lastThree;
}

let printOutEvents = async() => {
    let lastThree = await getEvents();
    let ul = document.querySelector("#navUlEvents");
    let index = 0;
    
    lastThree.forEach((element) => {
        let li = document.createElement("li");
        li.textContent = element.title;
        index+=1;
        ul.append(li);
    });
}
printOutEvents();

//ToDos
let getToDos = async() => {
    let userId= sessionStorage.getItem("userId")
    let data = await axios.get("http://localhost:5001/todos", { params: { userId }});

    let lastThree = data.data.reverse().slice(0,3);
    return lastThree;
}
//Print ToDos
let printOutToDos = async() => {
    let lastThree = await getToDos();
    let ul = document.querySelector("#navUlTodos");
    let index = 0;
    
    lastThree.forEach((element) => {
        let li = document.createElement("li");
        li.textContent = element.title;
        index+=1;
        ul.append(li);
    });
}

printOutToDos();