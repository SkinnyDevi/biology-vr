import { checkIsUserLoggedIn, logMeOut } from './loginCheck.js';

window.onload = init;

var entryExists = false;
var sentValid = false;

function init() {
    console.log("*--JS Initialized--*");
    var formObject = document.getElementById('joinForm');
    var logoutBtn = document.getElementById("logout-btn");
    checkIsUserLoggedIn();

    logoutBtn.addEventListener("click", logMeOut);
    formObject.addEventListener('submit', formValidation);
    formObject.addEventListener('reset', function() {
        document.getElementById("form-submit").style.display = "inline";
        document.getElementsByClassName("submit-btn-overwrite")[0].style.display = "none";
        document.getElementsByClassName("submit-btn-overwrite")[0].classList.remove("overwrite-active");
        document.getElementById("err-overwrite").style.display = "none";
        document.getElementById("err-override-denied").style.display = "none";
        console.log("Resetted");
    });
}

function formValidation(event) {
    event.preventDefault();

    var formObject = event.target;

    var name = formObject.name.value;
    var errName = document.getElementById("err-name");
    var surname = formObject.surname.value;
    var errSurname = document.getElementById("err-surname");
    var email = formObject.email.value;
    var errEmail = document.getElementById("err-email");
    var dni = formObject.dni.value;
    var errDni = document.getElementById("err-dni");
    var hours = formObject.hours.value;
    var errHours = document.getElementById("err-hours");
    var sex = formObject.sex.value;
    var errSex = document.getElementById("err-sex");
    var terms = formObject.terms.checked;
    var errTerms = document.getElementById("err-terms");

    var error = false;

    if (!name || name.length < 2) {
        error = true;
        errName.style.display = "block";
    } else {
        errName.style.display = "none";
    }

    if (!surname || surname.length < 3) {
        error = true;
        errSurname.style.display = "block";
    } else {
        errSurname.style.display = "none";
    }

    if (!email || email.indexOf('@') == -1) {
        error = true;
        errEmail.style.display = "block";
    } else {
        errEmail.style.display = "none";
    }

    if (!dni || dni.length != 9) {
        error = true;
        errDni.style.display = "block";
    } else {
        var realityCheck = dniRealityCheck(true, dni);
        if (realityCheck == true) {
            errDni.style.display = "none";
        } else {
            error = true;
            errDni.style.display = "block";
        }
    }

    if (hours == "0") {
        error = true;
        errHours.style.display = "block";
    } else {
        errHours.style.display = "none";
    }

    if (!sex) {
        error = true;
        errSex.style.display = "block";
    } else {
        errSex.style.display = "none";
    }

    if (terms == false) {
        error = true;
        errTerms.style.display = "block";
    } else {
        errTerms.style.display = "none";
    }

    entryCheck(error, formObject);
}

function dniRealityCheck(check, dni) {
    if (check == true) {
        var dniNum = parseInt(dni);
        var ABCD = "TRWAGMYFPDXBNJZSQVHLCKE";
        var abcd = "TRWAGMYFPDXBNJZSQVHLCKE";
        var dniLetter = dni.slice(-1);
        var dniLetterAuthBig = ABCD.slice(dniNum % 23, (dniNum % 23) + 1);
        var dniLetterAuth = abcd.slice(dniNum % 23, (dniNum % 23) + 1);

        if (dniLetterAuthBig == dniLetter || dniLetterAuth == dniLetter) {
            return true;
        } else {
            return false;
        }
    } else {
        var dniLetter = dni.slice(-1);
        var ABCD = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var abcd = "abcdefghijklmnopqrstuvwxyz"
        if (ABCD.includes(dniLetter) || abcd.includes(dniLetter)) {
            return true;
        } else {
            return false;
        }
    }
}

function entryCheck(errorCatcher, formObject) {
    refSubmissions = firebase.database().ref().child("submissions");

    var spinSubmit = document.getElementById("spinner-submit");
    var spinOverwrite = document.getElementById("spinner-overwrite");

    if (!errorCatcher) {
        spinSubmit.style.display = "inline-block";
        refSubmissions.orderByChild('dni').equalTo(formObject.dni.value).once("value", function(snap) {
            entryExists = false;
            var childToOverwrite = "";

            snap.forEach(function(data) {
                childToOverwrite = data.key;
                var data = data.val()

                if (data.dni == formObject.dni.value) {
                    entryExists = true;
                }
            });

            console.log(entryExists + " after snap")
            var activeOverwrite = document.getElementsByClassName("overwrite-active")[0];
            if (entryExists == true) {
                if (activeOverwrite == null) {
                    spinSubmit.style.display = "none";
                    console.log("Overwrite button pops up now.");
                    document.getElementById("form-submit").style.display = "none";
                    document.getElementsByClassName("submit-btn-overwrite")[0].style.display = "inline";
                    document.getElementsByClassName("submit-btn-overwrite")[0].classList.add("overwrite-active");
                    document.getElementById("err-overwrite").style.display = "block";
                } else if (activeOverwrite != null) {
                    spinOverwrite.style.display = "inline-block"
                    console.log("Data should be sent to override the previous one since the button override was clicked");
                    pushFormObjectData(formObject, true, childToOverwrite);
                }
            } else {
                console.log("Data to be sent to the database.");
                pushFormObjectData(formObject, false);
            }
        });
    } else {
        console.log("Skipped check - missing fields")
    }
}

function pushFormObjectData(formObject, overwriteState, childToUpdate) {
    var refDB = firebase.database().ref();
    var refSubmissions = firebase.database().ref().child("submissions");

    var spinOverwrite = document.getElementById("spinner-overwrite");

    firebase.auth().onAuthStateChanged((user) => {
        refSubmissions.orderByChild('uid').equalTo(user.uid).once("value", function(snap) {
            var overridePower = true;

            snap.forEach(function(data) {
                var data = data.val();

                if (data.overriden == true) {
                    overridePower = false;
                }
            });
            if (overridePower == true) {
                if (overwriteState == false) {
                    refSubmissions.push({
                        uid: user.uid,
                        name: formObject.name.value,
                        surname: formObject.surname.value,
                        sex: formObject.sex.value,
                        dni: formObject.dni.value,
                        email: formObject.email.value,
                        hours: formObject.hours.value,
                        terms: formObject.terms.checked,
                        promotions: formObject.promotions.checked,
                        approval: 2,
                        overriden: false
                    }).then(() => {
                        window.location.href = "inscripcion-verificada";
                    })

                } else if (overwriteState == true) {
                    refDB.child("submissions/" + childToUpdate).update({
                        uid: user.uid,
                        name: formObject.name.value,
                        surname: formObject.surname.value,
                        sex: formObject.sex.value,
                        dni: formObject.dni.value,
                        email: formObject.email.value,
                        hours: formObject.hours.value,
                        terms: formObject.terms.checked,
                        promotions: formObject.promotions.checked,
                        approval: 2,
                        overriden: true
                    }).then(() => {
                        window.location.href = "inscripcion-verificada";
                    })
                }
            } else {
                spinOverwrite.style.display = "none";
                document.getElementById("err-overwrite").style.display = "none";
                document.getElementById("err-override-denied").style.display = "block";
                document.getElementsByClassName("submit-btn-overwrite")[0].style.display = "none";
                document.getElementsByClassName("submit-btn-overwrite")[0].classList.remove("overwrite-active");
                // Here goes stuff to do in HTML to warn the user it can't override
            }
        })
    });
}