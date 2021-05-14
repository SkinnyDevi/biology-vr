import { adminCheck } from './loginCheck.js';

window.onload = submissionFilterInit;

var pullExists = false;

function submissionFilterInit() {
    console.log("*--JS Initialized--**");
    adminCheck();
    var filterObject = document.getElementById("submission-searcher");
    var registryDeleteListener = document.getElementById("registry-delete-btn");
    var registryDeletionObject = document.getElementById("delete-registry-form");
    filterObject.addEventListener("submit", filterResponse);
    registryDeleteListener.addEventListener("click", cageController);
    registryDeletionObject.addEventListener("submit", registryDeletion);
}

function filterResponse(event) {
    event.preventDefault();

    var filterObject = event.target;

    var dni = filterObject.dni.value;

    if (!dni) {
        existentPull(pullExists);
    } else {
        mainFilter(dni);
    }
}

function mainFilter(dni) {
    let refSubmissions = firebase.database().ref().child("submissions");

    refSubmissions.orderByChild('dni').equalTo(dni).on("value", function(snap) {
        var name = document.getElementById("filter-name");
        var surname = document.getElementById("filter-surname");
        var sex = document.getElementById("filter-sex");
        var dni = document.getElementById("filter-dni");
        var email = document.getElementById("filter-email");
        var hours = document.getElementById("filter-hours");
        var terms = document.getElementById("filter-terms");
        var approval = document.getElementById("filter-approval");
        pullExists = false;

        snap.forEach(function(data) {
            var data = data.val();

            name.innerHTML = data.name;
            surname.innerHTML = data.surname;
            sex.innerHTML = data.sex;
            dni.innerHTML = data.dni;
            email.innerHTML = data.email;
            if (data.hours == 1) {
                hours.innerHTML = data.hours + " hora.";
            } else {
                hours.innerHTML = data.hours + " horas.";
            }
            terms.innerHTML = "Si."

            var approvalState = data.approval;
            if (approvalState == 2) {
                pullExists = true;
                approval.innerHTML = "En proceso.";
            } else if (approvalState == 1) {
                pullExists = true;
                if (data.sex == "Hombre") {
                    approval.innerHTML = "Aceptado.";
                } else {
                    approval.innerHTML = "Aceptada.";
                }
            } else if (approvalState == 0) {
                pullExists = true;
                if (data.sex == "Hombre") {
                    approval.innerHTML = "No aceptado.";
                } else {
                    approval.innerHTML = "No aceptada.";
                }
            }
        });
        existentPull(pullExists);
    });
}

function existentPull(pull) {
    var filterTable = document.getElementById("filter-table");
    var responseCage = document.getElementById("filtered-response");
    var name = document.getElementById("filter-name");
    var surname = document.getElementById("filter-surname");
    var sex = document.getElementById("filter-sex");
    var dni = document.getElementById("filter-dni");
    var email = document.getElementById("filter-email");
    var hours = document.getElementById("filter-hours");
    var terms = document.getElementById("filter-terms");
    var approval = document.getElementById("filter-approval");

    if (pull) {
        responseCage.innerHTML = "Resultados encontrados:";
        filterTable.style.display = "table";
        cageController();
    } else {
        responseCage.innerHTML = 'No han aparecido resultados con el filtro proporcionado.';
        name.innerHTML = "";
        surname.innerHTML = "";
        sex.innerHTML = "";
        dni.innerHTML = "";
        email.innerHTML = "";
        hours.innerHTML = "";
        terms.innerHTML = "";
        approval.innerHTML = "";
        filterTable.style.display = "none";
        cageController();
    }
}

function cageController() {
    var filterTable = document.getElementById("filter-table");
    var filterObject = document.getElementById("dni-filter");
    var deleteCage = document.getElementById("delete-cage");
    var filterDeletionErr = document.getElementById("no-filter-deletion");

    var filterDni = filterObject.value;

    if (!filterDni || filterTable.style.display == "none") {
        filterDeletionErr.style.display = "block";
        if (deleteCage.style.display == "block") {
            deleteCage.style.display = "none";
        }
    } else if (filterDni && filterTable.style.display == "table") {
        filterDeletionErr.style.display = "none";

        if (deleteCage.style.display == "none") {
            deleteCage.style.display = "block";
            filterDeletionErr.style.display = "none";
        } else {
            deleteCage.style.display = "none"
        }
    }

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

function registryDeletion(event) {
    event.preventDefault();

    var registryDeletionObject = event.target;

    var dni = registryDeletionObject.dni.value;
    var dniErr = document.getElementById("dni-registry-delete-err");
    var email = registryDeletionObject.email.value;
    var emailErr = document.getElementById("email-registry-delete-err");

    var error = false;

    if (!dni || dni.length != 9) {
        error = true;
        dniErr.style.display = "block";
    } else {
        var realityCheck = dniRealityCheck(true, dni);
        if (realityCheck == true) {
            dniErr.style.display = "none";
        } else {
            error = true;
            dniErr.style.display = "block";
        }
    }

    if (!email || email.indexOf('@') == -1) {
        error = true;
        emailErr.style.display = "block";
    } else {
        emailErr.style.display = "none";
    }

    if (!error) {
        refDB = firebase.database().ref();
        refSubmissions = firebase.database().ref().child("submissions");

        refSubmissions.orderByChild('dni').equalTo(dni).on("value", function(snap) {
            var registryKey = "";
            var matching = false;

            snap.forEach(function(data) {
                registryKey = data.key;
                var data = data.val();

                if (data.dni == dni && data.email == email) {
                    matching = true;
                }

            })
            var matchErr = document.getElementById("match-err");
            if (matching == true) {
                matchErr.style.display = "none";
                setTimeout(function() {
                    var lastOneHonestly = confirm("¿Éstas seguro de que quieres borrar este registro?");
                    if (lastOneHonestly == true) {
                        refSubmissions.orderByChild('dni').equalTo(dni).on("value", function(snap) {
                            var keyToDelete = "";
                            snap.forEach(function(data) {
                                keyToDelete = data.key;
                            })
                            console.log(keyToDelete);

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
                        })
                    }
                }, 300);
                setTimeout(function() {
                    window.location.reload();
                }, 500);
            } else {
                matchErr.style.display = "block";
            }
        });
    }
}