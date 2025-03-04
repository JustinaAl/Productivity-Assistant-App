let userId = sessionStorage.getItem("userId");

let getHabitData = async() =>{
  let data = await axios.get("http://localhost:5001/habits", { params: { userId } });
  return data.data;
};

let createHabit = () => {
  if (document.body.querySelector("#mainDiv")) {
    return;
  } else {
    let mainDiv = document.createElement("div");
    mainDiv.id = "mainDiv";
    mainDiv.innerHTML = `
            <input type="text" id="habitTitle" placeholder="Enter habit title here...">
            <div>
                <select name="prioritySelection" id="prioritySelection">
                    <option value=" " disabled selected>Choose priority</option>
                    <option>low</option>
                    <option>medium</option>
                    <option>high</option>
                </select>
                <button id="saveHabit">Save</button>
            </div>`;

    document.querySelector("#createNew").after(mainDiv);
    document.querySelector("#saveHabit").addEventListener("click", pushHabitdb);
  }
};

document.querySelector("#createNew").addEventListener("click", createHabit);

let pushHabitdb = async () => {
  let value = 0;
  let title = document.querySelector("#habitTitle").value;
  let chosenPriority = document.querySelector("#prioritySelection").value;
  console.log(title);
  if(title.length>2){
    if(chosenPriority === " "){
      alert("You need to choose a priority");
    }else{
      await axios.post("http://localhost:5001/habits", {
        userId,
        title,
        reps: value,
        priority: chosenPriority,
      });
    }
  }else{
    alert("The title is too short");
  }
};

//Create a habit box for posting to the page
let createHabitBox = (habit) => {
  if (habit.priority == "0") {
    habit.priority = "low";
  } else if (habit.priority == "1") {
    habit.priority = "medium";
  } else if (habit.priority == "2") {
    habit.priority = "high";
  }
  let habitBox = document.createElement("div");
  habitBox.classList.add("habitBox");
  habitBox.innerHTML = `
        <div class="informationBox">
            <p>${habit.title}</p>
            <p>Priority: ${habit.priority}</p>
        </div>
        <div class="more">
            <div class = "counterWrap">
                <div class="rep">
                  <p>Repetitions</p>
                  <button class="refresh"><i class="fa-solid fa-rotate-right" style="color: #ffffff;"></i></button>
                </div>
                <div class="counter">
                    <button class="minus"><i class="fa-solid fa-minus" style="color: #ffffff;"></i></button>
                    <p class="value">${habit.reps}</p>
                    <button class="plus"><i class="fa-solid fa-plus" style="color: #ffffff;"></i></button>
                </div>
            </div>
            <div class="iconBox"><i class="fa-solid fa-ellipsis-vertical"></i></div>
        </div>`;
  return habitBox;

};

//Counts repetitions
let countRepetitions = async (habitBox, value, habitId) => {
  let plus = habitBox.querySelector(".plus");
  let minus = habitBox.querySelector(".minus");
  let refreshBtn = habitBox.querySelector(".refresh");

  let increaseValue = async () => {
    let data = await axios.get(`http://localhost:5001/habits/${habitId}`);
    let valueNumber = +data.data.reps;
    valueNumber += 1;

    await axios.patch(`http://localhost:5001/habits/${habitId}`, {
      reps: `${valueNumber}`,
    });
  };

  let decreaseValue = async () => {
    if (value > 0) {
      let data = await axios.get(`http://localhost:5001/habits/${habitId}`);
      let valueNumber = +data.data.reps;
      valueNumber -= 1;

      await axios.patch(`http://localhost:5001/habits/${habitId}`, {
        reps: `${valueNumber}`,
      });
    }
  };

  let refresh = async() => {
    await axios.patch(`http://localhost:5001/habits/${habitId}`, {
      reps: `0`,
    });
  }

  plus.addEventListener("click", increaseValue);
  minus.addEventListener("click", decreaseValue);
  refreshBtn.addEventListener("click", refresh);
};

//More info
let openMoreInfo = async (habitBox, element) => {
  let i = habitBox.querySelector(".iconBox i");
  let iconBox = habitBox.querySelector(".iconBox");
  i.addEventListener("click", () => {
    habitBox.querySelector('.counterWrap').remove();
    i.remove();

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i><p>Delete</p>`;
    deleteBtn.classList.add("deleteBtn");

    let editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i><p>Enable editing</p>`;
    editBtn.classList.add("editBtn");

    iconBox.append(deleteBtn);
    iconBox.append(editBtn);

    // Delete button
    deleteBtn.addEventListener("click", () => {
      deleteHabit(element.id, habitBox);
    });

    // Edit button
    editBtn.addEventListener("click", () => {
      editHabit(element.id, habitBox);
      let saveBtn = document.createElement("button");
      saveBtn.classList.add("save");
      saveBtn.innerHTML = `<i class="fa-solid fa-check" style="color: #ffffff;"></i><p>Save</p>`;
      iconBox.append(saveBtn);
      editBtn.remove();

      saveBtn.addEventListener("click", async () => {
        let updatedTitle = habitBox.querySelector("input").value;
        let updatedPriority = habitBox.querySelector("select").value;
        try {
          if(updatedTitle.length>2){
            await axios.patch(`http://localhost:5001/habits/${element.id}`, {
              title: updatedTitle,
              priority: updatedPriority,
            });
          }else{
            alert("The title is too short");
          }
        } catch (error) {
          console.log("", error);
        }
      });
    });
  });
};

//deletes a habit after pressing delete
let deleteHabit = async (habitId, habitBox) => {
  try {
    await axios.delete(`http://localhost:5001/habits/${habitId}`);
    habitBox.remove();
  } catch (error) {
    console.error("", error);
  }
};

//Enable editing
let editHabit = async (habitId, habitBox) => {
  let title = habitBox.querySelector(".informationBox p");

  let text = title.textContent;
  let input = document.createElement("input");
  input.value = text;
  habitBox.querySelector(".informationBox").prepend(input);
  title.remove();

  let priority = habitBox.querySelector(".informationBox p:last-of-type");

  let select = document.createElement("select");

  let optionL = document.createElement("option");
  optionL.textContent = "low";

  let optionM = document.createElement("option");
  optionM.textContent = "medium";

  let optionH = document.createElement("option");
  optionH.textContent = "high";

  select.append(optionL, optionM, optionH);

  habitBox.querySelector(".informationBox").append(select);
  priority.remove();
};

//Load page
let loadPage = async () => {
  sort();
  let filteredHabits = await getHabitData()

  if (sessionStorage.getItem("selectedPriorites")) {
    filteredHabits = await filterPage();
  }

  let valueInStorage = sessionStorage.getItem("sorting");

  if (valueInStorage) {
    filteredHabits.forEach((item) => {
      item.reps = Number(item.reps);
    });

    let setOrder = async () => {
      filteredHabits.forEach((element) => {
        if (element.priority === "low") {
          element.priority = 0;
        } else if (element.priority === "medium") {
          element.priority = 1;
        } else if (element.priority === "high") element.priority = 2;
      });
    };

    if (valueInStorage === "pLowHigh") {
      setOrder();
      filteredHabits.sort((a, b) => a.priority - b.priority);
    } else if (valueInStorage === "pHighLow") {
      setOrder();
      filteredHabits.sort((a, b) => b.priority - a.priority);
    } else if (valueInStorage === "rLowHigh") {
      filteredHabits.sort((a, b) => a.reps - b.reps);
    } else if (valueInStorage === "rHighLow") {
      filteredHabits.sort((a, b) => b.reps - a.reps);
    }
  }

  document.querySelector("#allHabits").innerHTML = "";
  filteredHabits.forEach((element) => {
    let habitBox = createHabitBox(element);
    document.querySelector("#allHabits").append(habitBox);

    let value = element.reps;
    let habitId = element.id;
    countRepetitions(habitBox, value, habitId);
    openMoreInfo(habitBox, element);
  });
};

let filterPage = async () => {
  let checked = sessionStorage.getItem("selectedPriorites");
  let filteredHabits = await getHabitData();
  if (checked) {
    let checkedArray = checked.split(",");

    let allCheckboxes = document.querySelectorAll("input[type='checkbox']");

    allCheckboxes.forEach((checkbox) => {
      if (checkedArray.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });

    if (
      document.querySelectorAll("input[type='checkbox']:checked").length > 0
    ) {
      filteredHabits = filteredHabits.filter((habit) =>
        checkedArray.includes(habit.priority)
      );
    }
  }
  return filteredHabits;
};

//Pusher filtering details to local storage
let filter = () => {
  let selectedPriorities = [];
  let high = document.querySelector("#highCheckbox");
  let medium = document.querySelector("#mediumCheckbox");
  let low = document.querySelector("#lowCheckbox");

  if (high.checked) {
    selectedPriorities.push("high");
  }
  if (medium.checked) {
    selectedPriorities.push("medium");
  }
  if (low.checked) {
    selectedPriorities.push("low");
  }

  sessionStorage.setItem("selectedPriorites", `${selectedPriorities}`);

  loadPage();
};

let sort = async () => {
  //pushes or updates value to db after pressing button apply
  let selectedRadio = document.querySelector(
    'input[type="radio"][name="sort"]:checked'
  );

  if (selectedRadio) {
    sessionStorage.setItem("sorting", selectedRadio.value);
  }

  //checks in button if value is is storage
  let allRadios = document.querySelectorAll('input[type="radio"][name="sort"]');
  let valueInStorage = sessionStorage.getItem("sorting");

  allRadios.forEach((radio) => {
    if (valueInStorage === radio.value) {
      radio.checked = true;
    } else {
      radio.checked = false;
    }
  });
};

document.querySelector("#filterButton").addEventListener("click", filter);
document.querySelector("#applySorting").addEventListener("click", loadPage);
loadPage();