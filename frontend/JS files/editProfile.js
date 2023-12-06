const currentUserID = sessionStorage.getItem('currentUserID');

const saveChanges = document.getElementById('save-changes-button')

const deleteAccountButton = document.getElementById('delete-account-button');
const confirmationOverlay = document.getElementById('confirmationOverlay');
const confirmDeleteButton = document.getElementById('confirmDelete');
const cancelDeleteButton = document.getElementById('cancelDelete');
const editProfileForm = document.getElementById('edit-profile-form');

deleteAccountButton.addEventListener('click', function (event) {
    event.preventDefault();
    confirmationOverlay.style.display = 'block';
});


cancelDeleteButton.addEventListener('click', function () {
    confirmationOverlay.style.display = 'none';
});

editProfileForm.addEventListener('submit', function (event) {
    event.preventDefault();
});

window.addEventListener('click', function (event) {
    if (event.target === confirmationOverlay) {
        confirmationOverlay.style.display = 'none';
    }
});




saveChanges.addEventListener('click', async (event) => {
    event.preventDefault();

    const formData = {
        userName: document.getElementById('username').value,
        editPassword: document.getElementById('editPassword').value,
        rePassword: document.getElementById('rePassword').value,
        personalProfile: document.getElementById('personalDescription').value,
        gymProfile: document.getElementById('gymDescription').value
    };

    const image = document.getElementById('imgfile').files[0];
    const imageData = new FormData();

    if (image) {
        imageData.append('imgfile', image);
        imageData.append('userId',currentUserID)
        console.log("Image Data:", imageData);
        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: imageData, // Use imageData instead of image
                headers: {
                    // 'Content-Type': 'multipart/form-data', // Set Content-Type header
                },
            });

            const result = await response.json();
            if(response.ok){
                console.log(result)
            }else{
                console.log(result.error)
            }
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    console.log(formData.userName);

    try {
        const response = await fetch(`http://localhost:3000/api/users/update/${currentUserID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const updated = await response.json();
        if (response.ok) {
            console.log("Successfully updated user");
            console.log(updated);
            window.location.href = `/myProfile/${currentUserID}`;
        } else {
            console.log(updated.error);
        }
    } catch (error) {
        console.log(error);
    }
});



confirmDeleteButton.addEventListener('click', async () => {
    try {
        const userID = sessionStorage.getItem('currentUserID');
        const response = await fetch(`http://localhost:3000/api/users/delete/${userID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const confirmation = window.confirm('Your account was deleted. Click OK to proceed.');
            if (confirmation) {
                // Redirect the user to another page or perform any other desired action
                window.location.href = '/';
            }
        } else {
            console.error('Failed to delete account:', response.statusText);
        }
    } catch (error) {
        console.error('Error during account deletion:', error);
    }
});