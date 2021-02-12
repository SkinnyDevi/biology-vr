window.onload = init;

function init() {
    var registerForm = document.getElementById("form-register");
    var imageFileHolder = document.getElementById("pfp-image-file");

    registerForm.addEventListener("submit", registrationProtocol);
    imageFileHolder.addEventListener('change', fileLabelChange);
}

function registrationProtocol(event) {
    event.preventDefault();

    var registerForm = event.target;

    var name = registerForm.name.value;
    var surname = registerForm.surname.value;
    var email = registerForm.email.value;
    var password = registerForm.password.value;
    var password2 = registerForm.password2.value;
    var imageFile = registerForm.imageFile.value;
    var imgFileName = (registerForm.imageFile.value).substring(12)

    var errName = document.getElementById("err-name-reg");
    var errSurname = document.getElementById("err-surname-reg");
    var errEmail = document.getElementById("err-email-reg");
    var errPassword = document.getElementById("err-password-reg");
    var errPassConfirm = document.getElementById("err-password-2-reg");
    var errImgFile = document.getElementById("image-file-err");
    var errExt = document.getElementById("ext-file-err");

    var spinnerRegister = document.getElementById("spinner-register");
    spinnerRegister.style.display = "inline-block";

    var formErr = false;
    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    var regexTest = regex.test(String(email));

    if (!name || name.length < 2) {
        formErr = true;
        errName.style.display = 'block';
    } else {
        errName.style.display = 'none';
    }

    if (!surname || surname.length <= 4) {
        formErr = true;
        errSurname.style.display = 'block';
    } else {
        errSurname.style.display = 'none';
    }

    if (!regexTest) {
        formErr = true;
        errEmail.style.display = 'block';
    } else {
        errEmail.style.display = 'none';
    }

    var passwordChecked = passwordCheck(password);
    if (passwordChecked) {
        formErr = true;
        errPassword.style.display = 'block';
    } else {
        errPassword.style.display = 'none';
        if (password == password2) {
            errPassConfirm.style.display = 'none';
        } else {
            formErr = true;
            errPassConfirm.style.display = 'block';
        }
    }

    if (imageFile) {
        var imageFileExt = imgFileName.slice(-4);
        var imageExts = ['png', 'jpg', 'jpeg', 'webp'];;
        if (imageFileExt.includes('.')) {
            imageFileExt = imageFileExt.slice(1);
        }

        if (!imageExts.includes(imageFileExt)) {
            formErr = true;
            errExt.style.display = 'block';
        } else {
            errExt.style.display = 'none';
        }
    }

    if (!formErr) {
        console.log("registry correct to send")
        userRegisterFB(email, password, registerForm);
    } else {
        spinnerRegister.style.display = "none";
    }
}

function passwordCheck(password) {
    var error = false;
    var currentPassword = password;

    if (password.length < 6) {
        error = true;
        console.log("Length not correct")
    }

    if (password.toLowerCase() == currentPassword) {
        error = true;
        console.log("Lower case not correct");
    }

    if (password.toUpperCase() == currentPassword) {
        error = true;
        console.log("Upper case not correct");
    }

    if (!(/\d/.test(password))) {
        error = true;
        console.log("It doesnt contain a number");
    }

    if (!password) {
        error = true;
        console.log("Password is empty");
    }

    return error;
}

function userRegisterFB(userEmail, userPassword, registerInfo) {
    var firebaseAU = firebase.auth();
    var registerForm = registerInfo;

    var email = userEmail;
    var password = userPassword;

    var existingAcc = "auth/email-already-in-use";

    var spinnerRegister = document.getElementById("spinner-register");

    firebaseAU.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            userRegisterDB(registerForm, user.uid);
            userImageUpload(registerForm, user.uid);

        })
        .catch((error) => {
            spinnerRegister.style.display = "none";
            console.log(error.message)
            if (error.code = existingAcc) {
                document.getElementById("existing-acc-err").style.display = 'block';
            } else {
                document.getElementById("existing-acc-err").style.display = 'none';
            }
        })
}


function userRegisterDB(registerForm, userUID) {
    var refUsers = firebase.database().ref().child("users");

    refUsers.push({
        uid: userUID,
        name: registerForm.name.value,
        surname: registerForm.surname.value,
        email: registerForm.email.value,
        password: registerForm.password.value
    });
}

function fileLabelChange() {
    var fileLabel = document.getElementById("file-label");
    var registerForm = document.getElementById("form-register");

    fileLabel.innerHTML = (registerForm.imageFile.value).substring(12);
}

function userImageUpload(registerForm, userUID) {
    var userPFPRef = firebase.storage().ref('userProfilePicture/' + userUID);

    userPFPRef.put(registerForm.imageFile.files[0]).then(() => {
        console.log("Image uploaded.");
        setTimeout(function() {
            window.location.href = "profile";
        }, 800);
    })
}