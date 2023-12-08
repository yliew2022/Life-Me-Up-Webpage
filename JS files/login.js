const register = document.querySelectorAll('span');
const loginContainer = document.querySelector('.login-container');
const createAccount = document.querySelector('.createAccount-container');
document.addEventListener("DOMContentLoaded", () =>{
    sessionStorage.removeItem('currentUserID')
    sessionStorage.removeItem('currentUsername')
    sessionStorage.removeItem('otherUser')
})

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

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  try {
      const response = await fetch('https://lifemeuplatest-4fd195746a8a.herokuapp.com/api/users/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
          // Redirect to the profile page with the correct user ID
          sessionStorage.setItem('currentUserID', data.id)
        //   sessionStorage.setItem('currentUsername', data.username)
          window.location.href = `/myProfile/${data.id}`;
      } else {
          // Display the error message
          alert(data.error);
          console.log(data);
      }
  } catch (error) {
      console.error(error);
      alert('An unexpected error occurred. Please try again.');
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
            const response = await fetch("/api/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),

            });
    
            if (response.ok) {
                // Handle success, maybe redirect to login page
                loginContainer.style.display = 'block';
                createAccount.style.display = 'none';
            } else {
                const errorData = await response.json();
                console.error("Error creating user:", errorData);
                // Handle the error, display a message, etc.
                if (errorData.error.includes('already exists')) {
                    alert('This email or username is already in use. Please choose a different one.');
                }
                if (errorData.error.includes('not a current student')) {
                    alert('Invalid email or z-number');
                }
                
            }
        } catch (error) {
            console.error("An error occurred during user creation:", error);
        }
    }

    
});