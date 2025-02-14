import { getData, postData, changeData } from "./services.js";  

const upcomingEventsContainer = document.querySelector("#upcomingEventsContainer");
const pastEventsContainer = document.querySelector("#pastEventsContainer");
const createEventBtn = document.querySelector("#createNewEvent")
const newNoteContainer = document.querySelector("#newNoteContainer");
  
  //FlatPickr

document.addEventListener("DOMContentLoaded", function () {
    flatpickr(".date", { 
    enableTime: true, 
    altInput: true,
    altFormat: "j M Y - H:i",
    minDate: "today",
    dateFormat: "Y-m-d H:i",
    time_24hr: true
  });

  // flatpickr("#dateEnd", { 
  //   enableTime: true, 
  //   altInput: true,
  //   altFormat: "j M Y - H:i",
  //   minDate: "today",
  //   dateFormat: "Y-m-d H:i",
  //   time_24hr: true
  // });
});

// sessionStorage.setItem("userId", "a138b0ea-faa5-4a75-at56-921c607ba3af")
const userId = sessionStorage.getItem("userId");

const saveEvent = async(newData, id) => {
  if (id){
    await changeData(`http://localhost:5001/events?id=${id}`, newData)
  } else{
    startData = {userId, ...newData}
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
  dateContainer.append(start, end)
 
  const title = document.createElement("h2");
  title.innerText = "Enter title here...";
  title.setAttribute("contentEditable", "true");
  
  
  const save = document.createElement("button");
  save.innerText ="Save";

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "<img src='../assets/img/delete_24dp_FB3748_FILL0_wght400_GRAD0_opsz24.svg'>";

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");
  buttonContainer.append(save, deleteBtn);

  save.addEventListener('click', () => {
    const newData = {
      title: title.innerText,
      startDate: start.value,
      endDate: end.value
    };
    saveEvent(newData, id ? id : "");
    save.classList.add("hide")
  });

  deleteBtn.addEventListener("click", deleteEvent);

  start.addEventListener("input", () => {
    save.classList.remove("hide");
  })
  end.addEventListener("input", () => {
    save.classList.remove("hide");
  })
  title.addEventListener("input", () => {
    save.classList.remove("hide");
  })

  

  // savefunction && 
  
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("cardContainer");
  cardContainer.append(title, dateContainer, buttonContainer)
  return cardContainer;
}

//print events
const allEvents = await getData("http://localhost:5001/events", { userId })

// const upcomingEvents = allEvents.endDate


const createEvent = async() => {
  createEventBtn.classList.add("hide");
  const newCard = await createCard("save");
  newNoteContainer.append(newCard);
}


console.log(allEvents);

createEventBtn.addEventListener("click", createEvent)