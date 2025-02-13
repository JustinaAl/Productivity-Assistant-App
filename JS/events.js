import { getData, postData } from "./services.js";  

const upcomingEventsContainer = document.querySelector("#upcomingEventsContainer");
const pastEventsContainer = document.querySelector("#pastEventsContainer");
const createEventBtn = document.querySelector("#createNewEvent")
const newNoteContainer = document.querySelector("#newNoteContainer");
  
  //FlatPickr

document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#dateStarts", { 
    enableTime: true, 
    altInput: true,
    altFormat: "j M Y - H:i",
    minDate: "today",
    dateFormat: "Y-m-d H:i",
    time_24hr: true
  });

  flatpickr("#dateEnd", { 
    enableTime: true, 
    altInput: true,
    altFormat: "j M Y - H:i",
    minDate: "today",
    dateFormat: "Y-m-d H:i",
    time_24hr: true
  });
});

// sessionStorage.setItem("userId", "a138b0ea-faa5-4a75-at56-921c607ba3af")
const userId = sessionStorage.getItem("userId");

const createCard = (savefunction) => {
  doc
  savefunction && 
}

//print events
const allEvents = await getData("http://localhost:5001/events", { userId })

// const upcomingEvents = allEvents.endDate


const createEvent = async() => {
  createEventBtn.classList.add("hide");
  const newCard = createCard(save);
  newNoteContainer.append(newCard);
}


console.log(allEvents);

createEventBtn.addEventListener("click", createEvent)