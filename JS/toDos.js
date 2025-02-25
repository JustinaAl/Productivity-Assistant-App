import { getData, postData, changeData, deleteData } from "./services.js";

// Stores the ID of the todo being edited
let editingTodoId = null; 
let allTodos = [];

//Global Variables:
const allTodosContainer = document.querySelector('#allTodosContainer');
const doneTodosContainer = document.querySelector('#doneTodosContainer');
const createTodoBtn = document.querySelector('#createNewTodo');
const todoForm = document.querySelector('#todoForm');
const saveBtn = document.querySelector('#saveBtn');
const categoryFilter = document.querySelector('#categoryFilter');
const sortSelect = document.querySelector('#sort');

//input fields:
const titleInput = document.querySelector('#todoTitle');
const deadlineInput = document.querySelector('#deadline');
const timeEstimateInput = document.querySelector('#timeEstimate');
const categoryInput = document.querySelector('#category');
const descriptionInput = document.querySelector('#description');


//Get user id from session storage
const userId = sessionStorage.getItem("userId");
let username = sessionStorage.getItem("username");

if (!userId) {
    alert("No user logged in");
    window.location.href = "./index.html"; 
} 

if (!username && userId) {
  
    (async () => {
        const user = await getData(`http://localhost:5001/users/${userId}`);
        if (user && user.username) {
            sessionStorage.setItem("username", user.username);
            username = user.username; // Update the local variable
            console.log(`Fetched Username: ${username}, User ID: ${userId}`);
        }
    })();
} else {
    console.log(`Username: ${username}, User ID: ${userId}`);
}

// FlatPickr function 
let flatPickrInstance = null; 

const initFlatPickr = () => {
    if (flatPickrInstance) {
        flatPickrInstance.destroy(); // Ensure previous instance is removed
    }

    flatPickrInstance = flatpickr("#deadline", {
        dateFormat: "Y-m-d",
        minDate: "today",
        theme: "dark",
        allowInput: true,
        onOpen: function (selectedDates, dateStr, instance) {
            if (instance.input.value === "") {
                instance.input.placeholder = ""; // Remove placeholder when opened
            }
        },
        onClose: function (selectedDates, dateStr, instance) {
            if (instance.input.value === "") {
                instance.input.placeholder = "Deadline"; // Restore placeholder if empty
            }
        }
    });
};

// Initialize Flatpickr only once when page loads
document.addEventListener("DOMContentLoaded", initFlatPickr);

const createOrUpdateTodo = async () => {
    if (!userId) {
        alert('No user logged in');
        return;
    }

    if (
        titleInput.innerText.trim() === "" ||
        deadlineInput.value.trim() === "" ||
        timeEstimateInput.value.trim() === "" ||
        categoryInput.value.trim() === "" ||
        descriptionInput.value.trim() === ""
    ) {
        return; 
    }

    const newData = {
        userId: userId,
        title: titleInput.innerText.trim(),
        deadline: deadlineInput.value,
        timeEstimate: timeEstimateInput.value,
        category: categoryInput.value,
        description: descriptionInput.value,
        status: "not done"
    };

    if (editingTodoId) {
        //if editing, update existing todo
        console.log('Updating Todo:', newData);
        await changeData(`http://localhost:5001/todos/${editingTodoId}`, newData);
    } else {
        console.log("New Todo:", newData);
        const savedTodo = await postData('http://localhost:5001/todos', newData);
    }
    editingTodoId = null;
    saveBtn.innerText = "Save";
    loadTodos();

    console.log('Saved todo response:', savedTodo);
    if (!editingTodoId &&savedTodo) {
    displayTodo(savedTodo);
    } else {
        console.error('Error: Saved todo is undefined')
    }
};

//display a todo in the DOM
const displayTodo = (todo) => {
    const todoCard = document.createElement('div');
    todoCard.classList.add('todoCard');

    const statusCheckbox = document.createElement('input');
    statusCheckbox.type = "checkbox";
    statusCheckbox.checked = todo.status === 'done';
    statusCheckbox.classList.add('todoCheckbox');
    
    statusCheckbox.addEventListener('change', async () => {
        const newStatus = statusCheckbox.checked ? 'done' : 'not done';

        try {
            await changeData(`http://localhost:5001/todos/${todo.id}`, { status: newStatus });
            console.log(`Todo '${todo.title}' marked as: ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            statusCheckbox.checked = !statusCheckbox.checked;
        }
    });

    const todoContent = document.createElement('div');
    todoContent.innerHTML = `
        <h3 class="todoTitle">${todo.title}</h3>
        <p><strong>Deadline:</strong> ${todo.deadline || 'No deadline'}</p>
        <p><strong>Time Estimate:</strong> ${todo.timeEstimate} hours</p>
        <p><strong>Category:</strong> ${todo.category}</p>
        <p>${todo.description || 'No description'}</p>
        <button class='deleteTodoBtn' data-id="${todo.id}">Delete</button>
    `;

    //deleteBtn
    const deleteBtn = todoContent.querySelector('.deleteTodoBtn');
    deleteBtn.addEventListener('click', async () => {
        await deleteData(`http://localhost:5001/todos/${todo.id}`);
        console.log(`Todo '${todo.title} deleted'`);
        todoCard.remove();
    });
    todoCard.appendChild(statusCheckbox);
    todoCard.appendChild(todoContent);
    allTodosContainer.appendChild(todoCard);
};

//SAVE todo
saveBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    await createOrUpdateTodo();
});

//load todos
const loadTodos = async () => {
    try {
        const todos = await getData('http://localhost:5001/todos');
        const userTodos = todos.filter(todo => todo.userId === userId);

        console.log("All Todos:", todos); // Logs all todos (for debugging)
        console.log(`Todos for user ${userId}:`, userTodos); // Logs only user-specific todos

        allTodosContainer.innerHTML = "";

        userTodos.forEach(todo => {
            const todoCard = document.createElement('div');
            todoCard.classList.add('todoCard');

            const todoContent = document.createElement('div');
            todoContent.innerHTML = `
                <h3 class="todoTitle">${todo.title}</h3>
                <p><strong>Deadline:</strong> ${todo.deadline || 'No deadline'}</p>
                <p><strong>Time Estimate:</strong> ${todo.timeEstimate} hours</p>
                <p><strong>Category:</strong> ${todo.category}</p>
                <p>${todo.description || 'No description'}</p>
                <button class='deleteTodoBtn' data-id="${todo.id}">Delete</button>
                <button class='editTodoBtn' data-id="${todo.id}">Edit</button>
            `;

            const editTodoBtn = todoContent.querySelector('.editTodoBtn');

            //edit functionality
            editTodoBtn.addEventListener('click', () => {
                editTodo(todo);
            });

            // Checkbox for status
            const statusCheckbox = document.createElement('input');
            statusCheckbox.type = "checkbox";
            statusCheckbox.checked = todo.status === 'done';
            statusCheckbox.classList.add('todoCheckbox');

            // Update status when box is clicked
            statusCheckbox.addEventListener('change', async () => {
                const newStatus = statusCheckbox.checked ? 'done' : 'not done';

                statusCheckbox.disabled = true;
                statusCheckbox.checked = newStatus === 'done';

                await changeData(`http://localhost:5001/todos/${todo.id}`, { status: newStatus });

            });

            //DELETEBTN
            const deleteBtn = todoContent.querySelector('.deleteTodoBtn');
            deleteBtn.addEventListener('click', async () => {
                await deleteData(`http://localhost:5001/todos/${todo.id}`);
                console.log(`Todo '${todo.title}' deleted`);
                await loadTodos();
               
            });
            todoCard.appendChild(todoContent);
            todoCard.appendChild(statusCheckbox);

            if (todo.status !== "done") {
                allTodosContainer.appendChild(todoCard);

            } else if (todo.status === "done"){
                doneTodosContainer.appendChild(todoCard)
            }

        });
  
    } catch (error) {
        console.error('Error loading todos:', error);
    }
};
// Load todos when page loads
document.addEventListener("DOMContentLoaded", loadTodos);

//edit todo function
const editTodo = (todo) => {
    //store id of the todo being edited
    editingTodoId = todo.id;

    //load the todo details into the form
    titleInput.innerText = todo.title;
    deadlineInput.value = todo.deadline;
    timeEstimateInput.value = todo.timeEstimate;
    categoryInput.value = todo.category;
    descriptionInput.value = todo.description;

    //show the form for editing
    todoForm.style.display = "block";

    //change the save button text to indicate editing mode
    saveBtn.innerText = 'Update Todo';

};

//show form with button click
createTodoBtn.addEventListener("click", function () {

      // Clear the form fields
      titleInput.innerText = "";
      deadlineInput.value = "";
      timeEstimateInput.value = "";
      categoryInput.value = "";
      descriptionInput.value = "";
  
      // Reset editing mode
      editingTodoId = null;
      saveBtn.innerText = "Save";

    todoForm.style.display = "block";

    todoTitle.innerText = "Title";
    todoTitle.style.color = "#999"; 

    initFlatPickr();
     });

    
// Make the title editable and reset if empty
todoTitle.addEventListener("focus", () => {
    if (todoTitle.innerText === "Title") {
        todoTitle.innerText = "";
        todoTitle.style.color = "#fff"; // Reset color to normal text
    }
});

todoTitle.addEventListener("blur", () => {
    if (todoTitle.innerText.trim() === "") {
        todoTitle.innerText = "Title";
        todoTitle.style.color = "#999"; // Placeholder style
    } else {
        // Capitalize first letter
        todoTitle.innerText = todoTitle.innerText.trim().charAt(0).toUpperCase() + todoTitle.innerText.trim().slice(1);
    }
});

//SAVE BTN
saveBtn.addEventListener("click", function (event) {
    const categorySelect = document.querySelector("#category");

    if (
        titleInput.innerText.trim() === "" ||
        deadlineInput.value.trim() === "" ||
        timeEstimateInput.value.trim() === "" ||
        categoryInput.value.trim() === "" ||
        descriptionInput.value.trim() === ""
    ) {
        alert("Please fill out all fields before saving.");
        return; 
    }
});