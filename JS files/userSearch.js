
const userElements = document.querySelectorAll('.user');
const currentUser = sessionStorage.getItem('currentUserID')
if (userElements.length > 0) {
    userElements.forEach(userElement => {
        userElement.addEventListener('click', (event) => {

            const other = event.currentTarget.id;
            sessionStorage.setItem('otherUser', other)
            window.location.href = `/profile/${other}`
        });
    });
}
