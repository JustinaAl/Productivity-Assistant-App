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

        let wrapper = document.createElement("div");
        wrapper.id = "moreInfo";
        document.body.querySelector("#habitsWrapper").append(wrapper);
        
        document.querySelector("#moreInfo").append(mainDiv);
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

    document.querySelector("#habitsMain").append(habitBox);
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
