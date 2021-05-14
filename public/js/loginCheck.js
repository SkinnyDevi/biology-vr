window.onload = loginCheckInit;

function loginCheckInit() {
    console.log("*JS -: Login Check Started")
    var logoutBtn = document.getElementById("logout-btn");
    checkIsUserLoggedIn();

    logoutBtn.addEventListener("click", logMeOut);
}

export function checkIsUserLoggedIn() {
    var loginBtn = document.getElementById("login-btn");
    var registerBtn = document.getElementById("register-btn");
    var logoutBtn = document.getElementById("logout-btn");
    var myProfile = document.getElementById("my-profile-btn");
    var adminSearcher = document.getElementById("admin-submit-searcher");

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("A user is/has logged in.")

            if (loginBtn != null) {
                loginBtn.style.display = 'none';
            }
            if (registerBtn != null) {
                registerBtn.style.display = 'none';
            }
            if (logoutBtn != null) {
                logoutBtn.style.display = 'block';
            }
            if (myProfile != null) {
                myProfile.style.display = 'block';
            }

            if (adminSearcher != null) {
                if (user.uid == "lEFl9NaZUxUNmfYdd7lfqliiy3z2") {
                    adminSearcher.style.display = 'block';
                } else {
                    adminSearcher.style.display = 'none';
                }
            }
        } else {
            console.log("There are no users logged in.")

            if (loginBtn != null) {
                loginBtn.style.display = 'block';
            }
            if (registerBtn != null) {
                registerBtn.style.display = 'block';
            }
            if (logoutBtn != null) {
                logoutBtn.style.display = 'none';
            }
            if (myProfile != null) {
                myProfile.style.display = 'none';
            }

            adminSearcher.style.display = 'none';
        }
    });
}

export function logMeOut() {
    firebase.auth().signOut().then(() => {
        console.log("User has been logged out.")
    }).catch((error) => {
        console.log(error.message)
    });
}

export function adminCheck() {
    let loc = window.location.href;

    if (loc.indexOf('inscripciones') != -1) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                if (user.uid != "lEFl9NaZUxUNmfYdd7lfqliiy3z2") {
                    window.location.href = '/';
                }

                let logoutBtn = document.getElementById("logout-btn");
                let myProfile = document.getElementById("my-profile-btn");

                logoutBtn.style.display = 'block';
                myProfile.style.display = 'block';


            } else {
                window.location.href = '/';
            }
        });
    }
}