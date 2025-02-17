//Creates a box for creating new habit
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
                    <option value="" disabled selected>Choose priority</option>
                    <option>low</option>
                    <option>medium</option>
                    <option>high</option>
                </select>
                <button id="saveHabit">Save</button>
            </div>`;

    document.querySelector("#moreInfo").append(mainDiv);
    document.querySelector("#saveHabit").addEventListener("click", pushHabitdb);
  }
};

//Button create new habit
document.querySelector("#createNew").addEventListener("click", createHabit);

//Pushes habit to db after pressing save
let pushHabitdb = async () => {
  let userId = sessionStorage.getItem("userId");
  let value = 0;
  let title = document.querySelector("#habitTitle").value;
  let chosenPriority = document.querySelector("#prioritySelection").value;

  await axios.post("http://localhost:5001/habits", {
    userId,
    title,
    reps: value,
    priority: chosenPriority,
  });
};

//Finds habits in db and filters by user id
let getHabits = async () => {
  let userId = sessionStorage.getItem("userId");
  let habits = await axios.get("http://localhost:5001/habits");
  let filteredHabits = habits.data.filter((habit) => habit.userId === userId);
  return filteredHabits;
};

//Create a habit box for posting to the page
let createHabitBox = (habit) => {
  let habitBox = document.createElement("div");
  habitBox.classList.add("habitBox");
  habitBox.innerHTML = `
        <div class="informationBox">
            <p>${habit.title}</p>
            <p>Priority: ${habit.priority}</p>
        </div>
        <div class="more">
            <div class = "counterWrap">
                <p>Repetitions</p>
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
let countRepetitions = (habitBox, value) => {
  let plus = habitBox.querySelector(".plus");
  let minus = habitBox.querySelector(".minus");
  let currentValue = habitBox.querySelector(".value");

  let increaseValue = () => {
    value += 1;
    currentValue.textContent = `${value}`;
  };

  let decreaseValue = () => {
    if (value > 0) {
      value -= 1;
      currentValue.textContent = `${value}`;
    }
  };

  plus.addEventListener("click", increaseValue);
  minus.addEventListener("click", decreaseValue);
};

//More info
let openMoreInfo = async(habitBox, element) => {
  let i = habitBox.querySelector(".iconBox i");
  let iconBox = habitBox.querySelector(".iconBox");
  i.addEventListener("click", () => {
    document.querySelector("#moreInfo").append(habitBox);
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
      saveBtn.innerHTML= `<i class="fa-solid fa-check" style="color: #ffffff;"></i><p>Save</p>`
      iconBox.append(saveBtn);
      editBtn.remove();

      saveBtn.addEventListener("click", async()=>{
        let updatedTitle = habitBox.querySelector("input").value;
        let updatedPriority = habitBox.querySelector("select").value;
        try {
            await axios.patch(`http://localhost:5001/habits/${element.id}`, {
                title: updatedTitle,
                priority: updatedPriority
              });
        } catch (error) {
            console.log("",error);
        }
        
      })
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
  let filteredHabits = await getHabits();

  filteredHabits.forEach((element) => {
    let habitBox = createHabitBox(element);
    document.querySelector("#habitsMain").append(habitBox);

    let value = element.reps;
    countRepetitions(habitBox, value);
    openMoreInfo(habitBox, element);
  });
};

loadPage();
