window.onload = init;

function init() {
    var logoutBtn = document.getElementById("logout-btn");
    checkIsUserLoggedIn();

    logoutBtn.addEventListener("click", logMeOut);
}

function checkIsUserLoggedIn() {
    var loginBtn = document.getElementById("login-btn");
    var registerBtn = document.getElementById("register-btn");
    var logoutBtn = document.getElementById("logout-btn");
    var myProfile = document.getElementById("my-profile-btn");
    var adminSearcher = document.getElementById("admin-submit-searcher");

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("A user is logged in.")

            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            myProfile.style.display = 'block';

            console.log("UID de usuario: " + user.uid);
            console.log("User email: " + user.email)

            if (user.email == "snvradmin-21@gmail.com" || user.email == "snvrAdmin-21@gmail.com") {
                console.log("Hi I entered here");
                adminSearcher.style.display = 'block';
            } else {
                adminSearcher.style.display = 'none';
            }
        } else {
            console.log("There are no users logged in.")

            loginBtn.style.display = 'block';
            registerBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            myProfile.style.display = 'none';
            adminSearcher.style.display = 'none';
        }
    });
}

function logMeOut() {
    firebase.auth().signOut().then(() => {
        console.log("User has been logged out.")
    }).catch((error) => {
        console.log(error.message)
    });
}