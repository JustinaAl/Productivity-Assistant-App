
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const error = document.querySelector("#error");

const btnCreateUser = document.querySelector("#createUser");
const btnLogin = document.querySelector("#login");



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

    const userData = await getData("http://localhost:5000/users", { username});

    console.log(userData);
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
        }
        
    }
}
const login = () => {
    error.classList = "";
    error.classList.add("hidden");
}


btnCreateUser.addEventListener('click', createUser)
btnLogin.addEventListener('click', login)