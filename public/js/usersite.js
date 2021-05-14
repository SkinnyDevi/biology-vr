import { checkIsUserLoggedIn, logMeOut } from './loginCheck.js';

window.onload = userSiteInit;

function userSiteInit() {
    console.log("*--JS Initialized--*");;
    var userTabInfo = document.getElementById("user-tab-info");
    var userTabSubs = document.getElementById("user-tab-submissions");
    var userTabSettings = document.getElementById("user-tab-settings");
    var logoutBtn = document.getElementById("logout-btn");
    var passwordChange = document.getElementById("form-change-pass");
    var showPassword = document.getElementById("show-pass-change");
    var deleteAcc = document.getElementById("delete-registry-form");
    var changePfpImage = document.getElementById("pfp-image-change-btn");
    var changePfpInput = document.getElementById("pfp-image-change");
    var deletePfpImage = document.getElementById("image-delete-confirm");
    var extFileErr = document.getElementById("ext-file-err");
    logoutBtn.style.display = 'block';

    displayManager(0);
    checkIsUserLoggedIn();
    userSeacher();

    logoutBtn.addEventListener("click", logMeOut);
    userTabInfo.addEventListener("click", userInfo);
    userTabSubs.addEventListener("click", userSubs);
    userTabSettings.addEventListener("click", userSettings);
    passwordChange.addEventListener("submit", updatePassword);
    showPassword.addEventListener("click", function() {
        var newPass = document.getElementById("pass-change-new");
        if (newPass.type == "password") {
            newPass.type = "text";
        } else {
            newPass.type = "password";
        }
    })
    deleteAcc.addEventListener("submit", accDeletion);
    changePfpImage.addEventListener("click", function() {
        changePfpInput.click();
        changePfpInput.addEventListener("change", () => {
            var imageFileExt = (changePfpInput.value).slice(-4);
            var imageExts = ['png', 'jpg', 'jpeg', 'webp'];;
            if (imageFileExt.includes('.')) {
                imageFileExt = imageFileExt.slice(1);
            }

            if (!imageExts.includes(imageFileExt)) {
                extFileErr.style.display = 'inline';
                setTimeout(() => {
                    extFileErr.style.display = 'none';
                }, 3000);

            } else {
                extFileErr.style.display = 'none';
                changeImage(changePfpInput.files[0]);
            }

        })
    });
    deletePfpImage.addEventListener("click", deleteImage);
}

function displayManager(entity) {
    var userTabInfo = document.getElementById("user-tab-info");
    var userTabSubs = document.getElementById("user-tab-submissions");
    var userTabSettings = document.getElementById("user-tab-settings");

    var infoTab = document.getElementById("user-info");
    var filterTable = document.getElementById("filter-table");
    var settingsTab = document.getElementById("user-settings");

    userTabInfo.classList.remove('user-tab-active');
    userTabSubs.classList.remove('user-tab-active');
    userTabSettings.classList.remove('user-tab-active');

    userTabInfo.classList.add('user-tab-standby');
    userTabSubs.classList.add('user-tab-standby');
    userTabSettings.classList.add('user-tab-standby');

    userTabInfo.classList.remove('list-group-item-primary');
    userTabSubs.classList.remove('list-group-item-primary');
    userTabSettings.classList.remove('list-group-item-primary');

    if (entity == 0) {
        userTabInfo.classList.remove('user-tab-standby');
        userTabInfo.classList.add('user-tab-active');
        userTabInfo.classList.add('list-group-item-primary');

        infoTab.style.display = 'block';
        filterTable.style.display = 'none';
        settingsTab.style.display = 'none';
    } else if (entity == 1) {
        userTabSubs.classList.remove('user-tab-standby');
        userTabSubs.classList.add('user-tab-active');
        userTabSubs.classList.add('list-group-item-primary');

        infoTab.style.display = 'none';
        filterTable.style.display = 'block';
        settingsTab.style.display = 'none';
    } else if (entity == 2) {
        userTabSettings.classList.remove('user-tab-standby');
        userTabSettings.classList.add('user-tab-active');
        userTabSettings.classList.add('list-group-item-primary');

        infoTab.style.display = 'none';
        filterTable.style.display = 'none';
        settingsTab.style.display = 'block';
    }
}

function userSeacher() {
    var refUsers = firebase.database().ref().child("users");
    var refSubmissions = firebase.database().ref().child("submissions");

    var pfpName = document.getElementById("pfp-name");
    var pfpSurname = document.getElementById("pfp-surname");
    var pfpEmail = document.getElementById("pfp-email");
    var pfpPass = document.getElementById("pfp-password");
    var pfpImage = document.getElementById("pfp-image");

    firebase.auth().onAuthStateChanged(function(user) {
        var uid = user.uid;
        // Profile Tab
        refUsers.orderByChild('uid').equalTo(uid)
            .once("value", function(snap) {
                snap.forEach(function(data) {
                    var data = data.val();

                    pfpName.innerHTML = data.name;
                    pfpSurname.innerHTML = data.surname;
                    pfpEmail.innerHTML = data.email;
                })
            })

        // Inscriptions tab
        refSubmissions.orderByChild('uid').equalTo(uid).on("value", function(snap) {
            var userInfo = ""
            var userData = null;
            snap.forEach((data) => {
                var data = data.val();

                if (user.uid == data.uid) {
                    userInfo = data.uid;
                    userData = data;
                }
            })

            var userTabSubs = document.getElementById("user-tab-submissions");
            if (userInfo != "") {
                userTabSubs.classList.remove('disabled');
                userTabSubs.style.textDecoration = 'none';

                var name = document.getElementById("filter-name");
                var surname = document.getElementById("filter-surname");
                var sex = document.getElementById("filter-sex");
                var dni = document.getElementById("filter-dni");
                var email = document.getElementById("filter-email");
                var hours = document.getElementById("filter-hours");
                var terms = document.getElementById("filter-terms");
                var approval = document.getElementById("filter-approval");

                name.innerHTML = userData.name;
                surname.innerHTML = userData.surname;
                sex.innerHTML = userData.sex;
                dni.innerHTML = userData.dni;
                email.innerHTML = userData.email;
                if (userData.hours > 1) {
                    hours.innerHTML = userData.hours + " horas";
                } else {
                    hours.innerHTML = userData.hours + " hora";
                }
                terms.innerHTML = "Sí.";
                if (userData.approval == 0) {
                    if (userData.sex == 'Hombre') {
                        approval.innerHTML = "No aceptado.";
                    } else {
                        approval.innerHTML = "No aceptada.";
                    }
                } else if (userData.approval == 2) {
                    approval.innerHTML = "Solicitud en proceso...";
                } else {
                    if (userData.sex == 'Hombre') {
                        approval.innerHTML = "Aceptado.";
                    } else {
                        approval.innerHTML = "Aceptada.";
                    }
                }

            } else {
                userTabSubs.classList.add('disabled');
                userTabSubs.style.textDecoration = 'line-through';
            }
        });

        // Profile picture download

        var storageRef = firebase.storage().ref();
        storageRef.child('userProfilePicture/' + user.uid).getMetadata()
            .then((metadata) => {
                var fileType = metadata.contentType;

                if (fileType.includes('image/')) {
                    storageRef.child('userProfilePicture/' + user.uid)
                        .getDownloadURL().then((url) => {
                            pfpImage.setAttribute('src', url);
                        })
                }
            })
    });
}

function changeImage(imageFile) {
    firebase.auth().onAuthStateChanged((user) => {
        var userUID = user.uid;
        var userPFPRef = firebase.storage().ref('userProfilePicture/' + userUID);

        userPFPRef.delete().then(() => {
            console.log("Image deleted");
            userPFPRef.put(imageFile).then(() => {
                console.log("Image uploaded.");
                setTimeout(function() {
                    window.location.reload();
                }, 800);
            })
        }).catch((error) => {
            console.log(error.message);
            if (error.code == "storage/object-not-found") {
                userPFPRef.put(imageFile).then(() => {
                    console.log("Image uploaded.");
                    setTimeout(function() {
                        window.location.reload();
                    }, 800);
                })
            }
        })
    })
}

function deleteImage() {
    firebase.auth().onAuthStateChanged((user) => {
        var userUID = user.uid;
        var userPFPRef = firebase.storage().ref('userProfilePicture/' + userUID);

        userPFPRef.delete().then(() => {
            console.log("Image deleted");
            setTimeout(function() {
                window.location.reload();
            }, 800);
        }).catch((error) => {
            console.log(error.message);
        })
    })
}

function updatePassword(event) {
    event.preventDefault();

    var passChangeForm = event.target;

    var currentPass = passChangeForm.passwordConfirm.value;
    var newPass = passChangeForm.password.value
    var emptyCurrentPass = document.getElementById("change-pass-empty-err");
    var currentPassErr = document.getElementById("change-pass-confirm-err");
    var invalidPassErr = document.getElementById("invalid-pass-err");
    var samePassErr = document.getElementById("same-pass-err");

    var refUsers = firebase.database().ref().child("users");
    var refDB = firebase.database().ref();

    var error = false;

    if (!currentPass) {
        error = true;
        emptyCurrentPass.style.display = 'block';
    } else {
        emptyCurrentPass.style.display = 'none';
    }

    var passwordChecked = passwordCheck(newPass);
    if (passwordChecked) {
        formErr = true;
        invalidPassErr.style.display = 'block';
    } else {
        invalidPassErr.style.display = 'none';
    }

    if (newPass != "" && currentPass != "") {
        if (currentPass == newPass) {
            error = true;
            samePassErr.style.display = 'block';
        } else {
            samePassErr.style.display = 'none';
        }
    }

    if (!error) {
        firebase.auth().onAuthStateChanged((user) => {
            refUsers.orderByChild('uid').equalTo(user.uid)
                .on("value", function(snap) {

                    var currentDBPass = ""
                    var userUpdateKey = ""
                    snap.forEach(function(data) {
                        userUpdateKey = data.key
                        var data = data.val();

                        currentDBPass = data.password
                    })

                    if (currentPass == currentDBPass) {
                        user.updatePassword(newPass).then(function() {
                            console.log("The password has been updated successfully.");
                            refDB.child("users/" + userUpdateKey).update({
                                password: newPass
                            });
                            setTimeout(function() {
                                window.location.reload();
                            }, 200);
                        }).catch(function(error) {
                            console.log("There was an error when changing the password.");
                            var recentLogErr = "auth/requires-recent-login";
                            if (error.code == recentLogErr) {
                                window.location.href = "login-verify";
                            }
                        })
                    }

                    if (currentPass != currentDBPass) {
                        currentPassErr.style.display = 'block';
                    } else {
                        currentPassErr.style.display = 'none';
                    }
                })
        })
    }
}

function accDeletion(event) {
    event.preventDefault();

    var deleteAccForm = event.target;

    var email = deleteAccForm.email.value;
    var password = deleteAccForm.password.value;
    var emailErr = document.getElementById("email-registry-delete-err");
    var passErr = document.getElementById("password-registry-delete-err");
    var mismatchErr = document.getElementById("mismatch-err");

    var refUsers = firebase.database().ref().child("users");
    var refSubmissions = firebase.database().ref().child("submissions");
    var refDB = firebase.database().ref();

    var error = false;

    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    var regexTest = regex.test(String(email));
    if (!regexTest) {
        error = true;
        emailErr.style.display = 'block';
    } else {
        emailErr.style.display = 'none';
    }

    if (!password) {
        error = true;
        passErr.style.display = 'block';
    } else {
        passErr.style.display = 'none';
    }

    if (!error) {
        firebase.auth().onAuthStateChanged((user) => {
            refUsers.orderByChild('uid').equalTo(user.uid).on("value", function(snap) {

                var userPass = ""
                var userEmail = user.email;
                var userUpdateKey = ""
                snap.forEach(function(data) {
                    userUpdateKey = data.key
                    var data = data.val();

                    userPass = data.password
                })

                if (userPass == password && userEmail == email) {
                    var userPFPRef = firebase.storage().ref('userProfilePicture/' + user.uid);

                    userPFPRef.delete().then(() => {
                        console.log("Image deleted");
                    }).catch((error) => {
                        console.log(error.message);
                    })
                    user.delete().then(function() {
                        // searches and deletes user submissions if any
                        refSubmissions.orderByChild('uid').equalTo(user.uid)
                            .on("value", function(snap) {
                                var keyToDelete = "";
                                snap.forEach(function(data) {
                                    keyToDelete = data.key;
                                })
                                if (keyToDelete != "") {
                                    refDB.child("submissions/" + keyToDelete).update({
                                        name: null,
                                        surname: null,
                                        sex: null,
                                        dni: null,
                                        email: null,
                                        hours: null,
                                        terms: null,
                                        promotions: null,
                                        approval: null,
                                        overriden: null,
                                        uid: null
                                    });
                                }
                            })
                            // deletes user from database

                        refDB.child("users/" + userUpdateKey).update({
                            email: null,
                            password: null,
                            name: null,
                            surname: null,
                            uid: null
                        }).then(() => {
                            console.log("The user was deleted successfully");
                            window.location.href = "/";
                        })
                    }).catch(function(error) {
                        console.log("There was an error when trying to delete the account.");
                        var recentLogErr = "auth/requires-recent-login";
                        if (error.code == recentLogErr) {
                            window.location.href = "login-verify";
                        }
                    })
                }

                if (userPass != password || userEmail != email) {
                    mismatchErr.style.display = 'block';
                } else {
                    mismatchErr.style.display = 'none';
                }
            })
        })
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

function userInfo() {
    displayManager(0);
}

function userSubs() {
    displayManager(1);
}

function userSettings() {
    displayManager(2);
}