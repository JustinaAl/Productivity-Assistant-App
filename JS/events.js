import { getData, postData, changeData } from "./services.js";  

const upcomingEventsContainer = document.querySelector("#upcomingEventsContainer");
const pastEventsContainer = document.querySelector("#pastEventsContainer");
const createEventBtn = document.querySelector("#createNewEvent")
const newNoteContainer = document.querySelector("#newNoteContainer");
  
  //FlatPickr
const flatPickr = () => {
  flatpickr(".date", { 
    enableTime: true, 
    altInput: true,
    altFormat: "j M Y - H:i",
    minDate: "today",
    dateFormat: "Y-m-d H:i",
    time_24hr: true
  });
}



// sessionStorage.setItem("userId", "a138b0ea-faa5-4a75-at56-921c607ba3af")
const userId = sessionStorage.getItem("userId");

const saveEvent = async(newData, id) => {
  if (id){
    await changeData(`http://localhost:5001/events?id=${id}`, newData)
  } else{
    const startData = {userId, ...newData}
    console.log(startData);
    await postData("http://localhost:5001/events", startData)
  }
}

const deleteEvent = () => {

}

const createCard = async(id) => {
  
  const start = document.createElement("input");
  const end = document.createElement("input");
  start.type="date";
  end.type="date";
  start.name="dateStart";
  start.classList.add("date");
  end.name="dateEnd";
  end.classList.add("date");
  start.placeholder="Start date";
  end.placeholder="End date";
  const dateContainer = document.createElement("div");
  dateContainer.classList.add("dateContainer");
  const errorMsg = document.createElement("p");
  errorMsg.classList.add("errorMsg")

  dateContainer.append(start, end, errorMsg)

  const title = document.createElement("h2");
  title.innerText = "Enter title here...";
  title.setAttribute("contentEditable", "true");

  
  
  const save = document.createElement("button");
  save.innerText ="Save";
  save.classList.add("save");

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<svg class="deleteIcon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#99A0AE"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
  deleteBtn.classList.add("delete");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");
  buttonContainer.append(save, deleteBtn);

  save.addEventListener('click', async() => {
    const trimmedTitle = title.innerText.trim();

    if (trimmedTitle === "Enter title here..." || trimmedTitle === ""){
      errorMsg.innerText = "Please enter a title",
      title.style.color = "#FB3748"
    } else if(start.value ===""){
      errorMsg.innerText = "Please enter a start date"
    }else if(end.value ===""){
      errorMsg.innerText = "Please enter a end date"
    }else if(end.value <= start.value){
      errorMsg.innerText = "End time has to be later than start time"
    }else{

      const newData = {
        title: title.innerText.trim(),
        startDate: start.value,
        endDate: end.value
      };
      await (id ? saveEvent(newData, id) : saveEvent(newData));
      // save.classList.add("hide")
      // deleteBtn.classList.add("hide")
  }});

  deleteBtn.addEventListener("click", deleteEvent);

  start.addEventListener("input", () => {
    // save.classList.remove("hide");
    // deleteBtn.classList.remove("hide");
    title.style.color = "#FFFFFF"
    errorMsg.innerText = "";
  })
  end.addEventListener("input", () => {
    // save.classList.remove("hide");
    // deleteBtn.classList.remove("hide");
    title.style.color = "#FFFFFF"
    errorMsg.innerText = "";
  })
  title.addEventListener("focus", () => {
    if (title.innerText === "Enter title here...") {
      title.innerText = "";
    }
    title.style.color = "#FFFFFF"
    errorMsg.innerText = "";
  });
  
  title.addEventListener("blur", () => {
    if (title.innerText.trim() === "") {
      title.innerText = "Enter title here...";
    } else {
      title.innerText = title.innerText
      .trim()
      .charAt(0)
      .toUpperCase() + title.innerText.trim().slice(1);
    }
  });
  title.addEventListener("input", () => {
    // save.classList.remove("hide");
    // deleteBtn.classList.remove("hide");
    title.style.color = "#FFFFFF"
    errorMsg.innerText = "";
  })

  

  // savefunction && 
  
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("cardContainer");
  cardContainer.append(title, dateContainer, buttonContainer)
  return cardContainer;
}

//print events
const allEvents = await getData("http://localhost:5001/events", { userId })
console.log(allEvents);

// const upcomingEvents = allEvents.endDate


const createEvent = async() => {
  createEventBtn.classList.add("hide");
  const newCard = await createCard();
  newNoteContainer.append(newCard);
  flatPickr();
}




createEventBtn.addEventListener("click", createEvent)