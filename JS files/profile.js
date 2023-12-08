
const currentUserID = sessionStorage.getItem('currentUserID');
const toggleButtons = document.querySelectorAll('.toggle-button');
const gymDescription = document.querySelector('.gym-description');
const personalDescription = document.querySelector('.personal-description');
const followButton = document.querySelector('.follow-button');
let loggedInUser;
const otherUser = sessionStorage.getItem('otherUser')
const followers = document.querySelectorAll('.follower');

document.addEventListener("DOMContentLoaded", async ()=>{
    try {
        const response = await fetch(`/api/users/${currentUserID}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    
        loggedInUser = await response.json();
        if(response.ok){
            if(loggedInUser.followers.includes(otherUser)){
                followButton.classList.add('following');
                followButton.textContent = 'Following';
            }else{
                followButton.classList.remove('following');
                followButton.textContent = 'Follow';
            }
           
        }else{
            console.log('Something went wrong', loggedInUser.error)
        }
    } catch (error) {
        console.log(error)
    }
})
  

followButton.addEventListener('click', async ()=>{
    if(followButton.textContent == 'Follow'){
        const followerID = document.querySelector('.profile-container').id
        const userToAdd = {
            followerID: followerID,
           
        }
        try{
            const response = await fetch(`/api/users/addFollower/${currentUserID}`,{
                method: 'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(userToAdd)
            })
            
            const addedUser = await response.json()
            if(response.ok){
                followButton.classList.add('following');
                followButton.textContent = 'Following';
            }else{
                console.log(addedUser.error)
            }
        }catch(error){
            console.log(error)
        }
        
    } else {
        try {
            const followerID = document.querySelector('.profile-container').id
            const userToRemove = {
            followerID: followerID,
            }
            const response = await fetch(`/api/users/removeFollower/${currentUserID}`,{
                method: 'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(userToRemove)
            })
            
            const removedUser = await response.json()
            if(response.ok){
                followButton.classList.remove('following');
                followButton.textContent = 'Follow';
            }else{
                console.log(addedUser.error)
            }
           
        
        } catch (error) {
            console.log(error)
        }
        
        
        
    }
    
})

if (followers.length > 0) {
    followers.forEach(follower => {
        follower.addEventListener('click', async (e)=>{
            const followerID = e.currentTarget.id
            if(followerID !== currentUserID){
                window.location.href = `/profile/${followerID}`
            }
        })
    });
}

// Add click event listeners to toggle buttons
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Hide both description elements
        gymDescription.style.display = 'none';
        personalDescription.style.display = 'none';

        // Remove the "active" class from all buttons
        toggleButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Determine which button was clicked
        const descriptionType = button.getAttribute('data-description');

        // Display the corresponding description and add the "active" class to the clicked button
        if (descriptionType === 'gym') {
            gymDescription.style.display = 'block';
            button.classList.add('active');
        } else if (descriptionType === 'personal') {
            personalDescription.style.display = 'block';
            button.classList.add('active');
        }
    });
});

// Initially, show one of the descriptions (you can choose 'gym' or 'personal)
// and add the "active" class to the corresponding button
gymDescription.style.display = 'block';
toggleButtons[0].classList.add('active');






