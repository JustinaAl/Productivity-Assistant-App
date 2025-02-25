import { getData, postData, changeData, deleteData } from "./services.js";  
const { isPast, isFuture, compareAsc, parseISO } = window.dateFns;

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
    await changeData(`http://localhost:5001/events/${id}`, newData)
  } else{
    const startData = {userId, ...newData}
    await postData("http://localhost:5001/events", startData)
  }
}

const deleteEvent = async(id) => {
  if (id){
    await deleteData(`http://localhost:5001/events/${id}`)
  }else {
    newNoteContainer.innerHTML = "";
    createEventBtn.classList.remove("hide");
  }
}

const createCard = async(event) => {
  
  const start = document.createElement("input");
  const end = document.createElement("input");
  start.type="text";
  end.type="text";
  start.name="dateStart";
  start.classList.add("date");
  end.name="dateEnd";
  end.classList.add("date");

  const startTitle = document.createElement("p");
  startTitle.innerText = "Start: ";
  const endTitle = document.createElement("p");
  endTitle.innerText = "End: ";

  const startContainer = document.createElement("div");
  startContainer.classList.add("startContainer");
  startContainer.append(startTitle, start);
  
  const endContainer = document.createElement("div");
  endContainer.classList.add("endContainer");
  endContainer.append(endTitle, end);

  const title = document.createElement("h2");
  title.innerText = `${event.title}`;
  title.setAttribute("contentEditable", "true");


  const dateContainer = document.createElement("div");
  dateContainer.classList.add("dateContainer");
  const errorMsg = document.createElement("p");
  errorMsg.classList.add("errorMsg")
  dateContainer.append(title, startContainer, endContainer, errorMsg)

  

  const startPicker = flatpickr(start, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    altInput: true, 
    altInputClass: "date",
    altFormat: "d M Y - H:i",
    time_24hr: true,
    allowInput: true,
    defaultDate: event.startDate,
    maxDate: event.endDate,
    onClose: function(selectedDates, dateStr, instance) {
      if (!dateStr.trim()) {
        instance.setDate(event.startDate); 
      }
      else if (dateStr !== event.startDate) {
        cardBodyContainer.classList.add("adjusting");
      }
    },
    onChange: function(selectedDates, dateStr, instance) {
      endPicker.set("minDate", dateStr);
    }
  });

  const endPicker = flatpickr(end, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    altInput: true, 
    altInputClass: "date",
    altFormat: "d M Y - H:i",
    time_24hr: true,
    defaultDate: event.endDate,
    minDate: event.startDate,
    onChange: function(selectedDates, dateStr, instance) {
      startPicker.set("maxDate", dateStr);
    },
    onClose: function(selectedDates, dateStr, instance) {
      if (!dateStr.trim()) {
        instance.setDate(event.endDate); 
      }
      else if (dateStr !== event.endDate) {
        cardBodyContainer.classList.add("adjusting");
      }
    }
  });


  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<svg class="deleteIcon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#99A0AE"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
  deleteBtn.classList.add("delete");
  
  const save = document.createElement("button");
  save.innerText ="Save";
  save.classList.add("saveBtn");
  
  const cancel = document.createElement("button");
  cancel.innerText ="Cancel";
  cancel.classList.add("cancelBtn");

  const saveCancel = document.createElement("div");
  saveCancel.classList.add("saveCancel");
  saveCancel.append(save, cancel);

  
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");
  buttonContainer.append(saveCancel, deleteBtn);

  cancel.addEventListener('click', () => {
    cardBodyContainer.classList.remove("adjusting");
    title.innerText = event.title;

    startPicker.setDate(event.startDate, true);
    endPicker.setDate(event.endDate, true);
  })


  save.addEventListener('click', async() => {
   
    const newData = {
      title: title.innerText.trim(),
      startDate: start.value,
      endDate: end.value
    };
    await saveEvent(newData, event.id);

  });

  deleteBtn.addEventListener("click", async() => {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteEvent(event.id);
      }
    });
    // const isConfirmed = window.confirm(`Are you sure that you want to delete the ${event.title}-post?`);

    // if (isConfirmed) { await deleteEvent(event.id) }
    
  });

  
  title.addEventListener("blur", () => {
    if (title.innerText.trim() === "") {
      title.innerText = event.title;
    } else if (title.innerText.trim() !== event.title){
      title.innerText = title.innerText
      .trim()
      .charAt(0)
      .toUpperCase() + title.innerText.trim().slice(1);
      
      saveEvent({title: title.innerText}, event.id);
    }
  });

  
  const cardBodyContainer = document.createElement("div");
  cardBodyContainer.classList.add("cardBodyContainer")
  cardBodyContainer.append(dateContainer, buttonContainer)
  
  const cardContainer = document.createElement("div");


  cardContainer.classList.add("cardContainer");
  cardContainer.append(cardBodyContainer)
  return cardContainer;
}
const createNewCard = async() => {
  
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

  const startPicker = flatpickr(start, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    altInput: true, 
    altFormat: "d M Y - H:i",
    time_24hr: true,
    minDate: "today",
    onChange: function(selectedDates, dateStr, instance) {
      endPicker.set("minDate", dateStr);
    }
  });

  const endPicker =  flatpickr(end, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    altInput: true, 
    altFormat: "d M Y - H:i",
    time_24hr: true,
    minDate: "today",
    onChange: function(selectedDates, dateStr, instance) {
      startPicker.set("maxDate", dateStr);
    }
  });

  const title = document.createElement("h2");
  title.innerText = "Enter title here...";
  title.setAttribute("contentEditable", "true");

  
  
  const save = document.createElement("button");
  save.innerText ="Save";
  save.classList.add("saveBtn");

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
    }else if(new Date(end.value) <= new Date()){
      errorMsg.innerText = "Please choose a time later than the current time."
    }else{

      const newData = {
        title: title.innerText.trim(),
        startDate: start.value,
        endDate: end.value
      };
      await saveEvent(newData);
  }});

  deleteBtn.addEventListener("click", async() => {
    await deleteEvent()
  });

  start.addEventListener("input", () => {
    title.style.color = "#FFFFFF"
    errorMsg.innerText = "";
  })
  end.addEventListener("input", () => {
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
    title.style.color = "#FFFFFF"
    errorMsg.innerText = "";
  })

  


  
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("cardContainer");
  cardContainer.append(title, dateContainer, buttonContainer)
  return cardContainer;
}

//print events
const printEvents = async() => {
  const allEvents = await getData("http://localhost:5001/events", { userId })
  let pastEvents = [];
  let upcomingEvents = [];
  let ongoingEvents = [];
  // flatPickr();

  allEvents.forEach(event => {
    if (isPast(parseISO(event.startDate)) && isFuture(parseISO(event.endDate))){
      ongoingEvents.push(event)
    }else if (isPast(parseISO(event.endDate))){
      pastEvents.push(event)
    } else if (isFuture(parseISO(event.startDate))){
      upcomingEvents.push(event)
    }
  
  });


  pastEvents = pastEvents.sort((a, b) => 
    compareAsc(parseISO(a.startDate), parseISO(b.startDate))
  );


  upcomingEvents = upcomingEvents.sort((a, b) => 
    compareAsc(parseISO(a.startDate), parseISO(b.startDate))
  );


  ongoingEvents = ongoingEvents.sort((a, b) => 
    compareAsc(parseISO(a.startDate), parseISO(b.startDate))
  );
  
  if (ongoingEvents.length > 0){
    const ongoingTitle = document.createElement("h2");
    ongoingTitle.classList.add("ongoingTitle");
    ongoingTitle.innerText = ("Ongoing events");
    const ongoingEventsContainer = document.createElement("div");
    ongoingEventsContainer.classList.add("ongoingEventsContainer", "events");
    ongoingEventsContainer.append(ongoingTitle);

    createEventBtn.insertAdjacentElement("afterend", ongoingEventsContainer);


    for (const event of ongoingEvents) {
      ongoingEventsContainer.append(await createCard(event))
    }
  };

  
  if (pastEvents.length > 0){
    for (const event of pastEvents) {
      pastEventsContainer.append(await createCard(event));
    }
  }

  if (upcomingEvents.length > 0){
    for (const event of upcomingEvents) {
      upcomingEventsContainer.append(await createCard(event));
    }
  } else {
    document.querySelector("#events-texs").innerText= "You got no upcoming events, enjoy your free time!";
  }
}
printEvents();



const createEvent = async() => {
  createEventBtn.classList.add("hide");
  const newCard = await createNewCard();
  newNoteContainer.append(newCard);
  //flatPickr();
}




createEventBtn.addEventListener("click", createEvent)
