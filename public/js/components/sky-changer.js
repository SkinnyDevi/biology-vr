AFRAME.registerComponent('sky-changer', {
    schema: {
        img: { type: 'string' }
    },

    init: function() {
        var data = this.data;
        var el = this.el;

        el.addEventListener('mouseenter', function() {
            var sky = document.querySelector('#sky');
            var clicker = document.getElementById('au-sky');
            sky.setAttribute('src', data.img);
            clicker.components.sound.playSound();
        });
    },
});