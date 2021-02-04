window.onload = init;

function init() {
    console.log('**--JS initialized.--**');

    var timer = document.getElementById("timer"); // Temporizador
    var totalSeconds = 0;
    var secondsForHours = 0;
    setInterval(function() {
        ++totalSeconds;
        ++secondsForHours;
        var seconds, minutes, hours, time;

        seconds = totalSeconds % 60;
        minutes = parseInt(totalSeconds / 60);
        hours = parseInt(secondsForHours / 3600);

        if (minutes == 60) {
            totalSeconds = 0;
            seconds = 00;
            minutes = 00;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (hours < 10) {
            hours = "0" + hours;
        };

        time = hours + ":" + minutes + ":" + seconds;
        timer.setAttribute('value', time);
    }, 1000);

    var controller = document.querySelector('#controller'); // Controlador de Musica
    controller.addEventListener('mouseenter', function() {
        var caseControl = document.getElementById('controller-case');
        var caseState = caseControl.getAttribute('color');
        var caseControlText = document.getElementById('radio-txt');

        if (caseState == 'red') {
            caseControl.setAttribute('color', 'green');
            caseControlText.setAttribute('value', 'On');
            controller.components.sound.playSound();
            console.log("Current color: " + caseState);
        } else if (caseState == 'green') {
            caseControl.setAttribute('color', 'red');
            caseControlText.setAttribute('value', 'Off');
            controller.components.sound.pauseSound();
            console.log("Current color: " + caseState);
        } else {
            console.log("##Case-Controller: Something went wrong...");
        }
    });

    var covidLbl, ace2Lbl, influenzaLbl, covidMdl, ace2Mdl, influenzaMdl; // Controlador de Modelos
    covidLbl = document.getElementById('covid-label');
    ace2Lbl = document.getElementById('ace2-label');
    influenzaLbl = document.getElementById('influenza-label');
    covidMdl = document.getElementById('covid-3d');
    ace2Mdl = document.getElementById('ace2-3d');
    influenzaMdl = document.getElementById('influenza-3d');

    var clicker = document.getElementById('au-models');

    covidLbl.addEventListener('mouseenter', function() {
        covidMdl.setAttribute('visible', 'true');
        ace2Mdl.setAttribute('visible', 'false');
        influenzaMdl.setAttribute('visible', 'false');
        clicker.components.sound.playSound(); // clicker
    });
    ace2Lbl.addEventListener('mouseenter', function() {
        covidMdl.setAttribute('visible', 'false');
        ace2Mdl.setAttribute('visible', 'true');
        influenzaMdl.setAttribute('visible', 'false');
        clicker.components.sound.playSound(); // clicker
    });
    influenzaLbl.addEventListener('mouseenter', function() {
        covidMdl.setAttribute('visible', 'false');
        ace2Mdl.setAttribute('visible', 'false');
        influenzaMdl.setAttribute('visible', 'true');
        clicker.components.sound.playSound(); // clicker
    });

    var covidFrame, hiwFrame, ace2Frame; // GIF Frame Controller
    covidFrame = document.getElementById('covid-gif-frame');
    hiwFrame = document.getElementById('influenza-gif-frame');
    ace2Frame = document.getElementById('ace2-gif-frame');

    covidLbl.addEventListener('mouseenter', function() {
        covidFrame.setAttribute('visible', 'true');
        ace2Frame.setAttribute('visible', 'false');
        hiwFrame.setAttribute('visible', 'false');
    });
    ace2Lbl.addEventListener('mouseenter', function() {
        covidFrame.setAttribute('visible', 'false');
        ace2Frame.setAttribute('visible', 'true');
        hiwFrame.setAttribute('visible', 'false');
    });
    influenzaLbl.addEventListener('mouseenter', function() {
        covidFrame.setAttribute('visible', 'false');
        ace2Frame.setAttribute('visible', 'false');
        hiwFrame.setAttribute('visible', 'true');
    });

    var exit = document.getElementById('exit');
    exit.addEventListener('mouseenter', function() {
        clicker.components.sound.playSound(); // clicker
        var exitter = confirm('¿Quieres salir del entorno?');
        if (exitter == true) {
            window.location.href = "/index.html";
        }
    });
};