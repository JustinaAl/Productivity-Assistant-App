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

document.querySelector("#createNew").addEventListener("click", createHabit);

//Pusher habit to db after pressing save
let pushHabitdb = async () => {
    let userId = sessionStorage.getItem('userId');
    let value = 0;
    let title = document.querySelector("#habitTitle").value;
    let chosenPriority = document.querySelector("#prioritySelection").value;
    
        await axios.post("http://localhost:5001/habits", {
            userId,
            title,
            reps:value,
            priority:chosenPriority
        });
};

let loadPage = async() => {
    let userId = sessionStorage.getItem('userId');
    let habits = await axios.get("http://localhost:5001/habits");
    let filteredHabits = habits.data.filter(habit => habit.userId === userId);

    filteredHabits.forEach(element => {
        let habitBox = document.createElement("div");
        habitBox.classList.add("habitBox");
        habitBox.innerHTML = `
            <div class="informationBox">
                <p>${element.title}</p>
                <p>Priority: ${element.priority}</p>
            </div>
            <div class="repetitionBox">
                <div>
                    <p>Repetitions</p>
                    <div class="counter">
                        <button class="minus">-</button>
                        <p class="value">${element.reps}</p>
                        <button class="plus">+</button>
                    </div>
                </div>
                <div class="iconBox"><i class="fa-solid fa-ellipsis-vertical"></i></div>
            </div>`;

        document.querySelector("#habitsMain").append(habitBox);

        let value = element.reps;
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

            deleteBtn.addEventListener("click", () => {
                deleteHabit(element.id, habitBox);
            });

        });
    });
}

let deleteHabit = async (habitId, habitBox) => {
    try {
        await axios.delete(`http://localhost:5001/habits/${habitId}`);
        habitBox.remove();
    } catch (error) {
        console.error("", error);
    }
}

loadPage();
