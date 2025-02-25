import { getData, postData, changeData, deleteData } from "./services.js";

// Stores the ID of the todo being edited
let editingTodoId = null; 

// main components
//save all todos into this div:
const allTodosContainer = document.querySelector('#allTodosContainer');

//done todos in this div:
const doneTodosContainer = document.querySelector('#doneTodosContainer');

//Load todo form button:
const createTodoBtn = document.querySelector('#createNewTodo');

//the todo form
const todoForm = document.querySelector('#todoForm');

//save button that saves the todo to the user and print it onto dom
const saveBtn = document.querySelector('#saveBtn');
/////////////////////////////////////////////
//title input 
const titleInput = document.querySelector('#todoTitle');

//date deadline
const deadlineInput = document.querySelector('#deadline');

//time estimate
const timeEstimateInput = document.querySelector('#timeEstimate');

//category
const categoryInput = document.querySelector('#category');

//description
const descriptionInput = document.querySelector('#description');

//Get user id from session storage
const userId = sessionStorage.getItem("userId");

if (!userId) {
    alert("No user logged in");
    window.location.href = "./index.html"; 
} else {
    console.log(`User: ${userId}`);
}

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

//flatpickr
document.addEventListener("DOMContentLoaded", () => {
   flatPickr();
});

const createOrUpdateTodo = async () => {
    if (!userId) {
        alert('No user logged in');
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
    flatPickr();

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

                // try {
                // await changeData(`http://localhost:5001/todos/${todo.id}`, { status: newStatus });
                // console.log(`Todo '${todo.title}' marked as: ${newStatus}`);

                // setTimeout(() => {
                //     loadTodos();
                // }, 300);
                // } catch (error) {
                //     console.error('Error updating status:', error);
                //     statusCheckbox.checked = !statusCheckbox.checked;
                // } finally {
                //     statusCheckbox.disabled = false;
                // }
            });

            //DELETEBTN
            const deleteBtn = todoContent.querySelector('.deleteTodoBtn');
            deleteBtn.addEventListener('click', async () => {
                await deleteData(`http://localhost:5001/todos/${todo.id}`);
                console.log(`Todo '${todo.title}' deleted`);
                await loadTodos();
                flatPickr();
            });
            todoCard.appendChild(todoContent);
            todoCard.appendChild(statusCheckbox);

            if (todo.status !== "done") {
                allTodosContainer.appendChild(todoCard);

            } else if (todo.status === "done"){
                doneTodosContainer.appendChild(todoCard)
            }

        });
        flatPickr();
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

    flatPickr();
};

//show form with button click
createTodoBtn.addEventListener("click", function () {
    todoForm.style.display = "block";

    todoTitle.innerText = "Title";
    todoTitle.style.color = "#999"; 

         flatPickr("#deadline", {
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

    // setTimeout(() => {
    //     flatpickr("#deadline", {
    //         dateFormat: "Y-m-d",
    //         minDate: "today",
    //         theme: "dark",
    //         allowInput: true,
    //         onOpen: function(selectedDates, dateStr, instance) {
    //             if (instance.input.value === "") {
    //                 instance.input.placeholder = ""; // Remove placeholder when opened
    //             }
    //         },
    //         onClose: function(selectedDates, dateStr, instance) {
    //             if (instance.input.value === "") {
    //                 instance.input.placeholder = "Deadline"; // Restore placeholder if empty
    //             }
    //         }
    //     });
    // }, 10);

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

    if (categorySelect.value === "") {
        alert("Please select a category before saving.");
        event.preventDefault(); // Prevents form submission
    }
});