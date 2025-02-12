let createHabit = () => {
    if (document.body.querySelector("#mainDiv")) {
        return;
    } else {
        let mainDiv = document.createElement("div");
        mainDiv.id = "mainDiv";
        mainDiv.innerHTML = `
            <div id="title">
                <label for="habitTitle">Habit title</label>
                <input type="text" id="habitTitle" required>
            </div>
            <div id="priority">
                <label for="prioritySelection">Priority</label>
                <select name="prioritySelection" id="prioritySelection">
                    <option value="" disabled selected>Choose priority</option>
                    <option>low</option>
                    <option>medium</option>
                    <option>high</option>
                </select>
                <button id="saveHabit">Save</button>
            </div>`;
        document.body.append(mainDiv);
        document.querySelector("#saveHabit").addEventListener("click", addHabit);
    }
};

document.querySelector("#createNew").addEventListener("click", createHabit);

let addHabit = () => {
    let value = 0;
    let title = document.querySelector("#habitTitle").value;
    let chosenPriority = document.querySelector("#prioritySelection").value;
    let habitBox = document.createElement("div");
    habitBox.classList.add("habitBox");
    habitBox.innerHTML = `
        <div class="informationBox">
            <p>${title}</p>
            <p>Priority: ${chosenPriority}</p>
        </div>
        <div class="repetitionBox">
            <p>Repetitions</p>
            <div class="counter">
                <button class="minus">-</button>
                <p class="value">${value}</p>
                <button class="plus">+</button>
            </div>
        </div>`;
    document.body.append(habitBox);
    document.querySelector("#mainDiv").remove();

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
