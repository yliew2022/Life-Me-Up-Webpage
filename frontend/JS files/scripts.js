const register = document.querySelectorAll('span');
const loginContainer = document.querySelector('.login-container');
const createAccount = document.querySelector('.createAccount-container');
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector(".search-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const searchBox = document.querySelector(".search-box");

    searchBtn.onclick = () => {
        searchBox.classList.add("active");
    };

    cancelBtn.onclick = () => {
        searchBox.classList.remove("active");
    };
});
document.addEventListener("DOMContentLoaded", function() {
    var editAccountContainer = document.querySelector(".editAccount-container");
    editAccountContainer.style.display = "block";
});

register.forEach((span) => {
    span.addEventListener('click', () => {
        if (loginContainer.style.display === 'block') {
            loginContainer.style.display = 'none';
            createAccount.style.display = 'block';
            
        } else {
            loginContainer.style.display = 'block';
            createAccount.style.display = 'none';
        }
    });
});


document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": ["application/json"],
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            // Authentication successful
            const data = await response.json();
            console.log("Login successful:", data);

            // You can redirect or perform other actions here.
        } else {
            // Authentication failed
            const errorData = await response.json();
            console.error("Login failed:", errorData);
        }
    } catch (error) {
        console.error("An error occurred during login:", error);
    }
});

document.getElementById("createAccount-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const createEmail = document.getElementById("createEmail").value;
    const zNumber = document.getElementById("zNumber").value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById("username").value;
    const createPassword = document.getElementById("createPassword").value;
    const rePassword = document.getElementById("rePassword").value;

    // Additional client-side validation if needed

    if(rePassword === createPassword){
        try {
            const userData = {
                firstName,
                lastName,
                userName: username,
                password: createPassword,
                email: createEmail,
                zNumber
            }
            console.log(userData);
            const response = await fetch("http://localhost:3000/api/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),

            });
    
            if (response.ok) {
                const user = await response.json();
                console.log("User created:", user);
                // Handle success, maybe redirect to login page
            } else {
                const errorData = await response.json();
                console.error("Error creating user:", errorData);
                // Handle the error, display a message, etc.
            }
        } catch (error) {
            console.error("An error occurred during user creation:", error);
        }
    }

    
});



