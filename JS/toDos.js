import { getData, postData, changeData, deleteData } from "./services.js";

// main components
const allTodosContainer = document.querySelector('#allTodosContainer');
const createTodoBtn = document.querySelector('#createNewTodo');
const todoForm = document.querySelector('#todoForm');
const saveBtn = document.querySelector('#saveBtn');

//Get user id from session storage
const userId = sessionStorage.getItem("userId");

if (!userId) {
    alert("No user logged in");
    window.location.href = "./logInSida.html"; 
} else {
    console.log(`User: ${userId}`);
}



//show form with button click
console.log(createTodoBtn);
createTodoBtn.addEventListener("click", function () {
    todoForm.style.display = "block";

    // Remove any previously applied Flatpickr (if it exists) to prevent multiple instances
    const deadlineInput = document.querySelector("#deadline");
    if (deadlineInput._flatpickr) {
        deadlineInput._flatpickr.destroy();
    }

    // Reinitialize Flatpickr every time the form is shown
    flatpickr("#deadline", {
        dateFormat: "Y-m-d",
        minDate: "today",
        theme: "dark",
        allowInput: true,
        onOpen: function(selectedDates, dateStr, instance) {
            if (instance.input.value === "") {
                instance.input.placeholder = ""; // Remove placeholder when opened
            }
        },
        onClose: function(selectedDates, dateStr, instance) {
            if (instance.input.value === "") {
                instance.input.placeholder = "Deadline"; // Restore placeholder if empty
            }
        }
    });
});
    
