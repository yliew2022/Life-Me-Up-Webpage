const toggleButtons = document.querySelectorAll('.toggle-button');
const gymDescription = document.querySelector('.gym-description');
const personalDescription = document.querySelector('.personal-description');
const currentUser = sessionStorage.getItem('currentUserID')
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

const removeButtons = document.querySelectorAll('.removeFollowers-button');
const followers = document.querySelectorAll('.follower');

removeButtons.forEach(removeButton => {
    removeButton.addEventListener('click', async () => {
        if (removeButton.textContent == 'Remove') {
            const followerID = removeButton.getAttribute('data-followerid');
                const userToRemove = {
                followerID: followerID,
            };

            try {
                const response = await fetch(`/api/users/removeFollower/${currentUser}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userToRemove),
                });

                const removedUser = await response.json();
                if (response.ok) {
                    console.log(removedUser);
                    window.location.reload();
                } else {
                    console.log(removedUser.error);
                }
                } catch (error) {
                    console.log(error);
                }
        } else {
            removeButton.classList.remove('following');
            removeButton.textContent = 'Follow';
        }
    });
    });

    if (followers.length > 0) {
        followers.forEach(follower => {
            follower.addEventListener('click', async (e) => {
                const followerID = e.currentTarget.id;
                if (!e.target.classList.contains('removeFollowers-button')) {
                    window.location.href = `/profile/${followerID}`;
                }
            });
        });
    }
    
