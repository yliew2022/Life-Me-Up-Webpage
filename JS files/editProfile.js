const currentUserID = sessionStorage.getItem('currentUserID');
let currentImageIndex = 0;
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

function changeImage(direction) {
    const imageOptions = document.getElementById('profilePicture');
    const previewImage = document.getElementById('previewImage');

    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = imageOptions.length - 1;
    } else if (currentImageIndex >= imageOptions.length) {
        currentImageIndex = 0;
    }

    // Construct the correct path based on your requirements
    const imagePath = imageOptions[currentImageIndex].value;

    // Assuming that imagePath is in the format "frontend\images\avatar1.jpg"
    const correctedImagePath = imagePath.replace(/\\/g, '/');  // Replace backslashes with forward slashes

    // Set the corrected path to the preview image
    previewImage.src = correctedImagePath;
}

document.getElementById('prevImage').addEventListener('click', () => changeImage(-1));
document.getElementById('nextImage').addEventListener('click', () => changeImage(1));


saveChanges.addEventListener('click', async (event) => {
        event.preventDefault();
        const selectedImageIndex = currentImageIndex;
        const imageOptions = document.getElementById('profilePicture').options;
        const selectedImage = imageOptions[selectedImageIndex].value;
        const formData = {
            userName: document.getElementById('username').value,
            editPassword: document.getElementById('editPassword').value,
            rePassword: document.getElementById('rePassword').value,
            personalProfile: document.getElementById('personalDescription').value,
            gymProfile: document.getElementById('gymDescription').value,
        };

        try {
            const response = await fetch(`/api/users/update/${currentUserID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profileImage: selectedImage }),
            });

            const updated = await response.json();
            if (response.ok) {
                console.log("Successfully updated user with selected profile image");
                console.log(updated);
                window.location.href = `/myProfile/${currentUserID}`;
            } else {
                console.log(updated.error);
            }
        } catch (error) {
            console.log(error);
        }
        try {
            const response = await fetch(`/api/users/update/${currentUserID}`, {
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
        const response = await fetch(`/api/users/delete/${userID}`, {
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