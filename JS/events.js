import { getData, postData } from "./logIn";  

const upcomingEventsContainer = document.querySelector("#upcomingEventsContainer");
const pastEventsContainer = document.querySelector("#pastEventsContainer");
  
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



