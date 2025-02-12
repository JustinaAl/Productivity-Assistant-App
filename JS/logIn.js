
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const error = document.querySelector("#error");

const btnCreateUser = document.querySelector("#createUser");
const btnLogin = document.querySelector("#login");

if (localStorage.getItem("createdUser") === "true") {
    error.classList.remove("hidden");
    error.classList.add("success");
    error.innerText = "User successfully created";
    localStorage.removeItem("createdUser");
  }

const getData = async (url, params) => {

    const response = await axios.get(url, { params });
    
    return response.data;
}


const postData = async(url, newData) =>{

    const response = await axios.post(url, newData);
    return response.data;
}

const createUser = async() => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    error.classList = "";
    error.classList.add("hidden");

    if (username){
        const userData = await getData("http://localhost:5000/users", { username})
        
        if (!userData || userData.length !== 0){
            error.innerText = "Username already taken"
            error.classList.remove("hidden")
        }else if (username.length < 3){
            error.innerText = "Username must be atleast 3 chars long"
            error.classList.remove("hidden")
        }else if (password.length < 6){
            error.innerText = "Password must be atleast 6 chars long"
            error.classList.remove("hidden")
        } else {
            const response = await postData("http://localhost:5000/users", {
                username,
                password,
            })
    
            if(!response){
                error.classList.remove("hidden")
                error.innerText = "Something went wrong, try again"
            } else {
                error.classList.remove("hidden")
                error.innerText = "User successfully created"
                error.classList.add("success")
                localStorage.setItem("createdUser", "true");
            }
            
        }
    }else {
        error.innerText = "Username must be atleast 3 chars long"
        error.classList.remove("hidden")
    }

    
    
}
const login = async() => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    error.classList = "";
    error.classList.add("hidden");
    try{
        const userData = await getData("http://localhost:5000/users", { username});
        if(userData[0] && userData[0].username === username && userData[0].password === password){
            sessionStorage.setItem("userId", userData[0].id)
            error.classList.remove("hidden")
            error.innerText = "Login successfull!"
            error.classList.add("success")

            setTimeout(() => {
                window.location.href = "startSida.html";
            }, 2000);
        } else {
            error.classList.remove("hidden")
            error.innerText = "Wrong username or password"
        }
    
    } catch(error) {
        console.error("Something went wrong" + error);
    }
    
    
}


btnCreateUser.addEventListener('click', createUser)
btnLogin.addEventListener('click', login)