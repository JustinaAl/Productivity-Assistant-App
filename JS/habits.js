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
    let userId = sessionStorage.getItem('userId');
    let value = 0;
    let title = document.querySelector("#habitTitle").value;
    let chosenPriority = document.querySelector("#prioritySelection").value;

    await axios.post("http://localhost:5001/habits", {
        userId,
        title,
        reps: value,
        priority: chosenPriority
    });
};


//Finds habits in db and filters by user id
let getHabits = async () => {
    let userId = sessionStorage.getItem('userId');
    let habits = await axios.get("http://localhost:5001/habits");
    let filteredHabits = habits.data.filter(habit => habit.userId === userId);
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
        <div class="repetitionBox">
            <div>
                <p>Repetitions</p>
                <div class="counter">
                    <button class="minus">-</button>
                    <p class="value">${habit.reps}</p>
                    <button class="plus">+</button>
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
let openMoreInfo = (habitBox, element) => {
    let iconBox = habitBox.querySelector(".iconBox");
    iconBox.addEventListener("click", () => {
        document.querySelector("#moreInfo").append(habitBox);
        iconBox.remove();

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("deleteBtn");

        let editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("editBtn");

        habitBox.append(deleteBtn);
        habitBox.append(editBtn);

        // Delete button
        deleteBtn.addEventListener("click", () => {
            deleteHabit(element.id, habitBox);
        });

        // Edit button
        editBtn.addEventListener("click", () => {
            editHabit(element);
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

//Load page
let loadPage = async () => {
    let filteredHabits = await getHabits();

    filteredHabits.forEach(element => {
        let habitBox = createHabitBox(element);
        document.querySelector("#habitsMain").append(habitBox);

        let value = element.reps;
        countRepetitions(habitBox, value);
        openMoreInfo(habitBox, element);
    });
};

loadPage();

