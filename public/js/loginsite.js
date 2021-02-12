window.onload = init;

function init() {
    console.log("*--JS Initialized--*");
    var loginBox = document.getElementById("form-login");

    loginBox.addEventListener("submit", loginUser);

    var currentLoc = window.location.href;
    if (currentLoc.includes("userloginverify")) {
        firebase.auth().signOut().then(() => {
            console.log("User has been logged out.")
        }).catch((error) => {
            console.log(error.message)
        });
    }
}

function loginUser(event) {
    event.preventDefault();

    var loginBox = event.target;
    var fbAuth = firebase.auth();

    var email = loginBox.email.value;
    var password = loginBox.password.value;

    var errUser = document.getElementById("err-email-log");
    var errPass = document.getElementById("err-password-log");

    var spinnerLogin = document.getElementById("spinner-login");
    spinnerLogin.style.display = "inline-block";

    fbAuth.signInWithEmailAndPassword(email, password).then((user) => {
        errUser.style.display = 'none';
        errPass.style.display = 'none';

        console.log(email + " has logged in");

        var currentLoc = window.location.href;
        if (currentLoc.includes("userloginverify")) {
            window.location.href = "profile";
        } else {
            window.location.href = "/";
        }
    }).catch((error) => {
        spinnerLogin.style.display = "none";
        var wrongPass = "auth/wrong-password";
        var noUser = "auth/user-not-found";

        if (error.code == wrongPass) {
            errUser.style.display = 'none';
            errPass.style.display = 'block';
            console.log("User entered wrong password");
        }
        if (error.code == noUser) {
            errUser.style.display = 'block';
            errPass.style.display = 'block';
            console.log("User does not exist");
        }
    })
}